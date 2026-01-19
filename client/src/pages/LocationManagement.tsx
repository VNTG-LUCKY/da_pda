import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LocationManagement.css'

interface TableRow {
  date: string
  time: string
  material: string
  batchNumber: string
  quantity: string
  sequence: string
  location: string
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
  const [status, setStatus] = useState<'normal' | 'quantity-change'>('normal')
  const [quantity, setQuantity] = useState('')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [rackTypes, setRackTypes] = useState<RackType[]>([])
  const [rackNumbers, setRackNumbers] = useState<RackNumber[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRackNumbers, setLoadingRackNumbers] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        console.error('Error fetching rack types:', error)
        // 에러가 발생해도 빈 배열로 설정하여 화면은 정상 표시
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

  const handleInput = () => {
    // 바코드 입력 처리 로직
    console.log('바코드 입력:', barcode)
  }

  const handleSave = () => {
    // 저장 로직
    console.log('저장')
  }

  const handleDelete = () => {
    // 삭제 로직
    console.log('삭제')
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
          ← 뒤로
        </button>
        <h1>적재위치 등록</h1>
      </div>
      
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      <div className="location-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="loadingRackScan">적재대스캔</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="loadingRackScan"
                value={loadingRackScan}
                onChange={(e) => setLoadingRackScan(e.target.value)}
                placeholder="적재대스캔"
              />
              <span className="camera-icon">📷</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="loadingRackType" className="label-red">적재대구분</label>
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
            <label htmlFor="loadingRackNumber" className="label-red">적재대번호</label>
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

          <div className="input-group barcode-group">
            <label htmlFor="barcode">바코드</label>
            <div className="barcode-input-wrapper">
              <div className="input-with-icon">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="바코드"
                />
                <span className="camera-icon">📷</span>
              </div>
              <input
                type="text"
                className="cnt-label-input"
                value="CNT"
                readOnly
              />
              <input
                type="text"
                className="cnt-input"
                value={cnt}
                onChange={(e) => setCnt(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="radio-group">
            <div className="radio-buttons-wrapper">
              <div className="radio-option">
                <input
                  type="radio"
                  id="normal"
                  name="status"
                  value="normal"
                  checked={status === 'normal'}
                  onChange={(e) => setStatus(e.target.value as 'normal' | 'quantity-change')}
                />
                <label htmlFor="normal">정상</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="quantity-change"
                  name="status"
                  value="quantity-change"
                  checked={status === 'quantity-change'}
                  onChange={(e) => setStatus(e.target.value as 'normal' | 'quantity-change')}
                />
                <label htmlFor="quantity-change">본수변경</label>
              </div>
            </div>
            <div className="quantity-input-wrapper">
              <label htmlFor="quantity">본수</label>
              <input
                type="text"
                id="quantity"
                className="quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="본수"
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
                <th>자재내역</th>
                <th>배치번호</th>
                <th>본수</th>
                <th>순번</th>
                <th>위치</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="일자">-</td>
                  <td data-label="시간">-</td>
                  <td data-label="자재내역">-</td>
                  <td data-label="배치번호">-</td>
                  <td data-label="본수">-</td>
                  <td data-label="순번">-</td>
                  <td data-label="위치">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td data-label="일자">{row.date}</td>
                    <td data-label="시간">{row.time}</td>
                    <td data-label="자재내역">{row.material}</td>
                    <td data-label="배치번호">{row.batchNumber}</td>
                    <td data-label="본수">{row.quantity}</td>
                    <td data-label="순번">{row.sequence}</td>
                    <td data-label="위치">{row.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-buttons">
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationManagement
