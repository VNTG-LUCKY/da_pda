import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { FontSizeLevel } from '../App'
import { useScanFeedback } from '../hooks/useScanFeedback'
import { addScanRecord } from '../utils/scanHistory'
import ScanDashboard from '../components/ScanDashboard'
import SaveHistoryModal from '../components/SaveHistoryModal'
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

interface SlittingInputProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  isWakeLock: boolean
  setIsWakeLock: (value: boolean) => void
  fontSizeLevel: FontSizeLevel
  setFontSizeLevel: (value: FontSizeLevel) => void
  barcodeDelay: number
  setBarcodeDelay: (value: number) => void
}

function SlittingInput({ isDarkMode, setIsDarkMode, isWakeLock, setIsWakeLock, fontSizeLevel, setFontSizeLevel }: SlittingInputProps) {
  const navigate = useNavigate()
  const batchNumberInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [emailForward, setEmailForward] = useState(() => {
    try { return localStorage.getItem('pda_email_forward') === 'true' } catch { return false }
  })
  const emailSendingRef = useRef(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    try { return localStorage.getItem('pda_sound_enabled') === 'true' } catch { return false }
  })
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(() => {
    try { return localStorage.getItem('pda_vibration_enabled') === 'true' } catch { return false }
  })
  const { playSuccess, playError } = useScanFeedback(isSoundEnabled, isVibrationEnabled)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showSaveHistory, setShowSaveHistory] = useState(false)

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
  const [loadingRetrieve, setLoadingRetrieve] = useState(false)
  const [showBarcodeKeyboard, setShowBarcodeKeyboard] = useState(false)

  const focusBarcodeNoKeyboard = () => {
    setShowBarcodeKeyboard(false)
    if (batchNumberInputRef.current) {
      batchNumberInputRef.current.setAttribute('inputmode', 'none')
    }
    setTimeout(() => {
      if (batchNumberInputRef.current) {
        batchNumberInputRef.current.setAttribute('inputmode', 'none')
        batchNumberInputRef.current.focus()
      }
    }, 0)
  }

  const [retrieveParamsText, setRetrieveParamsText] = useState<string | null>(null)
  const [retrieveResultText, setRetrieveResultText] = useState<string | null>(null)
  const [showOracleRefPanel, setShowOracleRefPanel] = useState(() => {
    try { return localStorage.getItem('slitting_show_oracle_ref') === 'true' } catch { return false }
  })

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
    if (shift && process && equipment) {
      focusBarcodeNoKeyboard()
    }
  // focusBarcodeNoKeyboard는 렌더마다 재생성되지 않는 안정적 참조이므로 의존성 제외
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift, process, equipment])

  const handleInput = () => {
    // 바코드 입력/스캔 처리 (형식: 배치번호-품목코드, 예: HR06582801-DS100006)
    const barcodeRaw = batchNumber.trim()
    if (!barcodeRaw) {
      setError('바코드를 스캔하거나 입력하세요.')
      playError()
      return
    }
    if (!date) {
      setError('일자를 선택하세요.')
      playError()
      return
    }
    if (!shift) {
      setError('근무조를 선택하세요.')
      playError()
      return
    }
    if (!process) {
      setError('공정을 선택하세요.')
      playError()
      return
    }
    if (!equipment) {
      setError('작업장을 선택하세요.')
      playError()
      return
    }

    // 배치번호-품목코드 파싱 (품목코드 없으면 'X' 처리)
    const parts = barcodeRaw.split('-')
    const rowBatchNumber = parts[0]?.trim() ?? ''
    const rowItemCode = parts.slice(1).join('-').trim() || 'X'

    if (rowBatchNumber.length !== 10) {
      setError(`배치번호는 10자리여야 합니다. (입력값: "${rowBatchNumber}", ${rowBatchNumber.length}자리)`)
      addScanRecord({ page: 'slitting', batchNo: rowBatchNumber, result: 'error', errorMsg: '배치번호 자리수 오류' })
      playError()
      focusBarcodeNoKeyboard()
      return
    }

    // 동일 일자·공정·작업장·근무조에서 이미 입력된 배치번호인지 확인
    const isDuplicate = tableData.some(row => row.batchNumber === rowBatchNumber)
    if (isDuplicate) {
      setError(`이미 입력한 배치번호입니다. (${rowBatchNumber})`)
      addScanRecord({ page: 'slitting', batchNo: rowBatchNumber, result: 'error', errorMsg: '중복 배치번호' })
      playError()
      focusBarcodeNoKeyboard()
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
    addScanRecord({ page: 'slitting', batchNo: rowBatchNumber, result: 'success' })
    playSuccess()
    setBatchNumber('')
    setError(null)

    focusBarcodeNoKeyboard()
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
        setBatchNumber('')
        setSelectedRowIndex(null)
        setError(null)
        setRetrieveParamsText(null)
        setRetrieveResultText(null)
        focusBarcodeNoKeyboard()
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

  const handleRetrieve = async () => {
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
    if (loadingRetrieve) return

    const payload = {
      inputDate: date,
      shift,
      wcList: equipment
    }

    const paramsForOracle = [
      '[PDA → 서버 API (POST /api/slitting/retrieve) Body]',
      JSON.stringify(payload, null, 2),
      '',
      '[서버 → Oracle SP_PDA_PR09080_RET 전달 파라미터]',
      `P_BUSI_PLACE  = '1'`,
      `P_INPUT_DATE  = '${payload.inputDate.replace(/\//g, '-')}'`,
      `P_SHIPT       = '${payload.shift}'`,
      `P_WC_LIST     = '${payload.wcList}'`,
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')

    setRetrieveParamsText(paramsForOracle)
    setRetrieveResultText(null)

    try {
      setLoadingRetrieve(true)
      setError(null)
      const response = await axios.post('/api/slitting/retrieve', payload)
      const d = response.data

      const outYn = d.outYn ?? (d.status === 'success' ? 'Y' : 'N')
      const outMsg = d.outMsg ?? d.message ?? ''
      const listData = d.data ?? []

      const resultForOracle = [
        '[SP_PDA_PR09080_RET 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        `O_OUT_YN   = '${outYn}'`,
        `O_OUT_MSG  = '${outMsg}'`,
        '',
        '[O_CURSOR 결과 목록]',
        JSON.stringify(listData, null, 2),
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      setRetrieveResultText(resultForOracle)
      sendEmailIfEnabled(paramsForOracle, resultForOracle)

      if (d.status === 'success') {
        const list = (listData || []) as TableRow[]
        setTableData(list)
        setSelectedRowIndex(null)
        setError(null)
      } else {
        setError(d.message || d.error || '조회 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      const errData = err?.response?.data
      const errMsg = errData?.error ?? errData?.message ?? err?.message ?? '조회 중 오류가 발생했습니다.'
      setError(`조회 실패: ${errMsg}`)
      const outYn = errData?.outYn ?? '(미수신)'
      const outMsg = errData?.outMsg ?? errMsg
      const listData = errData?.data ?? []
      const resultForOracle = [
        '[SP_PDA_PR09080_RET 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        err?.response ? '(서버 4xx/5xx 응답)' : '(요청 예외 발생)',
        `O_OUT_YN   = '${outYn}'`,
        `O_OUT_MSG  = '${outMsg}'`,
        '',
        '[O_CURSOR 결과 목록]',
        JSON.stringify(listData, null, 2),
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      setRetrieveResultText(resultForOracle)
      sendEmailIfEnabled(paramsForOracle, resultForOracle)
    } finally {
      setLoadingRetrieve(false)
    }
  }

  const handleCopyRetrieveParams = () => {
    if (!retrieveParamsText) return
    navigator.clipboard.writeText(retrieveParamsText).then(() => {
      alert('파라미터가 클립보드에 복사되었습니다.')
    }).catch(() => {
      alert('복사에 실패했습니다.')
    })
  }

  const handleCopyRetrieveResult = () => {
    if (!retrieveResultText) return
    navigator.clipboard.writeText(retrieveResultText).then(() => {
      alert('조회 결과가 클립보드에 복사되었습니다.')
    }).catch(() => {
      alert('복사에 실패했습니다.')
    })
  }

  useEffect(() => {
    if (!isOptionsOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setIsOptionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOptionsOpen])

  const handleOracleRefToggle = (checked: boolean) => {
    setShowOracleRefPanel(checked)
    try { localStorage.setItem('slitting_show_oracle_ref', String(checked)) } catch { /* ignore */ }
  }

  const handleEmailForwardToggle = (checked: boolean) => {
    setEmailForward(checked)
    try { localStorage.setItem('pda_email_forward', String(checked)) } catch { /* ignore */ }
  }
  void handleEmailForwardToggle // 이메일전달 UI 주석 처리 중 — 핸들러는 재활성화 시 사용

  const sendEmailIfEnabled = async (params: string | null, result: string | null) => {
    if (!emailForward || (!params && !result) || emailSendingRef.current) return
    emailSendingRef.current = true
    try {
      const res = await axios.post('/api/email/send', {
        paramsText: params || '',
        resultText: result || '',
        pageName: '스켈프 투입',
      })
      if (res.data?.status !== 'success') {
        alert(`이메일 전송 실패: ${res.data?.message || '알 수 없는 오류'}`)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || '서버 통신 오류'
      alert(`이메일 전송 실패: ${msg}`)
    }
    emailSendingRef.current = false
  }

  return (
    <div className="slitting-input-container">
      <div className="location-header">
        <button className="back-button" onClick={() => navigate('/main')}>
          ← 뒤로
        </button>
        <h1>스켈프 투입</h1>
        <div className="options-dropdown-wrapper header-options-right" ref={optionsRef}>
          <button
            type="button"
            className="header-options-button"
            aria-label="옵션"
            aria-expanded={isOptionsOpen}
            onClick={() => setIsOptionsOpen(prev => !prev)}
          >
            <svg className="options-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {isOptionsOpen && (
            <div className="options-dropdown" role="menu">
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={isDarkMode}>
                <span className="options-dropdown-item-icon">
                  {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#818cf8" stroke="#818cf8" strokeWidth="0.5"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="5" fill="#f59e0b"/>
                      <line x1="12" y1="1" x2="12" y2="3" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="12" y1="21" x2="12" y2="23" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="1" y1="12" x2="3" y2="12" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="21" y1="12" x2="23" y2="12" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
                <span className="options-dropdown-item-label">다크 모드</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={isDarkMode} onChange={e => setIsDarkMode(e.target.checked)} aria-label="다크 모드 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={showOracleRefPanel}>
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">전달용</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={showOracleRefPanel} onChange={e => handleOracleRefToggle(e.target.checked)} aria-label="전달용 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>
              {/* 이메일전달 옵션 - 임시 비활성화 (재활성화 시 style 제거)
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={emailForward}>
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#64748b" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">이메일전달</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={emailForward} onChange={e => handleEmailForwardToggle(e.target.checked)} aria-label="이메일전달 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>
              */}

              {/* 화면 꺼짐 방지 */}
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={isWakeLock}>
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke={isWakeLock ? '#22c55e' : '#64748b'} strokeWidth="2"/>
                    <path d="M8 21h8M12 17v4" stroke={isWakeLock ? '#22c55e' : '#64748b'} strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="10" r="2.5" fill={isWakeLock ? '#22c55e' : '#64748b'}/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">화면 꺼짐 방지</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={isWakeLock} onChange={e => setIsWakeLock(e.target.checked)} aria-label="화면 꺼짐 방지 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>

              {/* 글꼴 크기 */}
              <div className="options-dropdown-item options-dropdown-item--fontsize" role="group" aria-label="글꼴 크기">
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="2" y="18" fontSize="13" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">A</text>
                    <text x="11" y="20" fontSize="16" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">A</text>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">글꼴 크기</span>
                <div className="options-font-size-buttons">
                  <button type="button" className={`options-font-size-btn${fontSizeLevel === 'small'  ? ' active' : ''}`} onClick={() => setFontSizeLevel('small')}>소</button>
                  <button type="button" className={`options-font-size-btn${fontSizeLevel === 'medium' ? ' active' : ''}`} onClick={() => setFontSizeLevel('medium')}>중</button>
                  <button type="button" className={`options-font-size-btn${fontSizeLevel === 'large'  ? ' active' : ''}`} onClick={() => setFontSizeLevel('large')}>대</button>
                </div>
              </div>

              {/* 스캔 효과음 */}
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={isSoundEnabled}>
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill={isSoundEnabled ? '#3b82f6' : 'none'} stroke={isSoundEnabled ? '#3b82f6' : '#64748b'} strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={isSoundEnabled ? '#3b82f6' : '#64748b'} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">스캔 효과음</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={isSoundEnabled} onChange={e => { setIsSoundEnabled(e.target.checked); localStorage.setItem('pda_sound_enabled', String(e.target.checked)) }} aria-label="스캔 효과음 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>

              {/* 진동 피드백 */}
              <label className="options-dropdown-item" role="menuitemcheckbox" aria-checked={isVibrationEnabled}>
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="7" y="2" width="10" height="20" rx="2" stroke={isVibrationEnabled ? '#f59e0b' : '#64748b'} strokeWidth="2"/>
                    <path d="M3 7v10M21 7v10" stroke={isVibrationEnabled ? '#f59e0b' : '#64748b'} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">진동 피드백</span>
                <span className="options-toggle-switch">
                  <input type="checkbox" checked={isVibrationEnabled} onChange={e => { setIsVibrationEnabled(e.target.checked); localStorage.setItem('pda_vibration_enabled', String(e.target.checked)) }} aria-label="진동 피드백 토글" />
                  <span className="options-toggle-slider" />
                </span>
              </label>

              {/* 스캔 이력 */}
              <button
                type="button"
                className="options-dropdown-item options-dropdown-item--btn"
                onClick={() => { setShowDashboard(true); setIsOptionsOpen(false) }}
              >
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#6366f1" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#6366f1" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#6366f1" strokeWidth="2"/>
                    <path d="M14 14h3v3M17 14h3M14 17v3h3" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">스캔 이력</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              {/* 저장 이력 */}
              <button
                type="button"
                className="options-dropdown-item options-dropdown-item--btn"
                onClick={() => { setShowSaveHistory(true); setIsOptionsOpen(false) }}
              >
                <span className="options-dropdown-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17,21 17,13 7,13 7,21" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7,3 7,8 15,8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="options-dropdown-item-label">저장 이력</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>

            </div>
          )}
        </div>
      </div>

      {showDashboard && (
        <ScanDashboard isDarkMode={isDarkMode} onClose={() => setShowDashboard(false)} />
      )}

      {showSaveHistory && (
        <SaveHistoryModal isDarkMode={isDarkMode} onClose={() => setShowSaveHistory(false)} />
      )}
      
      {error && (
        <div className="slitting-error-banner">
          {error}
        </div>
      )}

      {showOracleRefPanel && retrieveParamsText && (
        <div className="slitting-params-box">
          <div className="slitting-params-header">
            <span>조회 시 전송 파라미터 (오라클 DB 유지보수팀 전달용)</span>
            <button type="button" className="slitting-params-copy" onClick={handleCopyRetrieveParams}>
              복사
            </button>
          </div>
          <pre className="slitting-params-text">{retrieveParamsText}</pre>
        </div>
      )}

      {showOracleRefPanel && retrieveResultText && (
        <div className="slitting-params-box slitting-result-box">
          <div className="slitting-params-header slitting-result-header">
            <span>조회 결과 SP_PDA_PR09080_RET 반환값 (오라클 DB 유지보수팀 전달용)</span>
            <button type="button" className="slitting-params-copy" onClick={handleCopyRetrieveResult}>
              복사
            </button>
          </div>
          <pre className="slitting-params-text slitting-result-text">{retrieveResultText}</pre>
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
              <button
                type="button"
                className="btn-search-small"
                onClick={handleRetrieve}
                disabled={loadingRetrieve || !date || !shift || !process || !equipment}
              >
                {loadingRetrieve ? '조회 중...' : '조회'}
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
            <div className="barcode-input-wrap barcode-right input-with-icon">
              <input
                ref={batchNumberInputRef}
                type="text"
                id="batchNumber"
                className="barcode-input"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                inputMode={showBarcodeKeyboard ? 'text' : 'none'}
                onTouchStart={(e) => { if (!showBarcodeKeyboard) e.preventDefault() }}
                onBlur={() => {
                  setShowBarcodeKeyboard(false)
                  if (batchNumberInputRef.current) batchNumberInputRef.current.setAttribute('inputmode', 'none')
                }}
              />
              <button
                type="button"
                className="camera-btn"
                tabIndex={-1}
                aria-label="직접 입력"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBarcodeKeyboard(true)
                  if (batchNumberInputRef.current) {
                    batchNumberInputRef.current.setAttribute('inputmode', 'text')
                    batchNumberInputRef.current.focus()
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2l2-3h10l2 3a2 2 0 0 0 2 2v11z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
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
