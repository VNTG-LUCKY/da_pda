import { Router, Request, Response } from 'express';
import { executeQuery, getConnection } from '../config/database';
import oracledb from 'oracledb';

const router = Router();

/**
 * 적재대구분 목록 조회
 * DB FUNCTION: SF_GET_PDA_WK('PDA')
 */
router.get('/rack-types', async (req: Request, res: Response) => {
  try {
    console.log('Fetching rack types from DB function SF_GET_PDA_WK...');
    
    const result = await executeQuery(
      "SELECT SF_GET_PDA_WK('PDA') AS RACK_TYPE FROM DUAL"
    );
    
    console.log('Function result:', result.rows);
    
    // FUNCTION 결과가 문자열로 반환될 수 있으므로 파싱 필요
    let rackTypes: any[] = [];
    
    if (result.rows && result.rows.length > 0) {
      const functionResult = (result.rows[0] as any).RACK_TYPE;
      console.log('Function result value:', functionResult, 'Type:', typeof functionResult);
      
      // 결과가 null이거나 undefined인 경우
      if (!functionResult) {
        console.warn('Function returned null or undefined');
        return res.json({
          status: 'success',
          data: []
        });
      }
      
      // 안전하게 문자열로 변환하는 헬퍼 함수
      const toString = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return String(val);
        if (typeof val === 'object') {
          // 객체인 경우 CODE_NAME이나 NAME을 우선적으로 사용
          if (val.CODE_NAME) return String(val.CODE_NAME);
          if (val.NAME) return String(val.NAME);
          if (val.CODE) return String(val.CODE);
          if (val.name) return String(val.name);
          if (val.label) return String(val.label);
          if (val.value) return String(val.value);
          // 그 외에는 빈 문자열 반환
          return '';
        }
        return String(val);
      };

      // 결과가 문자열인 경우 파싱
      if (typeof functionResult === 'string') {
        // JSON 형식인지 확인
        if (functionResult.trim().startsWith('[') || functionResult.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(functionResult);
            if (Array.isArray(parsed)) {
              rackTypes = parsed.map((item: any, index: number) => ({
                value: toString(item.CODE || item.code || item.value),
                label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
                id: index + 1
              }));
            } else {
              rackTypes = [{
                value: toString(parsed.CODE || parsed.code || parsed.value),
                label: toString(parsed.CODE_NAME || parsed.NAME || parsed.name || parsed.label || parsed.CODE || parsed.code || parsed.value),
                id: 1
              }];
            }
          } catch (parseError) {
            // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
            if (functionResult.includes(',')) {
              rackTypes = functionResult.split(',').map((item: string, index: number) => ({
                value: item.trim(),
                label: item.trim(),
                id: index + 1
              }));
            } else {
              rackTypes = [{
                value: functionResult.trim(),
                label: functionResult.trim(),
                id: 1
              }];
            }
          }
        } else if (functionResult.includes(',')) {
          // 콤마로 구분된 문자열인 경우
          rackTypes = functionResult.split(',').map((item: string, index: number) => ({
            value: item.trim(),
            label: item.trim(),
            id: index + 1
          }));
        } else {
          // 단일 값인 경우
          rackTypes = [{
            value: functionResult.trim(),
            label: functionResult.trim(),
            id: 1
          }];
        }
      } else if (Array.isArray(functionResult)) {
        // 배열인 경우 - CODE를 value로, CODE_NAME을 label로 사용
        rackTypes = functionResult.map((item: any, index: number) => ({
          value: toString(item.CODE || item.code || item.value),
          label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
          id: index + 1
        }));
      } else if (typeof functionResult === 'object') {
        // 객체인 경우 - CODE를 value로, CODE_NAME을 label로 사용
        rackTypes = [{
          value: toString(functionResult.CODE || functionResult.code || functionResult.value),
          label: toString(functionResult.CODE_NAME || functionResult.NAME || functionResult.name || functionResult.label || functionResult.CODE || functionResult.code || functionResult.value),
          id: 1
        }];
      } else {
        // 기타 타입
        rackTypes = [{
          value: String(functionResult),
          label: String(functionResult),
          id: 1
        }];
      }
    }
    
    console.log('Parsed rack types:', rackTypes);
    
    res.json({
      status: 'success',
      data: rackTypes
    });
  } catch (error: any) {
    const errMsg = error?.message != null ? String(error.message) : 'Unknown error';
    const errCode = error?.errorNum ?? error?.code;
    console.error('Error fetching rack types:', errMsg, errCode != null ? `[${errCode}]` : '');
    if (error?.stack) console.error(error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch rack types',
      error: errMsg,
      ...(errCode != null && { errorCode: errCode })
    });
  }
});

/**
 * 적재대번호 목록 조회
 * DB FUNCTION: SF_GET_PDA_WK_DTL('적재대구분코드값')
 */
router.get('/rack-numbers/:rackTypeCode', async (req: Request, res: Response) => {
  try {
    const { rackTypeCode } = req.params;
    console.log('Fetching rack numbers from DB function SF_GET_PDA_WK_DTL with code:', rackTypeCode);
    
    if (!rackTypeCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Rack type code is required'
      });
    }
    
    const result = await executeQuery(
      "SELECT SF_GET_PDA_WK_DTL(:rackTypeCode) AS RACK_NUMBER FROM DUAL",
      { rackTypeCode }
    );
    
    console.log('Function result:', result.rows);
    
    // FUNCTION 결과가 문자열로 반환될 수 있으므로 파싱 필요
    let rackNumbers: any[] = [];
    
    if (result.rows && result.rows.length > 0) {
      const functionResult = (result.rows[0] as any).RACK_NUMBER;
      console.log('Function result value:', functionResult, 'Type:', typeof functionResult);
      
      // 결과가 null이거나 undefined인 경우
      if (!functionResult) {
        console.warn('Function returned null or undefined');
        return res.json({
          status: 'success',
          data: []
        });
      }
      
      // 안전하게 문자열로 변환하는 헬퍼 함수
      const toString = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return String(val);
        if (typeof val === 'object') {
          // 객체인 경우 CODE_NAME이나 NAME을 우선적으로 사용
          if (val.CODE_NAME) return String(val.CODE_NAME);
          if (val.NAME) return String(val.NAME);
          if (val.CODE) return String(val.CODE);
          if (val.name) return String(val.name);
          if (val.label) return String(val.label);
          if (val.value) return String(val.value);
          // 그 외에는 빈 문자열 반환
          return '';
        }
        return String(val);
      };

      // 결과가 문자열인 경우 파싱
      if (typeof functionResult === 'string') {
        // JSON 형식인지 확인
        if (functionResult.trim().startsWith('[') || functionResult.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(functionResult);
            if (Array.isArray(parsed)) {
              rackNumbers = parsed.map((item: any, index: number) => ({
                value: toString(item.CODE || item.code || item.value),
                label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
                id: index + 1
              }));
            } else {
              rackNumbers = [{
                value: toString(parsed.CODE || parsed.code || parsed.value),
                label: toString(parsed.CODE_NAME || parsed.NAME || parsed.name || parsed.label || parsed.CODE || parsed.code || parsed.value),
                id: 1
              }];
            }
          } catch (parseError) {
            // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
            if (functionResult.includes(',')) {
              rackNumbers = functionResult.split(',').map((item: string, index: number) => ({
                value: item.trim(),
                label: item.trim(),
                id: index + 1
              }));
            } else {
              rackNumbers = [{
                value: functionResult.trim(),
                label: functionResult.trim(),
                id: 1
              }];
            }
          }
        } else if (functionResult.includes(',')) {
          // 콤마로 구분된 문자열인 경우
          rackNumbers = functionResult.split(',').map((item: string, index: number) => ({
            value: item.trim(),
            label: item.trim(),
            id: index + 1
          }));
        } else {
          // 단일 값인 경우
          rackNumbers = [{
            value: functionResult.trim(),
            label: functionResult.trim(),
            id: 1
          }];
        }
      } else if (Array.isArray(functionResult)) {
        // 배열인 경우 - CODE를 value로, CODE_NAME을 label로 사용
        rackNumbers = functionResult.map((item: any, index: number) => ({
          value: toString(item.CODE || item.code || item.value),
          label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
          id: index + 1
        }));
      } else if (typeof functionResult === 'object') {
        // 객체인 경우 - CODE를 value로, CODE_NAME을 label로 사용
        rackNumbers = [{
          value: toString(functionResult.CODE || functionResult.code || functionResult.value),
          label: toString(functionResult.CODE_NAME || functionResult.NAME || functionResult.name || functionResult.label || functionResult.CODE || functionResult.code || functionResult.value),
          id: 1
        }];
      } else {
        // 기타 타입
        rackNumbers = [{
          value: String(functionResult),
          label: String(functionResult),
          id: 1
        }];
      }
    }
    
    console.log('Parsed rack numbers:', rackNumbers);
    
    res.json({
      status: 'success',
      data: rackNumbers
    });
  } catch (error: any) {
    console.error('Error fetching rack numbers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch rack numbers',
      error: error.message
    });
  }
});

/**
 * 적재위치 등록 데이터 저장
 * DB PROCEDURE: SP_PDA_LOAD_SCAN
 */
router.post('/save-scan-data', async (req: Request, res: Response) => {
  try {
    const { scanDataList, user } = req.body;
    
    if (!scanDataList || !Array.isArray(scanDataList) || scanDataList.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Scan data list is required and must not be empty'
      });
    }

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User is required'
      });
    }

    console.log('Saving scan data:', scanDataList.length, 'items');
    console.log('User:', user);
    console.log('Scan data list:', JSON.stringify(scanDataList, null, 2));

    const connection = await getConnection();
    const results: any[] = [];
    let hasError = false;
    let errorMessage = '';

    try {
      // 프로시저 존재 여부 확인
      try {
        const procCheck = await connection.execute(
          `SELECT COUNT(*) AS CNT FROM USER_PROCEDURES WHERE OBJECT_NAME = 'SP_PDA_LOAD_SCAN'`
        );
        const procExists = (procCheck.rows?.[0] as any)?.CNT > 0;
        console.log('프로시저 존재 여부 확인:', procExists ? '존재함' : '존재하지 않음');
        
        if (!procExists) {
          // 다른 스키마에 있을 수도 있으므로 ALL_PROCEDURES도 확인
          const allProcCheck = await connection.execute(
            `SELECT COUNT(*) AS CNT FROM ALL_PROCEDURES WHERE OBJECT_NAME = 'SP_PDA_LOAD_SCAN'`
          );
          const allProcExists = (allProcCheck.rows?.[0] as any)?.CNT > 0;
          console.log('전체 프로시저에서 확인:', allProcExists ? '존재함' : '존재하지 않음');
        }
      } catch (checkError: any) {
        console.warn('프로시저 존재 여부 확인 중 오류 (무시하고 계속 진행):', checkError.message);
      }
      // 각 행마다 프로시저 호출
      for (let i = 0; i < scanDataList.length; i++) {
        const item = scanDataList[i];
        console.log(`Processing item ${i + 1}:`, item);
        
        // 날짜와 시간을 Oracle DATE 형식으로 변환
        // P_SCAN_DATE: YYYY-MM-DD 형식의 날짜를 DATE로 변환
        // P_DATETIME: YYYY-MM-DD HH:MM:SS 형식을 DATE로 변환
        const scanDate = item.date; // YYYY-MM-DD
        const dateTime = `${item.date} ${item.time}`; // YYYY-MM-DD HH:MM:SS

        console.log(`Item ${i + 1} - scanDate: ${scanDate}, dateTime: ${dateTime}`);
        console.log(`Item ${i + 1} - rackTypeCode: ${item.rackTypeCode}, rackNumberCode: ${item.rackNumberCode}`);

        // 프로시저 호출
        // 날짜는 Oracle DATE 타입으로 직접 바인딩
        const scanDateObj = new Date(scanDate + ' 00:00:00');
        const dateTimeObj = new Date(dateTime);

        console.log(`Item ${i + 1} - scanDateObj: ${scanDateObj}, dateTimeObj: ${dateTimeObj}`);

        // 프로시저 호출 전 파라미터 로그
        console.log(`\n========== SP_PDA_LOAD_SCAN 프로시저 호출 시작 (Item ${i + 1}) ==========`);
        console.log('프로시저 파라미터:');
        console.log('  P_BUSI_PLACE:', '1');
        console.log('  P_JOB:', '1');
        console.log('  P_LOC_LCODE:', item.rackTypeCode || '');
        console.log('  P_LOC_MCODE:', item.rackNumberCode || '');
        console.log('  P_BATCH:', item.batchNumber || '');
        console.log('  P_ITEM_CODE:', item.materialCode || '');
        console.log('  P_CO_NO:', item.orderNumber || '');
        console.log('  P_CO_SEAL:', item.orderLine || '');
        console.log('  P_QTY:', parseFloat(item.quantity) || 0);
        console.log('  P_SCAN_DATE:', scanDateObj);
        console.log('  P_DATETIME:', dateTimeObj);
        console.log('  P_USER:', user);
        console.log('===========================================================\n');

        let result;
        try {
          console.log(`\n[프로시저 호출 직전] Item ${i + 1} - connection 상태 확인`);
          console.log(`[프로시저 호출 직전] Item ${i + 1} - 프로시저 호출 시도 중...`);
          
          result = await connection.execute(
            `BEGIN
              SP_PDA_LOAD_SCAN(
                :P_BUSI_PLACE,
                :P_JOB,
                :P_LOC_LCODE,
                :P_LOC_MCODE,
                :P_BATCH,
                :P_ITEM_CODE,
                :P_CO_NO,
                :P_CO_SEAL,
                :P_QTY,
                :P_SCAN_DATE,
                :P_DATETIME,
                :P_USER,
                :P_OUT_YN,
                :P_OUT_MSG
              );
            END;`,
            {
              P_BUSI_PLACE: { val: '1', dir: oracledb.BIND_IN },
              P_JOB: { val: '1', dir: oracledb.BIND_IN },
              P_LOC_LCODE: { val: item.rackTypeCode || '', dir: oracledb.BIND_IN },
              P_LOC_MCODE: { val: item.rackNumberCode || '', dir: oracledb.BIND_IN },
              P_BATCH: { val: item.batchNumber || '', dir: oracledb.BIND_IN },
              P_ITEM_CODE: { val: item.materialCode || '', dir: oracledb.BIND_IN },
              P_CO_NO: { val: item.orderNumber || '', dir: oracledb.BIND_IN },
              P_CO_SEAL: { val: item.orderLine || '', dir: oracledb.BIND_IN },
              P_QTY: { val: parseFloat(item.quantity) || 0, dir: oracledb.BIND_IN },
              P_SCAN_DATE: { val: scanDateObj, type: oracledb.DATE, dir: oracledb.BIND_IN },
              P_DATETIME: { val: dateTimeObj, type: oracledb.DATE, dir: oracledb.BIND_IN },
              P_USER: { val: user, dir: oracledb.BIND_IN },
              P_OUT_YN: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },
              P_OUT_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 2000 }
            }
          );
          
          console.log(`\n========== SP_PDA_LOAD_SCAN 프로시저 호출 완료 (Item ${i + 1}) ==========`);
          console.log('프로시저 실행 성공!');
          console.log('Result 객체 전체:', JSON.stringify(result, null, 2));
          console.log('Result.outBinds:', result.outBinds);
          console.log('Result.outBinds 타입:', typeof result.outBinds);
          console.log('===========================================================\n');
        } catch (procCallError: any) {
          console.error(`\n========== SP_PDA_LOAD_SCAN 프로시저 호출 실패 (Item ${i + 1}) ==========`);
          console.error('프로시저 호출 중 에러 발생:');
          console.error('  Error Code:', procCallError.errorNum || procCallError.code);
          console.error('  Error Message:', procCallError.message);
          console.error('  Error Stack:', procCallError.stack);
          if (procCallError.offset) {
            console.error('  Error Offset:', procCallError.offset);
          }
          console.error('===========================================================\n');
          throw procCallError; // 에러를 다시 throw하여 상위 catch에서 처리
        }

        // 반환값 상세 확인
        console.log(`\n========== 프로시저 반환값 상세 확인 (Item ${i + 1}) ==========`);
        console.log('result.outBinds 전체:', result.outBinds);
        console.log('result.outBinds 타입:', typeof result.outBinds);
        console.log('result.outBinds가 null인가?', result.outBinds === null);
        console.log('result.outBinds가 undefined인가?', result.outBinds === undefined);
        
        const outYnRaw = result.outBinds?.P_OUT_YN;
        const outMsgRaw = result.outBinds?.P_OUT_MSG;
        
        console.log('P_OUT_YN 원본 값:', outYnRaw);
        console.log('P_OUT_YN 원본 타입:', typeof outYnRaw);
        console.log('P_OUT_YN 원본 값의 길이:', outYnRaw?.length);
        console.log('P_OUT_YN 원본 값 (JSON):', JSON.stringify(outYnRaw));
        
        console.log('P_OUT_MSG 원본 값:', outMsgRaw);
        console.log('P_OUT_MSG 원본 타입:', typeof outMsgRaw);
        console.log('P_OUT_MSG 원본 값 (JSON):', JSON.stringify(outMsgRaw));
        
        // 값 정규화 (공백 제거, 대문자 변환)
        const outYn = outYnRaw ? String(outYnRaw).trim().toUpperCase() : '';
        const outMsg = outMsgRaw ? String(outMsgRaw).trim() : '';
        
        console.log('P_OUT_YN 정규화 후:', outYn);
        console.log('P_OUT_YN이 "Y"와 같은가?', outYn === 'Y');
        console.log('P_OUT_YN이 "Y"와 같은가? (엄격 비교):', outYn === 'Y');
        console.log('P_OUT_YN이 "Y"와 같은가? (== 비교):', outYn == 'Y');
        console.log('P_OUT_YN 길이:', outYn.length);
        console.log('P_OUT_MSG 정규화 후:', outMsg);
        console.log('===========================================================\n');

        results.push({
          index: i,
          batchNumber: item.batchNumber,
          outYn,
          outMsg,
          outYnRaw: outYnRaw, // 원본 값도 저장
          outMsgRaw: outMsgRaw // 원본 값도 저장
        });

        // OUT_YN이 'Y'이면 성공, 'N'이면 에러로 처리
        console.log(`\n========== 프로시저 결과 검증 (Item ${i + 1}) ==========`);
        console.log(`OUT_YN 값: "${outYn}"`);
        console.log(`OUT_YN === 'Y' 비교 결과: ${outYn === 'Y'}`);
        console.log(`OUT_YN === 'N' 비교 결과: ${outYn === 'N'}`);
        console.log(`OUT_YN이 빈 문자열인가? ${outYn === ''}`);
        console.log(`OUT_MSG 값: "${outMsg}"`);
        
        if (outYn === 'Y') {
          console.log(`✅ 성공: Item ${i + 1} 저장 완료 - 배치번호: ${item.batchNumber}, 메시지: ${outMsg}`);
          console.log('===========================================================\n');
        } else if (outYn === 'N') {
          hasError = true;
          errorMessage = outMsg || '저장 중 오류가 발생했습니다.';
          console.error(`❌ 실패: Item ${i + 1} 저장 실패 - 배치번호: ${item.batchNumber}, 메시지: ${outMsg}`);
          console.error('===========================================================\n');
        } else {
          // OUT_YN이 'Y'도 'N'도 아닌 경우 (빈 문자열 등)
          hasError = true;
          errorMessage = outMsg || `저장 결과를 확인할 수 없습니다. (OUT_YN=${outYn})`;
          console.error(`⚠️ 알 수 없는 결과: Item ${i + 1} - OUT_YN="${outYn}", OUT_MSG="${outMsg}"`);
          console.error('===========================================================\n');
        }
      }

      await connection.close();

      // 최종 결과 확인 및 로깅
      console.log(`\n========== 최종 결과 확인 ==========`);
      console.log(`총 ${results.length}건 처리`);
      console.log('모든 결과:');
      results.forEach((r, idx) => {
        console.log(`  [${idx + 1}] 배치번호: ${r.batchNumber}, OUT_YN: "${r.outYn}", OUT_MSG: "${r.outMsg}"`);
        console.log(`      OUT_YN 원본: "${r.outYnRaw}", OUT_YN === 'Y': ${r.outYn === 'Y'}`);
      });
      
      // 모든 항목이 성공적으로 저장되었는지 확인
      const allSuccess = results.every(r => {
        const normalized = String(r.outYn || '').trim().toUpperCase();
        return normalized === 'Y';
      });
      
      const successCount = results.filter(r => {
        const normalized = String(r.outYn || '').trim().toUpperCase();
        return normalized === 'Y';
      }).length;
      
      const failedCount = results.length - successCount;
      
      console.log(`성공: ${successCount}건, 실패: ${failedCount}건`);
      console.log(`모든 항목 성공 여부: ${allSuccess}`);
      console.log('==========================================\n');

      if (hasError || !allSuccess) {
        const failedItems = results.filter(r => {
          const normalized = String(r.outYn || '').trim().toUpperCase();
          return normalized !== 'Y';
        });
        
        console.error(`❌ 저장 실패: ${failedItems.length}건 실패`);
        failedItems.forEach((item, idx) => {
          console.error(`  실패 항목 ${idx + 1}: 배치번호=${item.batchNumber}, OUT_YN="${item.outYn}", OUT_MSG="${item.outMsg}"`);
        });
        
        return res.status(400).json({
          status: 'error',
          message: errorMessage || `${failedItems.length}건의 데이터 저장에 실패했습니다.`,
          results: results,
          successCount: successCount,
          failedCount: failedCount
        });
      }

      console.log(`✅ 모든 항목 저장 성공: ${successCount}건`);
      res.json({
        status: 'success',
        message: '성공적으로 저장되었습니다.',
        results: results,
        successCount: successCount
      });
    } catch (procError: any) {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          // ignore
        }
      }
      throw procError;
    }
  } catch (error: any) {
    console.error('Error saving scan data:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.errorNum || error.code);
    console.error('Error message:', error.message);
    
    // Oracle 에러의 경우 더 자세한 정보 출력
    if (error.errorNum) {
      console.error('Oracle Error Number:', error.errorNum);
    }
    if (error.offset) {
      console.error('Oracle Error Offset:', error.offset);
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to save scan data',
      error: error.message || 'Unknown error',
      errorCode: error.errorNum || error.code,
      errorDetails: error.stack
    });
  }
});

export default router;

