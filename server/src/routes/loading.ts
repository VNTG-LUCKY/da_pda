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
      message: 'SP_PDA_PICKING_SEL 호출 실패',
      error: errMsg,
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
        const batchNo     = String(row.batchNo    ?? '').trim();
        const itemCode    = String(row.itemCode   ?? '').trim();
        const loadType    = 'sa05_lm10';
        const sendReqNo   = String(row.sendReqNo  ?? '').trim();
        const sendReqSerl = String(row.sendReqSerl ?? '').trim();
        const coNo        = String(row.coNo       ?? '').trim();
        const coSerl      = String(row.coSerl     ?? '').trim();
        const qty         = String(row.qty        ?? '').trim();
        const len         = String(row.len        ?? '').trim();

        console.log(`  행: BATCH=${batchNo}, ITEM=${itemCode}, QTY=${qty}, LEN=${len}, CO_NO=${coNo}, CO_SERL=${coSerl}`);

        try {
          const result = await connection.execute(
            `BEGIN
              SP_PDA_PICKING_SAVE(
                :1, :2, :3, :4, :5,
                :6, :7, :8, :9, :10,
                :11, :12, :13, :14, :15,
                :16, :17
              );
            END;`,
            [
              '1',           // 1  P_BUSI_PLACE
              endYnStr,      // 2  P_END_YN
              scanDateStr,   // 3  P_SCAN_DATE
              loadIndiNoStr, // 4  P_LOAD_INDI_NO
              batchNo,       // 5  P_BATCH_NO
              itemCode,      // 6  P_ITEM_CODE
              loadType,      // 7  P_LOAD_TYPE
              sendReqNo,     // 8  P_SEND_REQ_NO
              sendReqSerl,   // 9  P_SEND_REQ_SERL
              coNo,          // 10 P_CO_NO
              coSerl,        // 11 P_CO_SERL
              qty,           // 12 P_QTY
              carNoStr,      // 13 P_CAR_NO
              len,           // 14 P_LEN
              userStr,       // 15 P_USER
              { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },   // 16 O_OUT_YN
              { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 2000 }  // 17 O_OUT_MSG
            ]
          );

          const outBinds    = result.outBinds as any[];
          const outBindsLen = outBinds?.length ?? 0;
          const outYnRaw    = outBindsLen === 2 ? outBinds[0] : outBinds[15];
          const outMsgRaw   = outBindsLen === 2 ? outBinds[1] : outBinds[16];
          const outYn  = String(outYnRaw  ?? '').trim().toUpperCase();
          const outMsg = String(outMsgRaw ?? '').trim();

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
