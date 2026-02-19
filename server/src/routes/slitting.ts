import { Router, Request, Response } from 'express';
import { executeQuery, getConnection } from '../config/database';
import oracledb from 'oracledb';

const router = Router();

/** Oracle SF_GET_PDA_WK 함수 결과를 { value, label, id }[] 로 파싱 (location과 동일 방식) */
function parseFunctionResult(functionResult: any, columnName: string): { value: string; label: string; id: number }[] {
  const toString = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return String(val);
    if (typeof val === 'object') {
      if (val.CODE_NAME) return String(val.CODE_NAME);
      if (val.NAME) return String(val.NAME);
      if (val.CODE) return String(val.CODE);
      if (val.name) return String(val.name);
      if (val.label) return String(val.label);
      if (val.value) return String(val.value);
      return '';
    }
    return String(val);
  };

  const raw = functionResult;
  if (!raw) return [];

  if (typeof raw === 'string') {
    if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any, index: number) => ({
            value: toString(item.CODE ?? item.code ?? item.value),
            label: toString(item.CODE_NAME ?? item.NAME ?? item.name ?? item.label ?? item.CODE ?? item.code ?? item.value),
            id: index + 1
          }));
        }
        return [{
          value: toString(parsed.CODE ?? parsed.code ?? parsed.value),
          label: toString(parsed.CODE_NAME ?? parsed.NAME ?? parsed.name ?? parsed.label ?? parsed.CODE ?? parsed.code ?? parsed.value),
          id: 1
        }];
      } catch {
        if (raw.includes(',')) {
          return raw.split(',').map((item: string, index: number) => ({
            value: item.trim(),
            label: item.trim(),
            id: index + 1
          }));
        }
        return [{ value: raw.trim(), label: raw.trim(), id: 1 }];
      }
    }
    if (raw.includes(',')) {
      return raw.split(',').map((item: string, index: number) => ({
        value: item.trim(),
        label: item.trim(),
        id: index + 1
      }));
    }
    return [{ value: raw.trim(), label: raw.trim(), id: 1 }];
  }

  if (Array.isArray(raw)) {
    return raw.map((item: any, index: number) => ({
      value: toString(item.CODE ?? item.code ?? item.value),
      label: toString(item.CODE_NAME ?? item.NAME ?? item.name ?? item.label ?? item.CODE ?? item.code ?? item.value),
      id: index + 1
    }));
  }

  if (typeof raw === 'object') {
    return [{
      value: toString(raw.CODE ?? raw.code ?? raw.value),
      label: toString(raw.CODE_NAME ?? raw.NAME ?? raw.name ?? raw.label ?? raw.CODE ?? raw.code ?? raw.value),
      id: 1
    }];
  }

  return [{ value: String(raw), label: String(raw), id: 1 }];
}

/**
 * 근무조 목록 조회
 * DB: SF_GET_SHIFT('01','PR09')
 */
router.get('/shifts', async (req: Request, res: Response) => {
  try {
    console.log('Fetching shifts from DB function SF_GET_SHIFT...');
    const result = await executeQuery(
      "SELECT SF_GET_SHIFT('01','PR09') AS SHIFT_LIST FROM DUAL"
    );
    const raw = result.rows?.[0] ? (result.rows[0] as any).SHIFT_LIST : null;
    const data = parseFunctionResult(raw, 'SHIFT_LIST');
    console.log('Parsed shifts:', data);
    res.json({ status: 'success', data });
  } catch (error: any) {
    const errMsg = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('Error fetching shifts:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch shifts',
      error: errMsg,
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

/**
 * 공정 목록 조회
 * DB: SF_GET_PRO_LIST('01') - 공정명 선택
 */
router.get('/process', async (req: Request, res: Response) => {
  try {
    console.log('Fetching process from DB function SF_GET_PRO_LIST...');
    const result = await executeQuery(
      "SELECT SF_GET_PRO_LIST('01') AS PROCESS_LIST FROM DUAL"
    );
    const raw = result.rows?.[0] ? (result.rows[0] as any).PROCESS_LIST : null;
    const data = parseFunctionResult(raw, 'PROCESS_LIST');
    console.log('Parsed process:', data);
    res.json({ status: 'success', data });
  } catch (error: any) {
    const errMsg = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('Error fetching process:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch process',
      error: errMsg,
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

/**
 * 작업장 목록 조회
 * DB: SF_GET_WC_LIST('01','XX') - XX는 선택된 공정코드
 * 공정 선택 시 해당 공정에 속한 작업장 목록 조회 (적재대구분->적재대번호와 유사)
 */
router.get('/equipment/:processCode', async (req: Request, res: Response) => {
  try {
    const { processCode } = req.params;
    console.log('Fetching equipment from DB function SF_GET_WC_LIST with processCode:', processCode);

    if (!processCode) {
      return res.status(400).json({
        status: 'error',
        message: '공정코드가 필요합니다.'
      });
    }

    const result = await executeQuery(
      "SELECT SF_GET_WC_LIST('01', :processCode) AS EQUIPMENT_LIST FROM DUAL",
      { processCode }
    );
    const raw = result.rows?.[0] ? (result.rows[0] as any).EQUIPMENT_LIST : null;
    const data = parseFunctionResult(raw, 'EQUIPMENT_LIST');
    console.log('Parsed equipment:', data);
    res.json({ status: 'success', data });
  } catch (error: any) {
    const errMsg = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('Error fetching equipment:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch equipment',
      error: errMsg,
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

/**
 * 슬리팅 투입 데이터 저장
 * DB PROCEDURE: SP_PDA_PR09080_IN
 * P_BUSI_PLACE: '1' 고정, P_JOB: 'S' 고정
 * P_INPUT_DATE: 선택일자, P_PROC_CODE: 공정코드, P_INPUT_WC_ID: 작업장코드
 * P_SHIFT: 근무조, P_BATCH_NO: 배치번호, P_SEQ: 순번, P_ITEM_CODE: 품목코드
 * P_SCAN_DATE: 스캔일자, P_DATETIME: 스캔시간, P_USER: 로그인유저
 */
router.post('/save-slitting-data', async (req: Request, res: Response) => {
  try {
    const { inputDate, shiftCode, processCode, equipmentCode, rows, user } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '저장할 데이터가 없습니다.'
      });
    }

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: '사용자 정보가 필요합니다.'
      });
    }

    if (!inputDate || !shiftCode || !processCode || !equipmentCode) {
      return res.status(400).json({
        status: 'error',
        message: '일자, 근무조, 공정, 작업장을 모두 선택해주세요.'
      });
    }

    console.log('Saving slitting data:', rows.length, 'items');
    console.log('Header:', { inputDate, shiftCode, processCode, equipmentCode, user });

    const connection = await getConnection();
    const results: any[] = [];
    let hasError = false;
    let errorMessage = '';

    try {
      const inputDateObj = new Date(inputDate + ' 00:00:00');

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        const seq = i + 1;
        const scanDate = item.scanDate || inputDate;
        const scanTime = item.scanTime || '00:00:00';
        const dateTime = `${scanDate} ${scanTime}`;

        const scanDateObj = new Date(scanDate + ' 00:00:00');
        const dateTimeObj = new Date(dateTime);

        const itemCodeVal = item.itemCode ?? item.coilNumber ?? '';
        console.log(`Item ${seq}:`, { batchNumber: item.batchNumber, itemCode: itemCodeVal });

        let result;
        try {
          result = await connection.execute(
            `BEGIN
              SP_PDA_PR09080_IN(
                :P_BUSI_PLACE,
                :P_JOB,
                :P_INPUT_DATE,
                :P_PROC_CODE,
                :P_INPUT_WC_ID,
                :P_SHIFT,
                :P_BATCH_NO,
                :P_SEQ,
                :P_ITEM_CODE,
                :P_SCAN_DATE,
                :P_DATETIME,
                :P_USER,
                :O_OUT_YN,
                :O_OUT_MSG
              );
            END;`,
            {
              P_BUSI_PLACE: { val: '1', dir: oracledb.BIND_IN },
              P_JOB: { val: 'S', dir: oracledb.BIND_IN },
              P_INPUT_DATE: { val: inputDateObj, type: oracledb.DATE, dir: oracledb.BIND_IN },
              P_PROC_CODE: { val: processCode || '', dir: oracledb.BIND_IN },
              P_INPUT_WC_ID: { val: equipmentCode || '', dir: oracledb.BIND_IN },
              P_SHIFT: { val: shiftCode || '', dir: oracledb.BIND_IN },
              P_BATCH_NO: { val: item.batchNumber || '', dir: oracledb.BIND_IN },
              P_SEQ: { val: seq, dir: oracledb.BIND_IN },
              P_ITEM_CODE: { val: itemCodeVal || '', dir: oracledb.BIND_IN },
              P_SCAN_DATE: { val: scanDateObj, type: oracledb.DATE, dir: oracledb.BIND_IN },
              P_DATETIME: { val: dateTimeObj, type: oracledb.DATE, dir: oracledb.BIND_IN },
              P_USER: { val: user, dir: oracledb.BIND_IN },
              O_OUT_YN: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },
              O_OUT_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 2000 }
            }
          );
        } catch (procCallError: any) {
          console.error(`SP_PDA_PR09080_IN 호출 실패 (Item ${seq}):`, procCallError.message);
          throw procCallError;
        }

        const outYnRaw = result.outBinds?.O_OUT_YN;
        const outMsgRaw = result.outBinds?.O_OUT_MSG;
        const outYn = outYnRaw ? String(outYnRaw).trim().toUpperCase() : '';
        const outMsg = outMsgRaw ? String(outMsgRaw).trim() : '';

        results.push({
          index: i,
          batchNumber: item.batchNumber,
          itemCode: itemCodeVal,
          outYn,
          outMsg
        });

        if (outYn === 'Y') {
          console.log(`✅ Item ${seq} 저장 성공: ${item.batchNumber}-${itemCodeVal}`);
        } else {
          hasError = true;
          errorMessage = outMsg || '저장 중 오류가 발생했습니다.';
          console.error(`❌ Item ${seq} 저장 실패: ${outMsg}`);
        }
      }

      await connection.close();

      const allSuccess = results.every(r => String(r.outYn || '').trim().toUpperCase() === 'Y');
      const successCount = results.filter(r => String(r.outYn || '').trim().toUpperCase() === 'Y').length;
      const failedCount = results.length - successCount;

      if (hasError || !allSuccess) {
        const failedItems = results.filter(r => String(r.outYn || '').trim().toUpperCase() !== 'Y');
        return res.status(400).json({
          status: 'error',
          message: errorMessage || `${failedItems.length}건의 데이터 저장에 실패했습니다.`,
          results,
          successCount,
          failedCount
        });
      }

      res.json({
        status: 'success',
        message: '성공적으로 저장되었습니다.',
        results,
        successCount
      });
    } catch (procError: any) {
      if (connection) {
        try {
          await connection.close();
        } catch {
          // ignore
        }
      }
      throw procError;
    }
  } catch (error: any) {
    console.error('Error saving slitting data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save slitting data',
      error: error.message || 'Unknown error',
      errorCode: error.errorNum ?? error.code
    });
  }
});

// 기존 루트
router.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Slitting API' });
});

export default router;
