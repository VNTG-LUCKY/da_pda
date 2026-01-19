import { Router, Request, Response } from 'express';
import { executeQuery } from '../config/database';

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
    console.error('Error fetching rack types:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch rack types',
      error: error.message
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

export default router;

