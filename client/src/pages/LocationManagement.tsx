import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { FontSizeLevel } from '../App'
import { useScanFeedback } from '../hooks/useScanFeedback'
import { addScanRecord } from '../utils/scanHistory'
import ScanDashboard from '../components/ScanDashboard'
import SaveHistoryModal from '../components/SaveHistoryModal'
import './LocationManagement.css'

interface TableRow {
  date: string
  time: string
  batchNumber: string
  materialCode: string
  length: string
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

interface LocationManagementProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  isWakeLock: boolean
  setIsWakeLock: (value: boolean) => void
  fontSizeLevel: FontSizeLevel
  setFontSizeLevel: (value: FontSizeLevel) => void
  barcodeDelay: number
  setBarcodeDelay: (value: number) => void
}

function LocationManagement({ isDarkMode, setIsDarkMode, isWakeLock, setIsWakeLock, fontSizeLevel, setFontSizeLevel }: LocationManagementProps) {
  const navigate = useNavigate()
  const loadingRackScanRef = useRef<HTMLInputElement>(null)
  const barcodeInputRef = useRef<HTMLInputElement>(null)
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

  const [loadingRackScan, setLoadingRackScan] = useState('')
  const [loadingRackType, setLoadingRackType] = useState('')
  const [loadingRackNumber, setLoadingRackNumber] = useState('')
  const [barcode, setBarcode] = useState('')
  const [cnt, setCnt] = useState('0')
  const [quantitySum, setQuantitySum] = useState('0')
  const [status, setStatus] = useState<'normal' | 'quantity-change'>('normal')
  const [quantity, setQuantity] = useState('')
  const [showBarcodeKeyboard, setShowBarcodeKeyboard] = useState(false)

  const focusBarcodeNoKeyboard = () => {
    setShowBarcodeKeyboard(false)
    if (barcodeInputRef.current) {
      barcodeInputRef.current.setAttribute('inputmode', 'none')
    }
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.setAttribute('inputmode', 'none')
        barcodeInputRef.current.focus()
      }
    }, 0)
  }
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [rackTypes, setRackTypes] = useState<RackType[]>([])
  const [rackNumbers, setRackNumbers] = useState<RackNumber[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRackNumbers, setLoadingRackNumbers] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [showOracleRefPanel, setShowOracleRefPanel] = useState(() => {
    try { return localStorage.getItem('location_show_oracle_ref') === 'true' } catch { return false }
  })
  const [saveParamsText, setSaveParamsText] = useState<string | null>(null)
  const [saveResultText, setSaveResultText] = useState<string | null>(null)

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
      playError()
      return
    }

    // 바코드가 입력되었는지 확인
    if (!barcode || barcode.trim() === '') {
      setError('바코드를 입력해주세요.')
      playError()
      return
    }

    // 바코드 형식 검증 및 파싱
    // 형식: 배치번호-자재코드-본수-수주번호-수주행번[-길이]
    // 예(5파트): HG00160205-DS100179-0180-15400-1
    // 예(6파트): HG00160200-DP200800-0120-15400-1-6.84
    const barcodeParts = barcode.trim().split('-')
    
    if (barcodeParts.length !== 5 && barcodeParts.length !== 6) {
      setError('바코드 형식이 올바르지 않습니다. (형식: 배치번호-자재코드-본수-수주번호-수주행번[-길이])')
      addScanRecord({ page: 'location', batchNo: barcode.trim(), result: 'error', errorMsg: '형식 오류' })
      playError()
      return
    }

    const [batchNumber, materialCode, quantityStr, orderNumber, orderLine, lengthStr = ''] = barcodeParts

    if (batchNumber.length !== 10) {
      setError(`배치번호는 10자리여야 합니다. (입력값: "${batchNumber}", ${batchNumber.length}자리)`)
      addScanRecord({ page: 'location', batchNo: batchNumber, result: 'error', errorMsg: '배치번호 자리수 오류' })
      playError()
      setBarcode('')
      focusBarcodeNoKeyboard()
      return
    }

    // 중복 체크: 동일한 배치번호와 자재코드가 이미 테이블에 있는지 확인
    const isDuplicate = tableData.some(
      (row) => row.batchNumber === batchNumber && row.materialCode === materialCode
    )

    if (isDuplicate) {
      setError('이미 적재위치에 등록된 배치번호입니다')
      addScanRecord({ page: 'location', batchNo: batchNumber, result: 'error', errorMsg: '중복 배치번호' })
      playError()
      setBarcode('')
      focusBarcodeNoKeyboard()
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
    const rawQuantity = (status === 'quantity-change' && quantity.trim() !== '') 
      ? quantity.trim() 
      : quantityStr
    // 수량 개념이므로 앞의 0 제거 (0180 → 180)
    const finalQuantity = (() => {
      const s = rawQuantity.trim()
      if (s === '') return s
      const n = parseFloat(s)
      return Number.isNaN(n) ? s : String(n)
    })()

    // 적재대구분 label 찾기
    const selectedRackType = rackTypes.find(type => type.value === loadingRackType)
    const rackTypeLabel = selectedRackType ? selectedRackType.label : loadingRackType
    const rackTypeCode = loadingRackType // 코드값은 이미 선택된 value

    // 적재대번호 label 찾기
    const selectedRackNumber = rackNumbers.find(number => number.value === loadingRackNumber)
    const rackNumberLabel = selectedRackNumber ? selectedRackNumber.label : loadingRackNumber
    const rackNumberCode = loadingRackNumber // 코드값은 이미 선택된 value

    // 길이 정규화 (앞뒤 공백 제거, 숫자이면 불필요한 0 제거)
    const finalLength = (() => {
      const s = lengthStr.trim()
      if (s === '') return ''
      const n = parseFloat(s)
      return Number.isNaN(n) ? s : String(n)
    })()

    // 테이블에 추가할 새 행 데이터
    const newRow: TableRow = {
      date: formattedDate,
      time: formattedTime,
      batchNumber: batchNumber,
      materialCode: materialCode,
      length: finalLength,
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
    addScanRecord({ page: 'location', batchNo: batchNumber, result: 'success' })
    playSuccess()
    
    // 에러 메시지 초기화
    setError(null)
    
    // 바코드 입력 필드 초기화
    setBarcode('')
    
    // 본수 변경 모드가 아니면 quantity도 초기화
    if (status === 'normal') {
      setQuantity('')
    }
    
    // 바코드 입력 필드로 다시 포커스 이동
    focusBarcodeNoKeyboard()
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
      length: row.length,
      quantity: row.quantity,
      orderNumber: row.orderNumber,
      orderLine: row.orderLine,
      rackTypeCode: row.rackTypeCode,
      rackNumberCode: row.rackNumberCode
    }))

    const oracleParamsLines = scanDataList.map((item, index) => {
      const scanDate = item.date
      const dateTime = `${item.date} ${item.time}`
      return [
        `[항목 ${index + 1}]`,
        `  P_BUSI_PLACE  = '1'`,
        `  P_JOB         = '1'`,
        `  P_LOC_LCODE   = '${item.rackTypeCode || ''}'`,
        `  P_LOC_MCODE   = '${item.rackNumberCode || ''}'`,
        `  P_BATCH       = '${item.batchNumber || ''}'`,
        `  P_ITEM_CODE   = '${item.materialCode || ''}'`,
        `  P_CO_NO       = '${item.orderNumber || ''}'`,
        `  P_CO_SERL     = '${item.orderLine || ''}'`,
        `  P_QTY         = ${item.quantity || '0'}`,
        `  P_SCAN_DATE   = '${scanDate}'`,
        `  P_LEN         = ${item.length || '0'}`,
        `  P_DATETIME    = '${dateTime}'`,
        `  P_USER        = '${user}'`
      ].join('\n')
    })

    const paramsForOracle = [
      '[PDA → 서버 API (POST /api/location/save-scan-data) Body]',
      JSON.stringify({ scanDataList, user }, null, 2),
      '',
      '[서버 → Oracle SP_PDA_LOAD_SCAN 전달 파라미터 (건별)]',
      oracleParamsLines.join('\n\n'),
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')
    if (showOracleRefPanel) setSaveParamsText(paramsForOracle)
    setSaveResultText(null)

    try {
      setSaving(true)
      setError(null)

      const response = await axios.post('/api/location/save-scan-data', {
        scanDataList,
        user
      })

      const d = response.data
      const results = d.results ?? []
      const resultLines = [
        '[SP_PDA_LOAD_SCAN 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        `status   = '${d.status ?? ''}'`,
        `message  = '${d.message ?? ''}'`,
        `successCount = ${d.successCount ?? 0}`,
        `failedCount  = ${d.failedCount ?? 0}`,
        '',
        '[건별 P_OUT_YN / P_OUT_MSG]',
        results.length ? results.map((r: any, i: number) =>
          `  [${i + 1}] 배치: ${r.batchNumber ?? ''}  P_OUT_YN='${r.outYn ?? ''}'  P_OUT_MSG='${r.outMsg ?? ''}'`
        ).join('\n') : '(없음)',
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      if (showOracleRefPanel) setSaveResultText(resultLines)
      sendEmailIfEnabled(paramsForOracle, resultLines)

      if (d.status === 'success') {
        alert('성공적으로 저장되었습니다.')
        setTableData([])
        setCnt('0')
        setQuantitySum('0')
        setError(null)
      } else {
        setError(d.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      const errData = err?.response?.data
      const errMsg = errData?.error ?? errData?.message ?? err?.message ?? '저장 중 오류가 발생했습니다.'
      setError(`저장 실패: ${errMsg}`)
      const resultLines = [
        '[SP_PDA_LOAD_SCAN 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        '(요청 예외 발생)',
        `message  = '${errMsg}'`,
        errData?.results ? '\n[건별 결과]\n' + (errData.results || []).map((r: any, i: number) =>
          `  [${i + 1}] 배치: ${r.batchNumber ?? ''}  P_OUT_YN='${r.outYn ?? ''}'  P_OUT_MSG='${r.outMsg ?? ''}'`
        ).join('\n') : '',
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].filter(Boolean).join('\n')
      if (showOracleRefPanel) setSaveResultText(resultLines)
      sendEmailIfEnabled(paramsForOracle, resultLines)
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

  // 화면 진입 시 적재대스캔 입력란에 포커스
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) return
    const t = setTimeout(() => {
      loadingRackScanRef.current?.focus()
    }, 100)
    return () => clearTimeout(t)
  }, [])

  // 적재대스캔 QR 처리: "구분코드-번호코드" 형식 스캔 시 자동 선택
  const handleRackScan = async (scanValue: string) => {
    const trimmed = scanValue.trim()
    if (!trimmed) return

    const dashIdx = trimmed.indexOf('-')
    if (dashIdx < 0) {
      // '-' 없으면 그냥 값만 유지, 자동 선택 안 함
      return
    }

    const typeCode = trimmed.substring(0, dashIdx)
    const numberCode = trimmed.substring(dashIdx + 1)

    setError(null)

    // 1) 적재대구분 자동 선택
    const matchedType = rackTypes.find(t => t.value === typeCode)
    if (!matchedType) {
      setError(`적재대구분 코드 "${typeCode}"를 찾을 수 없습니다.`)
      return
    }
    setLoadingRackType(typeCode)
    setLoadingRackNumber('')

    // 2) 적재대번호 목록 로드 후 자동 선택
    try {
      setLoadingRackNumbers(true)
      const response = await axios.get(`/api/location/rack-numbers/${encodeURIComponent(typeCode)}`)
      if (response.data.status === 'success') {
        const toString = (val: any): string => {
          if (val === null || val === undefined) return ''
          if (typeof val === 'string') return val
          if (typeof val === 'number' || typeof val === 'boolean') return String(val)
          if (typeof val === 'object') {
            if (val.CODE_NAME) return String(val.CODE_NAME)
            if (val.NAME) return String(val.NAME)
            if (val.CODE) return String(val.CODE)
            if (val.name) return String(val.name)
            if (val.label) return String(val.label)
            if (val.value) return String(val.value)
            return ''
          }
          return String(val)
        }
        const rawData = response.data.data || []
        const numbers = rawData.map((item: any, index: number) => ({
          value: toString(item.CODE || item.code || item.value),
          label: toString(item.CODE_NAME || item.NAME || item.name || item.label || item.CODE || item.code || item.value),
          id: item.id || index + 1
        }))
        setRackNumbers(numbers)

        const matchedNumber = numbers.find((n: RackNumber) => n.value === numberCode)
        if (!matchedNumber) {
          setError(`적재대번호 코드 "${numberCode}"를 찾을 수 없습니다.`)
        } else {
          setLoadingRackNumber(numberCode)
          // 선택 완료 후 바코드 입력란으로 포커스 이동
          focusBarcodeNoKeyboard()
        }
      } else {
        setRackNumbers([])
        setError('적재대번호를 불러오는 중 오류가 발생했습니다.')
      }
    } catch {
      setRackNumbers([])
      setError('적재대번호를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoadingRackNumbers(false)
    }
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
    try { localStorage.setItem('location_show_oracle_ref', String(checked)) } catch { /* ignore */ }
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
        pageName: '적재위치관리',
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

  const handleCopySaveParams = () => {
    if (!saveParamsText) return
    navigator.clipboard.writeText(saveParamsText).then(() => {
      alert('파라미터가 클립보드에 복사되었습니다.')
    }).catch(() => { alert('복사에 실패했습니다.') })
  }

  const handleCopySaveResult = () => {
    if (!saveResultText) return
    navigator.clipboard.writeText(saveResultText).then(() => {
      alert('저장 결과가 클립보드에 복사되었습니다.')
    }).catch(() => { alert('복사에 실패했습니다.') })
  }

  return (
    <div className="location-management-container">
      <div className="location-header">
        <button className="back-button" onClick={() => navigate('/main')}>
          ← 뒤로
        </button>
        <h1>적재위치 등록</h1>
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
        <div className="location-error-banner">
          {error}
        </div>
      )}

      {showOracleRefPanel && saveParamsText && (
        <div className="location-params-box">
          <div className="location-params-header">
            <span>저장 시 전송 파라미터 (오라클 DB 유지보수팀 전달용)</span>
            <button type="button" className="location-params-copy" onClick={handleCopySaveParams}>복사</button>
          </div>
          <pre className="location-params-text">{saveParamsText}</pre>
        </div>
      )}

      {showOracleRefPanel && saveResultText && (
        <div className="location-params-box location-result-box">
          <div className="location-params-header location-result-header">
            <span>저장 결과 SP_PDA_LOAD_SCAN 반환값 (오라클 DB 유지보수팀 전달용)</span>
            <button type="button" className="location-params-copy" onClick={handleCopySaveResult}>복사</button>
          </div>
          <pre className="location-params-text location-result-text">{saveResultText}</pre>
        </div>
      )}

      <div className="location-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="loadingRackScan" className="label-large">적재대스캔</label>
            <input
              ref={loadingRackScanRef}
              type="text"
              id="loadingRackScan"
              className="input-scan"
              value={loadingRackScan}
              onChange={(e) => setLoadingRackScan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleRackScan(loadingRackScan)
                }
              }}
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
                if (e.target.value) {
                  focusBarcodeNoKeyboard()
                }
              }}
              disabled={!loadingRackType || loadingRackNumbers}
            >
              <option value="">
                {loadingRackNumbers ? '로딩 중...' : loadingRackType ? '적재대번호를 선택하세요.' : '구분 우선 선택'}
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
                inputMode={showBarcodeKeyboard ? 'text' : 'none'}
                onTouchStart={(e) => { if (!showBarcodeKeyboard) e.preventDefault() }}
                onBlur={() => {
                  setShowBarcodeKeyboard(false)
                  if (barcodeInputRef.current) barcodeInputRef.current.setAttribute('inputmode', 'none')
                }}
              />
              <button
                type="button"
                className="barcode-camera-btn"
                tabIndex={-1}
                aria-label="직접 입력"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBarcodeKeyboard(true)
                  if (barcodeInputRef.current) {
                    barcodeInputRef.current.setAttribute('inputmode', 'text')
                    barcodeInputRef.current.focus()
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2l2-3h10l2 3a2 2 0 0 0 2 2v11z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
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
                <th>길이</th>
                <th>본수</th>
                <th>수주번호</th>
                <th>행번</th>
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
                  <td data-label="길이">-</td>
                  <td data-label="본수">-</td>
                  <td data-label="수주번호">-</td>
                  <td data-label="행번">-</td>
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
                    <td data-label="길이">{row.length}</td>
                    <td data-label="본수">{row.quantity}</td>
                    <td data-label="수주번호">{row.orderNumber}</td>
                    <td data-label="행번">{row.orderLine}</td>
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
