import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';
import oracledb from '../config/oracledb-types';

const router = Router();

/**
 * 상차등록 - 지시번호 스캔 조회
 * DB PROCEDURE: SP_PDA_PICKING_SEL
 * IN:  P_BUSI_PLACE('1'), P_LOAD_INDI_NO(상차지시번호)
 * OUT: O_CURSOR, O_OUT_YN, O_OUT_MSG
 */
router.post('/picking-sel', async (req: Request, res: Response) => {
  try {
    const { loadIndiNo } = req.body;

    if (!loadIndiNo || !String(loadIndiNo).trim()) {
      return res.status(400).json({
        status: 'error',
        message: '상차지시번호(지시)를 입력해주세요.'
      });
    }

    const loadIndiNoStr = String(loadIndiNo).trim();

    console.log('--- SP_PDA_PICKING_SEL 호출 ---');
    console.log(`P_BUSI_PLACE  = '1'`);
    console.log(`P_LOAD_INDI_NO = '${loadIndiNoStr}'`);

    const connection = await getConnection();

    try {
      const result = await connection.execute(
        `BEGIN
          SP_PDA_PICKING_SEL(
            :1, :2,
            :3, :4, :5
          );
        END;`,
        [
          '1',           // 1 P_BUSI_PLACE
          loadIndiNoStr, // 2 P_LOAD_INDI_NO
          { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },            // 3 O_CURSOR
          { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },  // 4 O_OUT_YN
          { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 2000 } // 5 O_OUT_MSG
        ]
      );

      const outBinds = result.outBinds as any[];
      const outBindsLen = outBinds?.length ?? 0;

      // 위치 바인드: OUT만 반환되는 경우 [cursor, outYn, outMsg] (길이 3)
      // 전체 반환되는 경우 [..., cursor, outYn, outMsg] (길이 5)
      const cursor    = outBindsLen === 3 ? outBinds[0] : outBinds[2];
      const outYnRaw  = outBindsLen === 3 ? outBinds[1] : outBinds[3];
      const outMsgRaw = outBindsLen === 3 ? outBinds[2] : outBinds[4];
      const outYn  = String(outYnRaw  ?? '').trim().toUpperCase();
      const outMsg = String(outMsgRaw ?? '').trim();

      console.log('SP_PDA_PICKING_SEL OUT:', { outYn, outMsg, cursorPresent: !!cursor });

      if (outYn === 'N') {
        if (cursor) await cursor.close();
        return res.status(400).json({
          status: 'error',
          message: outMsg || '조회 결과가 없습니다.'
        });
      }

      // 커서 데이터 읽기
      const list: any[] = [];
      if (cursor) {
        try {
          const meta = cursor.metaData || [];
          const keys = meta.map((m: any) => (m && m.name) ? String(m.name) : '');
          let batch: any[];
          while ((batch = await cursor.getRows(100)) && batch.length > 0) {
            for (const row of batch) {
              const obj: Record<string, any> = {};
              keys.forEach((key: string, i: number) => {
                const val = (row as any[])[i];
                // Date 객체 변환
                if (val instanceof Date) {
                  obj[key] = val.toISOString();
                } else {
                  obj[key] = val;
                }
              });
              list.push(obj);
            }
          }
        } finally {
          await cursor.close();
        }
      }

      console.log(`SP_PDA_PICKING_SEL 결과 ${list.length}건`);

      return res.json({
        status: 'success',
        outYn,
        outMsg,
        data: list
      });
    } finally {
      await connection.close();
    }
  } catch (error: any) {
    const errMsg  = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('SP_PDA_PICKING_SEL 오류:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    return res.status(500).json({
      status: 'error',
      outYn: 'N',
      outMsg: errMsg,
      message: 'SP_PDA_PICKING_SEL 호출 실패',
      error: errMsg,
      data: [],
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

/**
 * 상차등록 저장 (임시저장 / 최종저장 공용)
 * DB PROCEDURE: SP_PDA_PICKING_SAVE (행별 1회씩 호출)
 * P_END_YN: 'N' = 임시저장, 'Y' = 최종저장
 */
router.post('/picking-save', async (req: Request, res: Response) => {
  try {
    const { endYn, scanDate, loadIndiNo, carNo, rows, user } = req.body;

    if (!endYn || !scanDate || !loadIndiNo || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '필수 파라미터가 누락되었습니다.'
      });
    }

    const endYnStr     = String(endYn).trim().toUpperCase();
    const scanDateStr  = String(scanDate).trim().replace(/\//g, '-');
    const loadIndiNoStr = String(loadIndiNo).trim();
    const carNoStr     = String(carNo ?? '').trim();
    const userStr      = String(user ?? 'UNKNOWN').trim();

    console.log('--- SP_PDA_PICKING_SAVE 호출 시작 ---');
    console.log(`P_END_YN=${endYnStr}, P_SCAN_DATE=${scanDateStr}, P_LOAD_INDI_NO=${loadIndiNoStr}, 행수=${rows.length}`);

    const results: any[] = [];
    let successCount = 0;
    let failedCount  = 0;

    const connection = await getConnection();
    try {
      for (const row of rows) {
        const batchNo      = String(row.batchNo     ?? '').trim();
        const pdaSeq       = Number(row.pdaSeq      ?? 0);
        const loadIndiSerl = Number(row.loadIndiSerl ?? 0);
        const itemCode     = String(row.itemCode    ?? '').trim();
        const loadType     = String(row.loadType    ?? '').trim();
        const sendReqNo    = String(row.sendReqNo   ?? '').trim();
        const sendReqSerl  = String(row.sendReqSerl ?? '').trim();
        const coNo         = String(row.coNo        ?? '').trim();
        const coSerl       = String(row.coSerl      ?? '').trim();
        const qty          = Number(row.qty         ?? 0);
        const pickQty      = Number(row.pickQty     ?? 0);
        const qtyCheck     = String(row.qtyCheck    ?? 'N').trim().toUpperCase();
        const len          = Number(row.len         ?? 0);
        const bdQty        = String(row.bdQty       ?? '').trim();
        const firstRow     = String(row.firstRow    ?? 'N').trim().toUpperCase();

        console.log(`  행[PDA_SEQ=${pdaSeq}, LOAD_INDI_SERL=${loadIndiSerl}, LOAD_TYPE=${loadType}]: BATCH=${batchNo}, ITEM=${itemCode}, QTY=${qty}, PICK_QTY=${pickQty}, QTY_CHECK=${qtyCheck}, LEN=${len}`);

        try {
          const result = await connection.execute(
            `BEGIN
              SP_PDA_PICKING_SAVE(
                p_busi_place    => :p_busi_place,
                p_end_yn        => :p_end_yn,
                p_scan_date     => :p_scan_date,
                p_load_indi_no  => :p_load_indi_no,
                p_load_indi_serl => :p_load_indi_serl,
                p_pda_seq       => :p_pda_seq,
                p_batch_no      => :p_batch_no,
                p_item_code     => :p_item_code,
                p_load_type     => :p_load_type,
                p_send_req_no   => :p_send_req_no,
                p_send_req_serl => :p_send_req_serl,
                p_co_no         => :p_co_no,
                p_co_serl       => :p_co_serl,
                p_qty           => :p_qty,
                p_pick_qty      => :p_pick_qty,
                p_qty_check     => :p_qty_check,
                p_car_no        => :p_car_no,
                p_len           => :p_len,
                p_bd_qty        => :p_bd_qty,
                p_first_row     => :p_first_row,
                p_user          => :p_user,
                o_out_yn        => :o_out_yn,
                o_out_msg       => :o_out_msg
              );
            END;`,
            {
              p_busi_place:     '1',
              p_end_yn:         endYnStr,
              p_scan_date:      scanDateStr,
              p_load_indi_no:   loadIndiNoStr,
              p_load_indi_serl: loadIndiSerl,
              p_pda_seq:        pdaSeq,
              p_batch_no:       batchNo,
              p_item_code:      itemCode,
              p_load_type:      loadType,
              p_send_req_no:    sendReqNo,
              p_send_req_serl:  sendReqSerl,
              p_co_no:          coNo,
              p_co_serl:        coSerl,
              p_qty:            qty,
              p_pick_qty:       pickQty,
              p_qty_check:      qtyCheck,
              p_car_no:         carNoStr,
              p_len:            len,
              p_bd_qty:         bdQty,
              p_first_row:      firstRow,
              p_user:           userStr,
              o_out_yn:  { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },
              o_out_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 2000 }
            }
          );

          const outBinds = result.outBinds as any;
          const outYn  = String(outBinds?.o_out_yn  ?? '').trim().toUpperCase();
          const outMsg = String(outBinds?.o_out_msg ?? '').trim();

          console.log(`  결과: O_OUT_YN=${outYn}, O_OUT_MSG=${outMsg}`);

          if (outYn === 'Y') { successCount++; } else { failedCount++; }
          results.push({ batchNo, itemCode, outYn, outMsg });
        } catch (rowErr: any) {
          failedCount++;
          const errMsg = rowErr?.message ?? 'Unknown error';
          console.error(`  행 처리 오류: BATCH=${batchNo}`, errMsg);
          results.push({ batchNo, itemCode, outYn: 'N', outMsg: errMsg });
        }
      }
    } finally {
      await connection.close();
    }

    console.log(`SP_PDA_PICKING_SAVE 완료: 성공=${successCount}, 실패=${failedCount}`);
    const allSuccess = failedCount === 0;
    return res.json({
      status: allSuccess ? 'success' : 'partial',
      message: allSuccess ? '저장이 완료되었습니다.' : `${successCount}건 성공, ${failedCount}건 실패`,
      successCount,
      failedCount,
      results
    });
  } catch (error: any) {
    const errMsg  = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('SP_PDA_PICKING_SAVE 오류:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    return res.status(500).json({
      status: 'error',
      message: 'SP_PDA_PICKING_SAVE 호출 실패',
      error: errMsg,
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

export default router;
