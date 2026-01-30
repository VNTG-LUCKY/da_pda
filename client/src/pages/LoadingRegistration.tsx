import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoadingRegistration.css'

interface TableRow {
  sequence: string
  materialName: string
  batch: string
  quantity: string
  storageLocation: string
}

function LoadingRegistration() {
  const navigate = useNavigate()
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [instructionNumber1, setInstructionNumber1] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleFullName, setVehicleFullName] = useState('')
  const [totalPlannedQuantity, setTotalPlannedQuantity] = useState('')
  const [quantitySum, setQuantitySum] = useState('')
  const [barcode, setBarcode] = useState('')
  const [lineCount, setLineCount] = useState('')
  const [mode, setMode] = useState<'normal' | 'quantityChange'>('normal')
  const [changeQuantity, setChangeQuantity] = useState('')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [error, setError] = useState<string | null>(null)

  // 인증 확인
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const handleInput = () => {
    // 바코드 입력 처리 로직
    if (!barcode.trim()) {
      setError('바코드를 입력하세요.')
      return
    }

    // 테이블에 데이터 추가
    const quantity = mode === 'quantityChange' && changeQuantity ? changeQuantity : '1'
    const newRow: TableRow = {
      sequence: String(tableData.length + 1),
      materialName: '',
      batch: barcode,
      quantity: quantity,
      storageLocation: ''
    }
    
    setTableData([...tableData, newRow])
    setBarcode('')
    setChangeQuantity('')
    setError(null)
    
    // 바코드 입력 필드로 다시 포커스
    if (barcodeInputRef.current) {
      setTimeout(() => {
        barcodeInputRef.current?.focus()
      }, 0)
    }
  }

  const handleFinalSave = () => {
    // 최종 저장 로직
    console.log('최종 저장', { date, instructionNumber1, vehicleNumber, vehicleFullName, totalPlannedQuantity, quantitySum, tableData })
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }
    setError(null)
    // TODO: API 호출
  }

  const handleTemporary = () => {
    // 임시 저장 로직
    console.log('임시 저장', { date, instructionNumber1, vehicleNumber, vehicleFullName, totalPlannedQuantity, quantitySum, tableData })
    setError(null)
    // TODO: API 호출
  }

  const handleDelete = () => {
    // 삭제 로직
    if (tableData.length === 0) {
      setError('삭제할 데이터가 없습니다.')
      return
    }
    setTableData([])
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInput()
    }
  }

  return (
    <div className="loading-registration-container">
      <div className="loading-registration-header">
        <button className="back-button" onClick={() => navigate('/main')}>
          ← 뒤로
        </button>
        <h1>상차등록</h1>
      </div>
      
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      <div className="loading-registration-content">
        <div className="input-section">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="date">일자</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="instructionNumber1">지시번호</label>
              <input
                type="text"
                id="instructionNumber1"
                value={instructionNumber1}
                onChange={(e) => setInstructionNumber1(e.target.value)}
                placeholder="지시번호"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="vehicleNumber">차량번호</label>
              <input
                type="text"
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="차량번호"
              />
            </div>

            <div className="input-group">
              <label htmlFor="vehicleFullName">차량풀네임</label>
              <input
                type="text"
                id="vehicleFullName"
                value={vehicleFullName}
                onChange={(e) => setVehicleFullName(e.target.value)}
                placeholder="차량풀네임"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="totalPlannedQuantity">총계획량</label>
              <input
                type="text"
                id="totalPlannedQuantity"
                value={totalPlannedQuantity}
                onChange={(e) => setTotalPlannedQuantity(e.target.value)}
                placeholder="총계획량"
              />
            </div>

            <div className="input-group">
              <label htmlFor="quantitySum">수량합</label>
              <input
                type="text"
                id="quantitySum"
                value={quantitySum}
                onChange={(e) => setQuantitySum(e.target.value)}
                placeholder="수량합"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="barcode">바코드</label>
              <div className="input-with-icon">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="바코드"
                />
                <span className="camera-icon">📷</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lineCount">라인수</label>
              <input
                type="text"
                id="lineCount"
                value={lineCount}
                onChange={(e) => setLineCount(e.target.value)}
                placeholder="라인수"
              />
            </div>
          </div>

          <div className="radio-group">
            <div className="radio-buttons-wrapper">
              <div className="radio-option">
                <input
                  type="radio"
                  id="normal"
                  name="mode"
                  value="normal"
                  checked={mode === 'normal'}
                  onChange={() => setMode('normal')}
                />
                <label htmlFor="normal">정상</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="quantityChange"
                  name="mode"
                  value="quantityChange"
                  checked={mode === 'quantityChange'}
                  onChange={() => setMode('quantityChange')}
                />
                <label htmlFor="quantityChange">수량변경</label>
              </div>
              {mode === 'quantityChange' && (
                <div className="quantity-input-wrapper">
                  <label htmlFor="changeQuantity">변경수량</label>
                  <input
                    type="text"
                    id="changeQuantity"
                    className="quantity-input"
                    value={changeQuantity}
                    onChange={(e) => setChangeQuantity(e.target.value)}
                    placeholder="변경수량"
                  />
                </div>
              )}
            </div>
            <button className="submit-button-inline" onClick={handleInput}>
              입력
            </button>
          </div>
        </div>

        <div className="table-section">
          <table className="data-table">
            <thead>
              <tr>
                <th>순번</th>
                <th>자재명</th>
                <th>배치</th>
                <th>수량</th>
                <th>저장위치</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="순번">-</td>
                  <td data-label="자재명">-</td>
                  <td data-label="배치">-</td>
                  <td data-label="수량">-</td>
                  <td data-label="저장위치">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td data-label="순번">{row.sequence}</td>
                    <td data-label="자재명">{row.materialName}</td>
                    <td data-label="배치">{row.batch}</td>
                    <td data-label="수량">{row.quantity}</td>
                    <td data-label="저장위치">{row.storageLocation}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-buttons">
          <button className="final-save-button" onClick={handleFinalSave}>
            최종 저장
          </button>
          <button className="temporary-button" onClick={handleTemporary}>
            임시
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoadingRegistration
