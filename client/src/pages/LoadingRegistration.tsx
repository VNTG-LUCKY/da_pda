import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FontSizeLevel } from '../App'
import { useScanFeedback } from '../hooks/useScanFeedback'
import { addScanRecord } from '../utils/scanHistory'
import ScanDashboard from '../components/ScanDashboard'
import SaveHistoryModal from '../components/SaveHistoryModal'
import './LoadingRegistration.css'

interface TableRow {
  completed: boolean
  sequence: string      // 화면 표시용 순번 (PDA_SEQ, 1·2·3…)
  loadIndiSerl: string  // 상차지시순번 - 숨김, 저장용 (SP: LOAD_INDI_SERL)
  itemCode: string      // 저장용 (화면에 미표시)
  itemName: string      // 화면 표시용
  itemCount: string
  batch: string
  batchCount: string
  bundleCount: string
  length: string
  coNo: string          // 수주번호
  coSerl: string        // 수주행번
  sendReqNo: string     // 출하의뢰번호 (SP 조회 결과)
  sendReqSerl: string   // 출하의뢰순번 (SP 조회 결과)
  loadType: string      // 상차유형 (SP 조회 결과, 숨김)
}

interface LoadingRegistrationProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  isWakeLock: boolean
  setIsWakeLock: (value: boolean) => void
  fontSizeLevel: FontSizeLevel
  setFontSizeLevel: (value: FontSizeLevel) => void
  barcodeDelay: number
  setBarcodeDelay: (value: number) => void
}

function LoadingRegistration({ isDarkMode, setIsDarkMode, isWakeLock, setIsWakeLock, fontSizeLevel, setFontSizeLevel }: LoadingRegistrationProps) {
  const navigate = useNavigate()
  const instructionRef = useRef<HTMLInputElement>(null)
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
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isLoadingPickingSel, setIsLoadingPickingSel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOracleRefPanel, setShowOracleRefPanel] = useState(() => {
    try { return localStorage.getItem('loading_show_oracle_ref') === 'true' } catch { return false }
  })
  const [pickingParamsText, setPickingParamsText] = useState<string | null>(null)
  const [pickingResultText, setPickingResultText] = useState<string | null>(null)

  // 인증 확인
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) {
      navigate('/login')
    }
  }, [navigate])

  // tableData 변경 시 수량(배치수 합계)·라인(배치 있는 행 수) 자동 계산
  useEffect(() => {
    const batchRows = tableData.filter(row => row.batch !== '')
    const sum = batchRows.reduce((acc, row) => acc + (parseFloat(row.batchCount) || 0), 0)
    setQuantitySum(sum > 0 ? String(sum) : '')
    setLineCount(batchRows.length > 0 ? String(batchRows.length) : '')
  }, [tableData])

  // 화면 진입 시 지시 입력란에 포커스
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth) return
    const t = setTimeout(() => {
      instructionRef.current?.focus()
    }, 100)
    return () => clearTimeout(t)
  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
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
    try { localStorage.setItem('loading_show_oracle_ref', String(checked)) } catch { /* ignore */ }
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
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paramsText: params || '',
          resultText: result || '',
          pageName: '상차등록',
        }),
      })
      const json = await res.json()
      if (json?.status !== 'success') {
        alert(`이메일 전송 실패: ${json?.message || '알 수 없는 오류'}`)
      }
    } catch (err: any) {
      alert(`이메일 전송 실패: ${err?.message || '서버 통신 오류'}`)
    }
    emailSendingRef.current = false
  }

  const handleCopyPickingParams = () => {
    if (!pickingParamsText) return
    navigator.clipboard.writeText(pickingParamsText).then(() => {
      alert('파라미터가 클립보드에 복사되었습니다.')
    }).catch(() => { alert('복사에 실패했습니다.') })
  }

  const handleCopyPickingResult = () => {
    if (!pickingResultText) return
    navigator.clipboard.writeText(pickingResultText).then(() => {
      alert('조회 결과가 클립보드에 복사되었습니다.')
    }).catch(() => { alert('복사에 실패했습니다.') })
  }

  // SP_PDA_PICKING_SEL 실제 조회 (엔터 / 7자 자동조회 공용)
  const fetchPickingSel = async (loadIndiNo: string) => {
    if (!loadIndiNo) {
      setError('지시번호를 입력하세요.')
      return
    }
    if (isLoadingPickingSel) return
    setError(null)
    setInfoMessage(null)
    setPickingResultText(null)

    const paramsForOracle = [
      '[PDA → 서버 API (POST /api/loading/picking-sel) Body]',
      JSON.stringify({ loadIndiNo }, null, 2),
      '',
      '[서버 → Oracle SP_PDA_PICKING_SEL 전달 파라미터]',
      `P_BUSI_PLACE   = '1'`,
      `P_LOAD_INDI_NO = '${loadIndiNo}'`,
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')
    if (showOracleRefPanel) setPickingParamsText(paramsForOracle)

    setIsLoadingPickingSel(true)
    try {
      const response = await fetch(`/api/loading/picking-sel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadIndiNo })
      })
      const json = await response.json()

      const outYn = json.outYn ?? (json.status === 'success' ? 'Y' : 'N')
      const outMsg = json.outMsg ?? json.message ?? ''
      const listData = json.data ?? []

      const resultForOracle = [
        '[SP_PDA_PICKING_SEL 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        `O_OUT_YN   = '${outYn}'`,
        `O_OUT_MSG  = '${outMsg}'`,
        '',
        '[O_CURSOR 결과 목록]',
        JSON.stringify(listData, null, 2),
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      if (showOracleRefPanel) setPickingResultText(resultForOracle)
      sendEmailIfEnabled(paramsForOracle, resultForOracle)

      // O_OUT_YN 값에 관계없이 O_OUT_MSG 항상 화면에 표시
      if (outMsg) setInfoMessage(outMsg)

      if (outYn === 'A') {
        setError(outMsg || '조회 결과를 확인하세요.')
        return
      }

      if (outYn === 'N' || !response.ok || json.status === 'error') {
        setError(outMsg || json.message || '조회 중 오류가 발생했습니다.')
        return
      }
      const rows: any[] = listData

      // CAR_NO → 차량 박스
      if (rows.length > 0 && rows[0].CAR_NO != null) {
        setVehicleNumber(String(rows[0].CAR_NO))
      }

      // 계획 = 품목코드+길이 그룹당 첫 행의 지시수(QTY)만 합산 (중복 행 제외)
      const seenGroups = new Set<string>()
      const planSum = rows.reduce((acc: number, r: any) => {
        const key = `${r.ITEM_CODE ?? ''}|${r.LEN ?? ''}`
        if (seenGroups.has(key)) return acc
        seenGroups.add(key)
        return acc + (parseFloat(r.QTY) || 0)
      }, 0)
      setTotalPlannedQuantity(planSum > 0 ? String(planSum) : '')

      // 커서 rows → 테이블
      const mapped: TableRow[] = rows.map((r: any, idx: number) => ({
        completed: String(r.QTY_CHECK ?? 'N').trim().toUpperCase() === 'Y',
        sequence: String(idx + 1),                  // PDA 순번 (화면 표시)
        loadIndiSerl: String(r.LOAD_INDI_SERL ?? ''), // 상차지시순번 (저장용, 숨김)
        itemCode: String(r.ITEM_CODE ?? ''),
        itemName: String(r.ITEM_NAME ?? ''),
        itemCount: String(r.QTY ?? ''),
        batch: String(r.BATCH_NO ?? ''),
        batchCount: String(r.PICK_QTY ?? ''),
        bundleCount: String(r.BD_QTY ?? ''),
        length: String(r.LEN ?? ''),
        coNo: String(r.CO_NO ?? ''),
        coSerl: String(r.CO_SERL ?? ''),
        sendReqNo: String(r.SEND_REQ_NO ?? ''),
        sendReqSerl: String(r.SEND_REQ_SERL ?? ''),
        loadType: String(r.LOAD_TYPE ?? '')
      }))
      setTableData(mapped)

      // 조회 완료 후 바코드 입력란으로 포커스 이동
      setTimeout(() => focusBarcodeNoKeyboard(), 100)
    } catch (err: any) {
      setError('서버 통신 오류: ' + (err?.message ?? ''))
      if (showOracleRefPanel) {
        setPickingResultText([
          '[SP_PDA_PICKING_SEL 반환값 (오라클 DB 유지보수팀 전달용)]',
          '',
          '(요청 예외 발생)',
          `message = '${(err?.message ?? '')}'`,
          '',
          `(수신일시: ${new Date().toLocaleString('ko-KR')})`
        ].join('\n'))
      }
    } finally {
      setIsLoadingPickingSel(false)
    }
  }

  // 지시박스 엔터 키 핸들러
  const handleInstructionEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    fetchPickingSel(instructionNumber1.trim())
  }

  const handleInput = () => {
    const raw = barcode.trim()
    if (!raw) {
      setError('바코드를 입력하세요.')
      playError()
      return
    }

    // 수량변경 모드인데 변경수량이 비어 있으면 차단
    if (mode === 'quantityChange' && !changeQuantity.trim()) {
      setError('수량변경에 수량을 넣으세요.')
      playError()
      return
    }

    // 바코드 형식: 배치-품목코드-품목수-수주번호-수주행번-길이 (6파트)
    const parts = raw.split('-')
    if (parts.length === 6) {
      const [batchNo, itemCode, batchCnt, scannedCoNo, scannedCoSerl, lenStr] = parts

      if (batchNo.length !== 10) {
        setError(`배치번호는 10자리여야 합니다. (입력값: "${batchNo}", ${batchNo.length}자리)`)
        addScanRecord({ page: 'loading', batchNo, result: 'error', errorMsg: '배치번호 자리수 오류' })
        playError()
        setBarcode('')
        setTimeout(() => focusBarcodeNoKeyboard(), 0)
        return
      }

      const overrideQty = mode === 'quantityChange' && changeQuantity.trim()
      const newBatchCount = overrideQty ? String(Number(changeQuantity.trim()) || changeQuantity.trim()) : String(Number(batchCnt) || batchCnt)

      // 길이 비교를 위한 정규화 (앞뒤 공백, 소수점 자리 차이 허용)
      const normLen = (v: string) => String(parseFloat(v) || v).trim()
      const scannedLen = normLen(lenStr)

      // 품목코드 + 길이가 모두 일치하는 행 탐색
      // 배치가 비어 있는 행 우선, 없으면 마지막 매칭 행
      const emptyBatchIdx = tableData.findIndex(
        row => row.itemCode === itemCode && normLen(row.length) === scannedLen && !row.batch
      )
      const matchIdx = emptyBatchIdx !== -1
        ? emptyBatchIdx
        : tableData.reduce<number>(
            (last, row, i) =>
              row.itemCode === itemCode && normLen(row.length) === scannedLen ? i : last,
            -1
          )

      if (matchIdx === -1) {
        setError(`품목 "${itemCode}" / 길이 "${lenStr}"에 해당하는 항목을 목록에서 찾을 수 없습니다.`)
        addScanRecord({ page: 'loading', batchNo, result: 'error', errorMsg: '품목/길이 불일치' })
        playError()
        setBarcode('')
        setTimeout(() => focusBarcodeNoKeyboard(), 0)
        return
      }

      // 동일 배치 + 품목코드 + 길이 중복 체크
      const isDuplicate = tableData.some(
        row => row.batch === batchNo && row.itemCode === itemCode && normLen(row.length) === scannedLen
      )
      if (isDuplicate) {
        setError(`이미 등록된 항목입니다. (배치: ${batchNo} / 품목: ${itemCode} / 길이: ${lenStr})`)
        addScanRecord({ page: 'loading', batchNo, result: 'error', errorMsg: '중복 배치번호' })
        playError()
        setBarcode('')
        setTimeout(() => focusBarcodeNoKeyboard(), 0)
        return
      }

      // 해당 품목코드 + 길이 그룹이 이미 완료된 경우 차단
      const isGroupCompleted = tableData.some(
        row => row.itemCode === itemCode && normLen(row.length) === scannedLen && row.completed
      )
      if (isGroupCompleted) {
        setError('이미 완료된 태그입니다.')
        addScanRecord({ page: 'loading', batchNo, result: 'error', errorMsg: '완료된 그룹' })
        playError()
        setBarcode('')
        setTimeout(() => focusBarcodeNoKeyboard(), 0)
        return
      }

      // 계획량 초과 체크: 현재 피킹 합계 + 새 배치수 > 계획량이면 차단
      const currentSum = tableData
        .filter(row => row.batch !== '')
        .reduce((acc, row) => acc + (parseFloat(row.batchCount) || 0), 0)
      const addingQty = parseFloat(newBatchCount) || 0
      const planQty = parseFloat(totalPlannedQuantity) || 0
      if (planQty > 0 && currentSum + addingQty > planQty) {
        setError(`계획량보다 피킹량이 많습니다. (계획: ${planQty}, 현재 피킹: ${currentSum}, 스캔: ${addingQty})`)
        addScanRecord({ page: 'loading', batchNo, result: 'error', errorMsg: '계획량 초과' })
        playError()
        setBarcode('')
        setTimeout(() => focusBarcodeNoKeyboard(), 0)
        return
      }

      setTableData(prev => {
        const targetRow = prev[matchIdx]

        // 배치 채우기 또는 행 삽입 후 중간 배열 생성
        let next: TableRow[]
        if (!targetRow.batch) {
          // 배치가 비어 있으면 해당 행에 바로 채우기
          next = prev.map((row, i) =>
            i === matchIdx
              ? { ...row, batch: batchNo, batchCount: newBatchCount, coNo: scannedCoNo, coSerl: scannedCoSerl }
              : row
          )
        } else {
          // 배치가 이미 있으면 복사 후 바로 아래에 삽입
          const newRow: TableRow = {
            ...targetRow,
            batch: batchNo,
            batchCount: newBatchCount,
            coNo: scannedCoNo,
            coSerl: scannedCoSerl,
            completed: false
          }
          next = [...prev]
          next.splice(matchIdx + 1, 0, newRow)
        }

        // 순번 재계산
        next = next.map((row, i) => ({ ...row, sequence: String(i + 1) }))

        // 동일 품목코드 + 길이 그룹의 배치수 합계 계산 후 완료 체크 일괄 적용
        // (배치가 채워진 행만 합산)
        const groupSum = next
          .filter(row => row.itemCode === itemCode && normLen(row.length) === scannedLen && row.batch)
          .reduce((sum, row) => sum + (parseFloat(row.batchCount) || 0), 0)
        const groupItemCount = parseFloat(targetRow.itemCount) || 0
        const groupComplete = groupItemCount > 0 && groupSum === groupItemCount

        return next.map(row => {
          if (row.itemCode === itemCode && normLen(row.length) === scannedLen) {
            return { ...row, completed: groupComplete }
          }
          return row
        })
      })

      setBarcode('')
      setChangeQuantity('')
      setError(null)
      addScanRecord({ page: 'loading', batchNo, result: 'success' })
      playSuccess()
      setTimeout(() => focusBarcodeNoKeyboard(), 0)
      return
    }

    // 6파트가 아닌 경우 에러
    setError('바코드 형식이 올바르지 않습니다. (배치-품목코드-품목수-수주번호-수주행번-길이)')
    addScanRecord({ page: 'loading', batchNo: raw, result: 'error', errorMsg: '형식 오류' })
    playError()
    setBarcode('')
    setTimeout(() => focusBarcodeNoKeyboard(), 0)
  }


  const resetForm = () => {
    setInstructionNumber1('')
    setVehicleNumber('')
    setVehicleFullName('')
    setTotalPlannedQuantity('')
    setQuantitySum('')
    setBarcode('')
    setLineCount('')
    setMode('normal')
    setChangeQuantity('')
    setTableData([])
    setSelectedRowIndex(null)
    setError(null)
    setInfoMessage(null)
    setPickingParamsText(null)
    setPickingResultText(null)
  }

  const handleFinalSave = async () => {
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }
    if (!instructionNumber1.trim()) {
      setError('지시번호가 없습니다.')
      return
    }
    if (isSaving) return

    const planVal = parseFloat(totalPlannedQuantity) || 0
    const scanVal = parseFloat(quantitySum) || 0
    if (planVal !== scanVal) {
      setError('지시수량 대비 스캔량이 다릅니다.')
      return
    }

    if (!window.confirm('최종 저장하면 수정할 수 없습니다. 진행하시겠습니까?')) return

    const user = localStorage.getItem('username') || localStorage.getItem('da_pda_last_username') || 'UNKNOWN'
    const payload = {
      endYn: 'Y',
      scanDate: date,
      loadIndiNo: instructionNumber1.trim(),
      carNo: vehicleNumber,
      user,
      rows: tableData.map((row, idx) => ({
        pdaSeq:      row.sequence,
        loadIndiSerl: row.loadIndiSerl,
        batchNo:     row.batch,
        itemCode:    row.itemCode,
        loadType:    row.loadType,
        sendReqNo:   row.sendReqNo,
        sendReqSerl: row.sendReqSerl,
        coNo:        row.coNo,
        coSerl:      row.coSerl,
        qty:         row.itemCount,
        pickQty:     row.batchCount,
        qtyCheck:    row.completed ? 'Y' : 'N',
        len:         row.length,
        bdQty:       row.bundleCount,
        firstRow:    idx === 0 ? 'Y' : 'N'
      }))
    }

    const paramsLog = [
      '[PDA → 서버 API (POST /api/loading/picking-save) Body] [최종 저장]',
      JSON.stringify(payload, null, 2),
      '',
      '[서버 → Oracle SP_PDA_PICKING_SAVE 전달 파라미터 (행별)]',
      payload.rows.map((r, i) => [
        `[행 ${i + 1}]`,
        `  PDA_SEQ          = '${r.pdaSeq}'`,
        `  LOAD_INDI_SERL   = '${r.loadIndiSerl}'`,
        `  P_BUSI_PLACE     = '1'`,
        `  P_END_YN         = '${payload.endYn}'`,
        `  P_SCAN_DATE      = '${payload.scanDate}'`,
        `  P_LOAD_INDI_NO   = '${payload.loadIndiNo}'`,
        `  P_BATCH_NO       = '${r.batchNo}'`,
        `  P_ITEM_CODE      = '${r.itemCode}'`,
        `  P_LOAD_TYPE      = '${r.loadType}'`,
        `  P_SEND_REQ_NO    = '${r.sendReqNo}'`,
        `  P_SEND_REQ_SERL  = '${r.sendReqSerl}'`,
        `  P_CO_NO          = '${r.coNo}'`,
        `  P_CO_SERL        = '${r.coSerl}'`,
        `  P_QTY            = '${r.qty}'`,
        `  P_PICK_QTY       = '${r.pickQty}'`,
        `  P_QTY_CHECK      = '${r.qtyCheck}'`,
        `  P_CAR_NO         = '${payload.carNo}'`,
        `  P_LEN            = '${r.len}'`,
        `  P_BD_QTY         = '${r.bdQty}'`,
        `  P_FIRST_ROW      = '${r.firstRow}'`,
        `  P_USER           = '${payload.user}'`
      ].join('\n')).join('\n\n'),
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')
    if (showOracleRefPanel) setPickingParamsText(paramsLog)
    setPickingResultText(null)

    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/loading/picking-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await response.json()

      const resultLog = [
        '[SP_PDA_PICKING_SAVE 반환값 (오라클 DB 유지보수팀 전달용)] [최종 저장]',
        '',
        `status       = '${json.status ?? ''}'`,
        `message      = '${json.message ?? ''}'`,
        `successCount = ${json.successCount ?? 0}`,
        `failedCount  = ${json.failedCount ?? 0}`,
        '',
        '[행별 O_OUT_YN / O_OUT_MSG]',
        (json.results ?? []).length
          ? (json.results as any[]).map((r: any, i: number) =>
              `  [${i + 1}] 배치: ${r.batchNo ?? ''}  O_OUT_YN='${r.outYn ?? ''}'  O_OUT_MSG='${r.outMsg ?? ''}'`
            ).join('\n')
          : '(없음)',
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      if (showOracleRefPanel) setPickingResultText(resultLog)
      sendEmailIfEnabled(paramsLog, resultLog)

      if (json.status === 'success') {
        const results: any[] = json.results ?? []
        const msgLines = results
          .filter((r: any) => r.outMsg)
          .map((r: any, i: number) => `[${i + 1}] 배치: ${r.batchNo ?? ''}  ${r.outMsg}`)
        const fullMsg = msgLines.length > 0
          ? `최종 저장이 완료되었습니다.\n\n${msgLines.join('\n')}`
          : '최종 저장이 완료되었습니다.'
        alert(fullMsg)
        resetForm()
        setTimeout(() => instructionRef.current?.focus(), 100)
      } else {
        setError(json.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      setError('서버 통신 오류: ' + (err?.message ?? ''))
    } finally {
      setIsSaving(false)
    }
  }

  const handleTemporary = async () => {
    if (tableData.length === 0) {
      setError('저장할 데이터가 없습니다.')
      return
    }
    if (!instructionNumber1.trim()) {
      setError('지시번호가 없습니다.')
      return
    }
    if (isSaving) return

    const user = localStorage.getItem('username') || localStorage.getItem('da_pda_last_username') || 'UNKNOWN'
    const payload = {
      endYn: 'N',
      scanDate: date,
      loadIndiNo: instructionNumber1.trim(),
      carNo: vehicleNumber,
      user,
      rows: tableData.map((row, idx) => ({
        pdaSeq:      row.sequence,
        loadIndiSerl: row.loadIndiSerl,
        batchNo:     row.batch,
        itemCode:    row.itemCode,
        loadType:    row.loadType,
        sendReqNo:   row.sendReqNo,
        sendReqSerl: row.sendReqSerl,
        coNo:        row.coNo,
        coSerl:      row.coSerl,
        qty:         row.itemCount,
        pickQty:     row.batchCount,
        qtyCheck:    row.completed ? 'Y' : 'N',
        len:         row.length,
        bdQty:       row.bundleCount,
        firstRow:    idx === 0 ? 'Y' : 'N'
      }))
    }

    const paramsLog = [
      '[PDA → 서버 API (POST /api/loading/picking-save) Body]',
      JSON.stringify(payload, null, 2),
      '',
      '[서버 → Oracle SP_PDA_PICKING_SAVE 전달 파라미터 (행별)]',
      payload.rows.map((r, i) => [
        `[행 ${i + 1}]`,
        `  PDA_SEQ          = '${r.pdaSeq}'`,
        `  LOAD_INDI_SERL   = '${r.loadIndiSerl}'`,
        `  P_BUSI_PLACE     = '1'`,
        `  P_END_YN         = '${payload.endYn}'`,
        `  P_SCAN_DATE      = '${payload.scanDate}'`,
        `  P_LOAD_INDI_NO   = '${payload.loadIndiNo}'`,
        `  P_BATCH_NO       = '${r.batchNo}'`,
        `  P_ITEM_CODE      = '${r.itemCode}'`,
        `  P_LOAD_TYPE      = '${r.loadType}'`,
        `  P_SEND_REQ_NO    = '${r.sendReqNo}'`,
        `  P_SEND_REQ_SERL  = '${r.sendReqSerl}'`,
        `  P_CO_NO          = '${r.coNo}'`,
        `  P_CO_SERL        = '${r.coSerl}'`,
        `  P_QTY            = '${r.qty}'`,
        `  P_PICK_QTY       = '${r.pickQty}'`,
        `  P_QTY_CHECK      = '${r.qtyCheck}'`,
        `  P_CAR_NO         = '${payload.carNo}'`,
        `  P_LEN            = '${r.len}'`,
        `  P_BD_QTY         = '${r.bdQty}'`,
        `  P_FIRST_ROW      = '${r.firstRow}'`,
        `  P_USER           = '${payload.user}'`
      ].join('\n')).join('\n\n'),
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')
    if (showOracleRefPanel) setPickingParamsText(paramsLog)
    setPickingResultText(null)

    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/loading/picking-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await response.json()

      const resultLog = [
        '[SP_PDA_PICKING_SAVE 반환값 (오라클 DB 유지보수팀 전달용)]',
        '',
        `status       = '${json.status ?? ''}'`,
        `message      = '${json.message ?? ''}'`,
        `successCount = ${json.successCount ?? 0}`,
        `failedCount  = ${json.failedCount ?? 0}`,
        '',
        '[행별 O_OUT_YN / O_OUT_MSG]',
        (json.results ?? []).length
          ? (json.results as any[]).map((r: any, i: number) =>
              `  [${i + 1}] 배치: ${r.batchNo ?? ''}  O_OUT_YN='${r.outYn ?? ''}'  O_OUT_MSG='${r.outMsg ?? ''}'`
            ).join('\n')
          : '(없음)',
        '',
        `(수신일시: ${new Date().toLocaleString('ko-KR')})`
      ].join('\n')
      if (showOracleRefPanel) setPickingResultText(resultLog)
      sendEmailIfEnabled(paramsLog, resultLog)

      if (json.status === 'success') {
        alert('임시 저장이 완료되었습니다.')
      } else {
        setError(json.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (err: any) {
      setError('서버 통신 오류: ' + (err?.message ?? ''))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(prev => prev === index ? null : index)
  }

  const handleDelete = () => {
    if (selectedRowIndex === null) {
      setError('삭제할 항목을 선택해주세요.')
      return
    }

    const target = tableData[selectedRowIndex]
    const normLen = (v: string) => String(parseFloat(v) || v).trim()
    const targetItemCode = target.itemCode
    const targetLen = normLen(target.length)

    setTableData(prev => {
      // 동일 품목코드+길이를 가진 선택 행 제외 다른 행이 있는지 확인
      const hasSiblings = prev.some(
        (row, i) => i !== selectedRowIndex && row.itemCode === targetItemCode && normLen(row.length) === targetLen
      )

      let next: TableRow[]
      if (hasSiblings) {
        // 형제 행이 있으면 선택한 행 자체를 삭제
        next = prev.filter((_, i) => i !== selectedRowIndex)
      } else {
        // 형제 행이 없으면 배치·배치수만 빈칸으로 초기화 (행 유지)
        next = prev.map((row, i) =>
          i === selectedRowIndex ? { ...row, batch: '', batchCount: '' } : row
        )
      }

      // 동일 품목코드+길이 그룹 전체 완료 체크 해제
      next = next.map(row =>
        row.itemCode === targetItemCode && normLen(row.length) === targetLen
          ? { ...row, completed: false }
          : row
      )

      // 순번 재계산
      return next.map((row, i) => ({ ...row, sequence: String(i + 1) }))
    })

    setSelectedRowIndex(null)
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
      
      {infoMessage && !error && (
        <div className="loading-registration-info-banner">
          {infoMessage}
        </div>
      )}

      {error && (
        <div className="loading-registration-error-banner">
          {error}
        </div>
      )}

      {showOracleRefPanel && pickingParamsText && (
        <div className="loading-params-box">
          <div className="loading-params-header">
            <span>조회 시 전송 파라미터 (오라클 DB 유지보수팀 전달용)</span>
            <button type="button" className="loading-params-copy" onClick={handleCopyPickingParams}>복사</button>
          </div>
          <pre className="loading-params-text">{pickingParamsText}</pre>
        </div>
      )}

      {showOracleRefPanel && pickingResultText && (
        <div className="loading-params-box loading-result-box">
          <div className="loading-params-header loading-result-header">
            <span>
              {pickingResultText.includes('SP_PDA_PICKING_SAVE')
                ? 'SP_PDA_PICKING_SAVE 반환값 (오라클 DB 유지보수팀 전달용)'
                : 'SP_PDA_PICKING_SEL 반환값 (오라클 DB 유지보수팀 전달용)'}
            </span>
            <button type="button" className="loading-params-copy" onClick={handleCopyPickingResult}>복사</button>
          </div>
          <pre className="loading-params-text loading-result-text">{pickingResultText}</pre>
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
              <label htmlFor="instructionNumber1">지시</label>
              <input
                ref={instructionRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="instructionNumber1"
                value={instructionNumber1}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 7)
                  setInstructionNumber1(digits)
                  if (digits.length === 7) {
                    fetchPickingSel(digits)
                  }
                }}
                onKeyDown={handleInstructionEnter}
                placeholder="지시번호 7자리"
                maxLength={7}
                disabled={isLoadingPickingSel}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="vehicleNumber">차량</label>
              <input
                type="text"
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="차량"
              />
            </div>

            <div className="input-group">
              <label htmlFor="vehicleFullName">네임</label>
              <input
                type="text"
                id="vehicleFullName"
                value={vehicleFullName}
                onChange={(e) => setVehicleFullName(e.target.value)}
                placeholder="네임"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="totalPlannedQuantity">계획</label>
              <input
                type="text"
                id="totalPlannedQuantity"
                value={totalPlannedQuantity}
                readOnly
                placeholder="계획"
              />
            </div>

            <div className="input-group">
              <label htmlFor="quantitySum">피킹</label>
              <input
                type="text"
                id="quantitySum"
                value={quantitySum}
                readOnly
                placeholder="피킹"
              />
            </div>
          </div>

          <div className="input-row">
              <div className="input-group loading-barcode-row">
                <div className="loading-barcode-wrapper">
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    id="barcode"
                    className="loading-barcode-input"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                    className="loading-barcode-camera-btn"
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2l2-3h10l2 3a2 2 0 0 0 2 2v11z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </button>
                </div>
              </div>

            <div className="input-group">
              <label htmlFor="lineCount">라인</label>
              <input
                type="text"
                id="lineCount"
                value={lineCount}
                readOnly
                placeholder="라인"
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
                <input
                  type="text"
                  id="changeQuantity"
                  className="quantity-input"
                  value={changeQuantity}
                  onChange={(e) => setChangeQuantity(e.target.value)}
                  placeholder="변경수량"
                />
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
                <th>완료</th>
                <th className="col-hidden">순번</th>
                <th className="col-hidden">품목코드</th>
                <th>품목</th>
                <th>길이</th>
                <th>지시수</th>
                <th>배치</th>
                <th>피킹수</th>
                <th>다발수</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="완료">-</td>
                  <td data-label="순번" className="col-hidden">-</td>
                  <td data-label="품목코드" className="col-hidden">-</td>
                  <td data-label="품목">-</td>
                  <td data-label="길이">-</td>
                  <td data-label="지시수">-</td>
                  <td data-label="배치">-</td>
                  <td data-label="피킹수">-</td>
                  <td data-label="다발수">-</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className={selectedRowIndex === index ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="완료" className="loading-complete-cell">
                      <input
                        type="checkbox"
                        checked={row.completed}
                        onChange={() => {}}
                        disabled
                        aria-label="완료"
                      />
                    </td>
                    <td data-label="순번" className="col-hidden">{row.sequence}</td>
                    <td data-label="품목코드" className="col-hidden">{row.itemCode}</td>
                    <td data-label="품목">{row.itemName}</td>
                    <td data-label="길이">{row.length}</td>
                    <td data-label="지시수">{row.itemCount}</td>
                    <td data-label="배치">{row.batch}</td>
                    <td data-label="피킹수">{row.batchCount}</td>
                    <td data-label="다발수">{row.bundleCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-buttons">
          <button className="final-save-button" onClick={handleFinalSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '최종 저장'}
          </button>
          <button className="temporary-button" onClick={handleTemporary} disabled={isSaving}>
            {isSaving ? '저장 중...' : '임시 저장'}
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

export default LoadingRegistration
