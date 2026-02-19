import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SlittingInput.css'

interface TableRow {
  sequence: string
  batchNumber: string
  itemCode: string   // 품목코드 (배치번호-품목코드 형식)
  scanDate: string   // 스캔일자 (YYYY-MM-DD)
  scanTime: string   // 스캔시간 (HH:mm:ss)
}

interface OptionItem {
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
  const [process, setProcess] = useState('')
  const [equipment, setEquipment] = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shiftOptions, setShiftOptions] = useState<OptionItem[]>([])
  const [processOptions, setProcessOptions] = useState<OptionItem[]>([])
  const [equipmentOptions, setEquipmentOptions] = useState<OptionItem[]>([])
  const [loadingShifts, setLoadingShifts] = useState(false)
  const [loadingProcess, setLoadingProcess] = useState(false)
  const [loadingEquipment, setLoadingEquipment] = useState(false)
  const [saving, setSaving] = useState(false)

  // 인증 확인
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  // 근무조 목록 조회 (Oracle DB - 적재위치 등록의 적재대구분과 동일 방식)
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoadingShifts(true)
        const response = await axios.get('/api/slitting/shifts')
        if (response.data.status === 'success') {
          const list = (response.data.data || []).map((item: any, index: number) => ({
            value: String(item.value ?? item.CODE ?? item.code ?? ''),
            label: String(item.label ?? item.CODE_NAME ?? item.NAME ?? item.name ?? item.value ?? ''),
            id: item.id ?? index + 1
          }))
          setShiftOptions(list)
        } else {
          setShiftOptions([])
        }
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? err?.message ?? '근무조 목록 로드 실패'
        setError((prev) => (prev ? prev + ' / ' : '') + `근무조: ${msg}`)
        setShiftOptions([])
      } finally {
        setLoadingShifts(false)
      }
    }
    fetchShifts()
  }, [])

  // 공정 목록 조회 (Oracle DB)
  useEffect(() => {
    const fetchProcess = async () => {
      try {
        setLoadingProcess(true)
        const response = await axios.get('/api/slitting/process')
        if (response.data.status === 'success') {
          const list = (response.data.data || []).map((item: any, index: number) => ({
            value: String(item.value ?? item.CODE ?? item.code ?? ''),
            label: String(item.label ?? item.CODE_NAME ?? item.NAME ?? item.name ?? item.value ?? ''),
            id: item.id ?? index + 1
          }))
          setProcessOptions(list)
        } else {
          setProcessOptions([])
        }
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? err?.message ?? '공정 목록 로드 실패'
        setError((prev) => (prev ? prev + ' / ' : '') + `공정: ${msg}`)
        setProcessOptions([])
      } finally {
        setLoadingProcess(false)
      }
    }
    fetchProcess()
  }, [])

  // 공정 선택 시 작업장 목록 조회 (적재대구분 -> 적재대번호와 동일 방식)
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!process) {
        setEquipmentOptions([])
        setEquipment('')
        return
      }
      try {
        setLoadingEquipment(true)
        const response = await axios.get(`/api/slitting/equipment/${encodeURIComponent(process)}`)
        if (response.data.status === 'success') {
          const list = (response.data.data || []).map((item: any, index: number) => ({
            value: String(item.value ?? item.CODE ?? item.code ?? ''),
            label: String(item.label ?? item.CODE_NAME ?? item.NAME ?? item.name ?? item.value ?? ''),
            id: item.id ?? index + 1
          }))
          setEquipmentOptions(list)
          setEquipment('') // 공정 변경 시 작업장 선택 초기화
        } else {
          setEquipmentOptions([])
          setEquipment('')
        }
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? err?.message ?? '작업장 목록 로드 실패'
        setError((prev) => (prev ? prev + ' / ' : '') + `작업장 로드 실패: ${msg}`)
        setEquipmentOptions([])
        setEquipment('')
      } finally {
        setLoadingEquipment(false)
      }
    }
    fetchEquipment()
  }, [process])

  // 공정, 작업장, 근무조 모두 선택 시 바코드 박스로 자동 포커스
  useEffect(() => {
    if (shift && process && equipment && batchNumberInputRef.current) {
      batchNumberInputRef.current.focus()
    }
  }, [shift, process, equipment])

  const handleInput = () => {
    // 바코드 입력/스캔 처리 (형식: 배치번호-품목코드, 예: HR06582801-DS100006)
    const barcodeRaw = batchNumber.trim()
    if (!barcodeRaw) {
      setError('바코드를 스캔하거나 입력하세요.')
      return
    }
    if (!date) {
      setError('일자를 선택하세요.')
      return
    }
    if (!shift) {
      setError('근무조를 선택하세요.')
      return
    }
    if (!process) {
      setError('공정을 선택하세요.')
      return
    }
    if (!equipment) {
      setError('작업장을 선택하세요.')
      return
    }

    // 배치번호-품목코드 파싱
    const parts = barcodeRaw.split('-')
    const rowBatchNumber = parts[0]?.trim() ?? ''
    const rowItemCode = parts.slice(1).join('-').trim() ?? ''

    // 동일 일자·공정·작업장·근무조에서 이미 입력된 배치번호인지 확인
    const isDuplicate = tableData.some(row => row.batchNumber === rowBatchNumber)
    if (isDuplicate) {
      setError(`이미 입력한 배치번호입니다. (${rowBatchNumber})`)
      if (batchNumberInputRef.current) {
        batchNumberInputRef.current.focus()
      }
      return
    }

    const now = new Date()
    const newRow: TableRow = {
      sequence: String(tableData.length + 1),
      batchNumber: rowBatchNumber,
      itemCode: rowItemCode,
      scanDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      scanTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    }

    setTableData([...tableData, newRow])
    setBatchNumber('')
    setError(null)

    if (batchNumberInputRef.current) {
      setTimeout(() => batchNumberInputRef.current?.focus(), 0)
    }
  }

  const handleSave = async () => {
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }
    if (!date) {
      setError('일자를 선택하세요.')
      return
    }
    if (!shift) {
      setError('근무조를 선택하세요.')
      return
    }
    if (!process) {
      setError('공정을 선택하세요.')
      return
    }
    if (!equipment) {
      setError('작업장을 선택하세요.')
      return
    }
    if (saving) return

    const user = localStorage.getItem('username') || localStorage.getItem('da_pda_last_username') || localStorage.getItem('user') || 'UNKNOWN'
    const rows = tableData.map(row => ({
      batchNumber: row.batchNumber,
      itemCode: row.itemCode,
      scanDate: row.scanDate,
      scanTime: row.scanTime
    }))

    try {
      setSaving(true)
      setError(null)
      const response = await axios.post('/api/slitting/save-slitting-data', {
        inputDate: date,
        shiftCode: shift,
        processCode: process,
        equipmentCode: equipment,
        rows,
        user
      })

      if (response.data.status === 'success') {
        alert('성공적으로 저장되었습니다.')
        setTableData([])
        setError(null)
      } else {
        setError(response.data.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? '저장 중 오류가 발생했습니다.'
      setError(`저장 실패: ${errMsg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (selectedRowIndex === null) {
      setError('삭제할 항목을 선택해주세요.')
      return
    }
    setTableData(prev => prev.filter((_, index) => index !== selectedRowIndex))
    setSelectedRowIndex(null)
    setError(null)
  }

  const handleRowClick = (index: number) => {
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
        <div className="slitting-error-banner">
          {error}
        </div>
      )}
      
      <div className="location-content">
        <div className="input-section">
          <div className="input-group date-with-search">
            <label htmlFor="date">일자</label>
            <div className="date-search-row">
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                placeholder="일자"
                className="date-input-narrow"
              />
              <button type="button" className="btn-search-small" onClick={() => { /* TODO: 조회 API */ }}>
                조회
              </button>
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="process" className="label-red">공정</label>
              <select
                id="process"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                disabled={loadingProcess}
              >
                <option value="">공정선택</option>
                {processOptions.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="equipment" className="label-red">작업장</label>
              <select
                id="equipment"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                disabled={!process || loadingEquipment}
              >
                <option value="">{process ? '작업장선택' : '공정을 먼저 선택'}</option>
                {equipmentOptions.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-row barcode-shift-row">
            <div className="input-group shift-left">
              <label htmlFor="shift" className="label-red">근무조</label>
              <select
                id="shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                disabled={loadingShifts}
              >
                <option value="">선택</option>
                {shiftOptions.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="barcode-input-wrap barcode-right">
              <input
                ref={batchNumberInputRef}
                type="text"
                id="batchNumber"
                className="barcode-input"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
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
                <th>순번</th>
                <th>배치번호</th>
                <th>품목코드</th>
                <th>스캔일자</th>
                <th>스캔시간</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="순번">-</td>
                  <td data-label="배치번호">-</td>
                  <td data-label="품목코드">-</td>
                  <td data-label="스캔일자">-</td>
                  <td data-label="스캔시간">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className={selectedRowIndex === index ? 'selected-row' : ''}
                  >
                    <td data-label="순번">{index + 1}</td>
                    <td data-label="배치번호">{row.batchNumber}</td>
                    <td data-label="품목코드">{row.itemCode}</td>
                    <td data-label="스캔일자">{row.scanDate}</td>
                    <td data-label="스캔시간">{row.scanTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-buttons">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving || tableData.length === 0}
          >
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

export default SlittingInput
