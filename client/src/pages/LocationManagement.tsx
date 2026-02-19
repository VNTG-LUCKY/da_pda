import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LocationManagement.css'

interface TableRow {
  date: string
  time: string
  batchNumber: string
  materialCode: string
  quantity: string
  orderNumber: string
  orderLine: string
  rackType: string
  rackNumber: string
  rackTypeCode: string
  rackNumberCode: string
}

interface RackType {
  value: string
  label: string
  id: number
}

interface RackNumber {
  value: string
  label: string
  id: number
}

function LocationManagement() {
  const navigate = useNavigate()
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  
  const [loadingRackScan, setLoadingRackScan] = useState('')
  const [loadingRackType, setLoadingRackType] = useState('')
  const [loadingRackNumber, setLoadingRackNumber] = useState('')
  const [barcode, setBarcode] = useState('')
  const [cnt, setCnt] = useState('0')
  const [quantitySum, setQuantitySum] = useState('0')
  const [status, setStatus] = useState<'normal' | 'quantity-change'>('normal')
  const [quantity, setQuantity] = useState('')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [rackTypes, setRackTypes] = useState<RackType[]>([])
  const [rackNumbers, setRackNumbers] = useState<RackNumber[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRackNumbers, setLoadingRackNumbers] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  // 적재대구분 목록 조회
  useEffect(() => {
    const fetchRackTypes = async () => {
      try {
        setLoading(true)
        // Vite 프록시를 통해 API 호출
        const response = await axios.get('/api/location/rack-types')
        if (response.data.status === 'success') {
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
          
          const rawData = response.data.data || []
          const transformedData = rawData.map((item: any, index: number) => {
            return {
              value: toString(item.CODE || item.code || item.value),
              label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
              id: item.id || index + 1
            };
          });
          
          console.log('Transformed rack types:', transformedData);
          setRackTypes(transformedData)
        } else {
          console.warn('API returned non-success status:', response.data)
          setRackTypes([])
        }
      } catch (error: any) {
        const data = error?.response?.data
        const backendMsg = typeof data?.error === 'string' ? data.error : (data?.message || error?.message || '서버 오류')
        console.error('Error fetching rack types:', error?.response?.data ?? error)
        setError(`적재대구분 로드 실패: ${backendMsg}`)
        setRackTypes([])
      } finally {
        setLoading(false)
      }
    }

    fetchRackTypes()
  }, [])

  // 적재대구분 선택 시 적재대번호 목록 조회
  useEffect(() => {
    const fetchRackNumbers = async () => {
      if (!loadingRackType) {
        setRackNumbers([])
        setLoadingRackNumber('')
        return
      }

      try {
        setLoadingRackNumbers(true)
        // 선택된 적재대구분 코드값으로 적재대번호 목록 조회
        const response = await axios.get(`/api/location/rack-numbers/${encodeURIComponent(loadingRackType)}`)
        if (response.data.status === 'success') {
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
          
          const rawData = response.data.data || []
          const transformedData = rawData.map((item: any, index: number) => {
            return {
              value: toString(item.CODE || item.code || item.value),
              label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
              id: item.id || index + 1
            };
          });
          
          console.log('Transformed rack numbers:', transformedData);
          setRackNumbers(transformedData)
        } else {
          console.warn('API returned non-success status:', response.data)
          setRackNumbers([])
        }
      } catch (error: any) {
        console.error('Error fetching rack numbers:', error)
        setRackNumbers([])
        setError('적재대번호를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoadingRackNumbers(false)
      }
    }

    fetchRackNumbers()
  }, [loadingRackType])

  // 테이블 데이터 변경 시 CNT(행 수)와 본수 합계 자동 계산
  useEffect(() => {
    // 행 수 계산
    const rowCount = tableData.length
    setCnt(String(rowCount))

    // 본수 합계 계산
    const sum = tableData.reduce((total, row) => {
      const qty = parseFloat(row.quantity) || 0
      return total + qty
    }, 0)
    setQuantitySum(String(sum))
  }, [tableData])

  const handleInput = () => {
    // 적재대구분과 적재대번호가 선택되었는지 확인
    if (!loadingRackType || !loadingRackNumber) {
      setError('적재대구분과 적재대번호를 먼저 선택해주세요.')
      return
    }

    // 바코드가 입력되었는지 확인
    if (!barcode || barcode.trim() === '') {
      setError('바코드를 입력해주세요.')
      return
    }

    // 바코드 형식 검증 및 파싱
    // 형식: 배치번호-자재코드-본수-수주번호-수주행번
    // 예: HG00160205-DS100179-0180-15400-1
    const barcodeParts = barcode.trim().split('-')
    
    if (barcodeParts.length !== 5) {
      setError('바코드 형식이 올바르지 않습니다. (형식: 배치번호-자재코드-본수-수주번호-수주행번)')
      return
    }

    const [batchNumber, materialCode, quantityStr, orderNumber, orderLine] = barcodeParts

    // 중복 체크: 동일한 배치번호와 자재코드가 이미 테이블에 있는지 확인
    const isDuplicate = tableData.some(
      (row) => row.batchNumber === batchNumber && row.materialCode === materialCode
    )

    if (isDuplicate) {
      setError('이미 적재위치에 등록된 배치번호입니다')
      // 바코드 입력 필드 초기화
      setBarcode('')
      // 바코드 입력 필드로 포커스 이동
      if (barcodeInputRef.current) {
        setTimeout(() => {
          barcodeInputRef.current?.focus()
        }, 0)
      }
      return
    }

    // 현재 날짜와 시간 가져오기
    const now = new Date()
    
    // 날짜 포맷: YYYY-MM-DD
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    
    // 시간 포맷: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const formattedTime = `${hours}:${minutes}:${seconds}`

    // 본수 처리: 본수변경 모드이고 quantity가 입력되어 있으면 그것을 사용, 아니면 바코드의 본수 사용
    const finalQuantity = (status === 'quantity-change' && quantity.trim() !== '') 
      ? quantity.trim() 
      : quantityStr

    // 적재대구분 label 찾기
    const selectedRackType = rackTypes.find(type => type.value === loadingRackType)
    const rackTypeLabel = selectedRackType ? selectedRackType.label : loadingRackType
    const rackTypeCode = loadingRackType // 코드값은 이미 선택된 value

    // 적재대번호 label 찾기
    const selectedRackNumber = rackNumbers.find(number => number.value === loadingRackNumber)
    const rackNumberLabel = selectedRackNumber ? selectedRackNumber.label : loadingRackNumber
    const rackNumberCode = loadingRackNumber // 코드값은 이미 선택된 value

    // 테이블에 추가할 새 행 데이터
    const newRow: TableRow = {
      date: formattedDate,
      time: formattedTime,
      batchNumber: batchNumber,
      materialCode: materialCode,
      quantity: finalQuantity,
      orderNumber: orderNumber,
      orderLine: orderLine,
      rackType: rackTypeLabel,
      rackNumber: rackNumberLabel,
      rackTypeCode: rackTypeCode,
      rackNumberCode: rackNumberCode
    }

    // 테이블 데이터에 추가 (최근 입력이 LIST 하단에 나오도록)
    setTableData(prev => [...prev, newRow])
    
    // 에러 메시지 초기화
    setError(null)
    
    // 바코드 입력 필드 초기화
    setBarcode('')
    
    // 본수 변경 모드가 아니면 quantity도 초기화
    if (status === 'normal') {
      setQuantity('')
    }
    
    // 바코드 입력 필드로 다시 포커스 이동
    if (barcodeInputRef.current) {
      setTimeout(() => {
        barcodeInputRef.current?.focus()
      }, 0)
    }
  }

  const handleSave = async () => {
    // 테이블 데이터가 없으면 저장하지 않음
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }

    // 이미 저장 중이면 중복 호출 방지
    if (saving) {
      return
    }

    // 로그인 유저 정보 가져오기
    const user = localStorage.getItem('username') || localStorage.getItem('user') || 'UNKNOWN'
    
    // 테이블 데이터를 프로시저 호출 형식으로 변환
    const scanDataList = tableData.map(row => ({
      date: row.date,
      time: row.time,
      batchNumber: row.batchNumber,
      materialCode: row.materialCode,
      quantity: row.quantity,
      orderNumber: row.orderNumber,
      orderLine: row.orderLine,
      rackTypeCode: row.rackTypeCode,
      rackNumberCode: row.rackNumberCode
    }))

    // 프로시저 파라미터 정보 생성
    const procedureParams = scanDataList.map((item, index) => {
      const scanDate = item.date // YYYY-MM-DD
      const dateTime = `${item.date} ${item.time}` // YYYY-MM-DD HH:MM:SS
      
      return {
        '항목': index + 1,
        'P_BUSI_PLACE': '1',
        'P_JOB': '1',
        'P_LOC_LCODE': item.rackTypeCode || '(빈값)',
        'P_LOC_MCODE': item.rackNumberCode || '(빈값)',
        'P_BATCH': item.batchNumber || '(빈값)',
        'P_ITEM_CODE': item.materialCode || '(빈값)',
        'P_CO_NO': item.orderNumber || '(빈값)',
        'P_CO_SEAL': item.orderLine || '(빈값)',
        'P_QTY': item.quantity || '0',
        'P_SCAN_DATE': scanDate,
        'P_DATETIME': dateTime,
        'P_USER': user
      }
    })

    // 파라미터 정보를 JSON 형식으로 포맷팅 (보기 좋게)
    const paramsJson = JSON.stringify(procedureParams, null, 2)
    
    const fullMessage = `SP_PDA_LOAD_SCAN 프로시저로 전송할 파라미터:\n\n${paramsJson}\n\n이 데이터를 전송하시겠습니까?`

    // 확인 팝업 표시
    const confirmed = window.confirm(fullMessage)
    
    if (!confirmed) {
      return // 사용자가 취소한 경우
    }

    // 프로시저 실행
    try {
      setSaving(true)
      setError(null)
      
      // 백엔드 API 호출
      const response = await axios.post('/api/location/save-scan-data', {
        scanDataList,
        user
      })

      if (response.data.status === 'success') {
        // 저장 성공
        alert('성공적으로 저장되었습니다.')
        // 테이블 데이터 초기화
        setTableData([])
        setCnt('0')
        setQuantitySum('0')
        setError(null) // 에러 메시지 초기화
      } else {
        // 저장 실패
        setError(response.data.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (error: any) {
      console.error('Error saving data:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || '저장 중 오류가 발생했습니다.'
      setError(`저장 실패: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    // 선택된 행이 없으면 삭제하지 않음
    if (selectedRowIndex === null) {
      setError('삭제할 항목을 선택해주세요.')
      return
    }

    // 선택된 행 삭제
    setTableData(prev => {
      const newData = prev.filter((_, index) => index !== selectedRowIndex)
      return newData
    })
    
    // 선택 상태 초기화
    setSelectedRowIndex(null)
    setError(null)
  }

  const handleRowClick = (index: number) => {
    // 같은 행을 클릭하면 선택 해제, 다른 행을 클릭하면 선택
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null)
    } else {
      setSelectedRowIndex(index)
    }
  }

  // 인증 확인
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="location-management-container">
      <div className="location-header">
        <button className="back-button" onClick={() => navigate('/main')}>
          BACK
        </button>
        <h1>적재위치 등록</h1>
      </div>
      
      {error && (
        <div className="location-error-banner">
          {error}
        </div>
      )}
      
      <div className="location-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="loadingRackScan" className="label-large">적재대스캔</label>
            <input
              type="text"
              id="loadingRackScan"
              className="input-scan"
              value={loadingRackScan}
              onChange={(e) => setLoadingRackScan(e.target.value)}
              placeholder="적재대스캔"
            />
          </div>

          <div className="input-group">
            <label htmlFor="loadingRackType" className="label-red label-large">적재대구분</label>
            <select
              id="loadingRackType"
              value={loadingRackType}
              onChange={(e) => {
                setLoadingRackType(e.target.value)
                setLoadingRackNumber('') // 적재대구분 변경 시 적재대번호 초기화
              }}
              disabled={loading}
            >
              <option value="">선택</option>
              {rackTypes.map((type) => (
                <option key={type.id} value={String(type.value || '')}>
                  {String(type.label || '')}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="loadingRackNumber" className="label-red label-large">적재대번호</label>
            <select
              id="loadingRackNumber"
              value={loadingRackNumber}
              onChange={(e) => {
                setLoadingRackNumber(e.target.value)
                // 적재대번호 선택 후 바코드 텍스트박스로 포커스 이동
                if (e.target.value && barcodeInputRef.current) {
                  setTimeout(() => {
                    barcodeInputRef.current?.focus()
                  }, 0)
                }
              }}
              disabled={!loadingRackType || loadingRackNumbers}
            >
              <option value="">
                {loadingRackNumbers ? '로딩 중...' : loadingRackType ? '적재대번호를 선택하세요.' : '적재대구분을 먼저 선택하세요.'}
              </option>
              {rackNumbers.map((number) => (
                <option key={number.id} value={String(number.value || '')}>
                  {String(number.label || '')}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group barcode-group compact-row">
            <div className="barcode-input-wrapper">
              <input
                ref={barcodeInputRef}
                type="text"
                id="barcode"
                className="barcode-input-inline"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleInput()
                  }
                }}
                placeholder="바코드"
              />
              {/* PDA/휴대폰에서 손으로 탭해도 키보드가 안 뜨게 막음. 스캐너는 포커스 시 입력 가능 */}
              <div className="barcode-tap-blocker" aria-hidden="true" />
            </div>
            <input type="text" className="cnt-input" value={cnt} readOnly placeholder="0" aria-label="건수값" />
            <input type="text" className="cnt-input cnt-sum" value={quantitySum} readOnly placeholder="0" aria-label="본수합계" />
          </div>

          <div className="radio-group" role="group" aria-label="정상/본수변경">
            <div className="radio-group-row">
              <label className="radio-option" htmlFor="normal">
                <input
                  type="radio"
                  id="normal"
                  name="status"
                  value="normal"
                  checked={status === 'normal'}
                  onChange={(e) => setStatus(e.target.value as 'normal' | 'quantity-change')}
                />
                <span>정상</span>
              </label>
              <label className="radio-option" htmlFor="quantity-change">
                <input
                  type="radio"
                  id="quantity-change"
                  name="status"
                  value="quantity-change"
                  checked={status === 'quantity-change'}
                  onChange={(e) => setStatus(e.target.value as 'normal' | 'quantity-change')}
                />
                <span>본수변경</span>
              </label>
              <input
                type="text"
                id="quantity"
                className="quantity-input"
                placeholder="본수"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="input-button-section">
            <button className="submit-button" onClick={handleInput}>
              입력
            </button>
          </div>
        </div>

        <div className="table-section">
          <table className="data-table">
            <thead>
              <tr>
                <th>일자</th>
                <th>시간</th>
                <th>배치번호</th>
                <th>자재코드</th>
                <th>본수</th>
                <th>수주번호</th>
                <th>수주행번</th>
                <th>적재대구분</th>
                <th>적재대번호</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="일자">-</td>
                  <td data-label="시간">-</td>
                  <td data-label="배치번호">-</td>
                  <td data-label="자재코드">-</td>
                  <td data-label="본수">-</td>
                  <td data-label="수주번호">-</td>
                  <td data-label="수주행번">-</td>
                  <td data-label="적재대구분">-</td>
                  <td data-label="적재대번호">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr 
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className={selectedRowIndex === index ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="일자">{row.date}</td>
                    <td data-label="시간">{row.time}</td>
                    <td data-label="배치번호">{row.batchNumber}</td>
                    <td data-label="자재코드">{row.materialCode}</td>
                    <td data-label="본수">{row.quantity}</td>
                    <td data-label="수주번호">{row.orderNumber}</td>
                    <td data-label="수주행번">{row.orderLine}</td>
                    <td data-label="적재대구분">{row.rackType}</td>
                    <td data-label="적재대번호">{row.rackNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-buttons">
          <button className="save-button" onClick={handleSave} disabled={saving || tableData.length === 0}>
            {saving ? '저장 중...' : '저장'}
          </button>
          <button 
            className="delete-button" 
            onClick={handleDelete}
            disabled={selectedRowIndex === null}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationManagement
