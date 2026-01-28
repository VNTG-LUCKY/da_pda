import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SlittingInput.css'

interface TableRow {
  sequence: string
  batchNumber: string
  coilNumber: string
  thickness: string
  weight: string
  width: string
}

interface Shift {
  value: string
  label: string
  id: number
}

interface Equipment {
  value: string
  label: string
  id: number
}

function SlittingInput() {
  const navigate = useNavigate()
  const batchNumberInputRef = useRef<HTMLInputElement>(null)
  
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }
  const [shift, setShift] = useState('')
  const [equipment, setEquipment] = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [shifts, setShifts] = useState<Shift[]>([])
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  // 인증 확인
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  // 근무조 목록 조회
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/slitting/shifts')
        if (response.data.status === 'success') {
          // 안전하게 문자열로 변환하는 헬퍼 함수
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
          
          const rawData = response.data.data || []
          const transformedData = rawData.map((item: any, index: number) => {
            return {
              value: toString(item.CODE || item.code || item.value),
              label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
              id: item.id || index + 1
            };
          });
          
          console.log('Transformed shifts:', transformedData);
          setShifts(transformedData)
        } else {
          console.warn('API returned non-success status:', response.data)
          setShifts([])
        }
      } catch (error: any) {
        console.error('Error fetching shifts:', error)
        setShifts([])
      } finally {
        setLoading(false)
      }
    }

    fetchShifts()
  }, [])

  // 설비 목록 조회
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/slitting/equipment')
        if (response.data.status === 'success') {
          // 안전하게 문자열로 변환하는 헬퍼 함수
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
          
          const rawData = response.data.data || []
          const transformedData = rawData.map((item: any, index: number) => {
            return {
              value: toString(item.CODE || item.code || item.value),
              label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
              id: item.id || index + 1
            };
          });
          
          console.log('Transformed equipment:', transformedData);
          setEquipmentList(transformedData)
        } else {
          console.warn('API returned non-success status:', response.data)
          setEquipmentList([])
        }
      } catch (error: any) {
        console.error('Error fetching equipment:', error)
        setEquipmentList([])
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  const handleInput = () => {
    // 배치번호 입력 처리 로직
    if (!batchNumber.trim()) {
      setError('배치번호를 입력하세요.')
      return
    }

    // 테이블에 데이터 추가
    const newRow: TableRow = {
      sequence: String(tableData.length + 1),
      batchNumber: batchNumber,
      coilNumber: '',
      thickness: '',
      weight: '',
      width: ''
    }
    
    setTableData([...tableData, newRow])
    setBatchNumber('')
    setError(null)
    
    // 배치번호 입력 필드로 다시 포커스
    if (batchNumberInputRef.current) {
      setTimeout(() => {
        batchNumberInputRef.current?.focus()
      }, 0)
    }
  }

  const handleSave = () => {
    // 저장 로직
    console.log('저장', { date, shift, equipment, tableData })
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }
    setError(null)
    // TODO: API 호출
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
      // 순번 재정렬
      return newData.map((row, index) => ({
        ...row,
        sequence: String(index + 1)
      }))
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInput()
    }
  }

  return (
    <div className="location-management-container">
      <div className="location-header">
        <button className="back-button" onClick={() => navigate('/main')}>
          ← 뒤로
        </button>
        <h1>슬리팅 투입</h1>
      </div>
      
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      <div className="location-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="date">일자</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              placeholder="일자"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="shift" className="label-red">근무조</label>
              <select
                id="shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                disabled={loading}
              >
                <option value="">선택</option>
                {shifts.map((shiftItem) => (
                  <option key={shiftItem.id} value={String(shiftItem.value || '')}>
                    {String(shiftItem.label || '')}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="equipment" className="label-red">설비</label>
              <select
                id="equipment"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                disabled={loading}
              >
                <option value="">설비선택</option>
                {equipmentList.map((equipmentItem) => (
                  <option key={equipmentItem.id} value={String(equipmentItem.value || '')}>
                    {String(equipmentItem.label || '')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="batchNumber" className="label-red">배치번호</label>
            <div className="input-with-icon">
              <input
                ref={batchNumberInputRef}
                type="text"
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="바코드 스캔"
              />
              <span className="camera-icon">📷</span>
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
                <th>순번</th>
                <th>배치번호</th>
                <th>코일번호</th>
                <th>두께</th>
                <th>중량</th>
                <th>폭</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="순번">-</td>
                  <td data-label="배치번호">-</td>
                  <td data-label="코일번호">-</td>
                  <td data-label="두께">-</td>
                  <td data-label="중량">-</td>
                  <td data-label="폭">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr 
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className={selectedRowIndex === index ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="순번">{row.sequence}</td>
                    <td data-label="배치번호">{row.batchNumber}</td>
                    <td data-label="코일번호">{row.coilNumber}</td>
                    <td data-label="두께">{row.thickness}</td>
                    <td data-label="중량">{row.weight}</td>
                    <td data-label="폭">{row.width}</td>
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

export default SlittingInput
