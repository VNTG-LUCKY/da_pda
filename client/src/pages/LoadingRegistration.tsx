import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoadingRegistration.css'

interface TableRow {
  completed: boolean
  sequence: string
  itemCode: string   // 저장용 (화면에 미표시)
  itemName: string   // 화면 표시용
  itemCount: string
  batch: string
  batchCount: string
  bundleCount: string
  length: string
  coNo: string       // 수주번호 (바코드 4번째 파트)
  coSerl: string     // 수주행번 (바코드 5번째 파트)
}

function LoadingRegistration() {
  const navigate = useNavigate()
  const instructionRef = useRef<HTMLInputElement>(null)
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
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
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

  const handleOracleRefToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setShowOracleRefPanel(checked)
    try { localStorage.setItem('loading_show_oracle_ref', String(checked)) } catch { /* ignore */ }
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

  // 지시박스 엔터 → SP_PDA_PICKING_SEL 호출
  const handleInstructionEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const loadIndiNo = instructionNumber1.trim()
    if (!loadIndiNo) {
      setError('지시번호를 입력하세요.')
      return
    }
    setError(null)
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
      const apiBase = (window as any).__API_BASE__ || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/loading/picking-sel`, {
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

      if (!response.ok || json.status === 'error') {
        setError(json.message || '조회 중 오류가 발생했습니다.')
        return
      }
      const rows: any[] = listData

      // CAR_NO → 차량 박스
      if (rows.length > 0 && rows[0].CAR_NO != null) {
        setVehicleNumber(String(rows[0].CAR_NO))
      }

      // 계획 = 품목수(TOT_QTY) 합계 (최초 조회 시 1회 설정, 이후 변경 없음)
      const planSum = rows.reduce((acc: number, r: any) => acc + (parseFloat(r.TOT_QTY) || 0), 0)
      setTotalPlannedQuantity(planSum > 0 ? String(planSum) : '')

      // 커서 rows → 테이블
      const mapped: TableRow[] = rows.map((r: any) => ({
        completed: false,
        sequence: String(r.LOAD_INDI_SERL ?? ''),
        itemCode: String(r.ITEM_CODE ?? ''),
        itemName: String(r.ITEM_NAME ?? ''),
        itemCount: String(r.TOT_QTY ?? ''),
        batch: String(r.BATCH_NO ?? ''),
        batchCount: '',
        bundleCount: String(r.BD_QTY ?? ''),
        length: String(r.LEN ?? ''),
        coNo: String(r.CO_NO ?? ''),
        coSerl: String(r.CO_SERL ?? '')
      }))
      setTableData(mapped)

      // 조회 완료 후 바코드 입력란으로 포커스 이동
      setTimeout(() => barcodeInputRef.current?.focus(), 100)
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

  const handleInput = () => {
    const raw = barcode.trim()
    if (!raw) {
      setError('바코드를 입력하세요.')
      return
    }

    // 수량변경 모드인데 변경수량이 비어 있으면 차단
    if (mode === 'quantityChange' && !changeQuantity.trim()) {
      setError('수량변경에 수량을 넣으세요.')
      return
    }

    // 바코드 형식: 배치-품목코드-품목수-수주번호-수주행번-길이 (6파트)
    const parts = raw.split('-')
    if (parts.length === 6) {
      const [batchNo, itemCode, batchCnt, scannedCoNo, scannedCoSerl, lenStr] = parts
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
        setBarcode('')
        setTimeout(() => barcodeInputRef.current?.focus(), 0)
        return
      }

      // 동일 배치 + 품목코드 + 길이 중복 체크
      const isDuplicate = tableData.some(
        row => row.batch === batchNo && row.itemCode === itemCode && normLen(row.length) === scannedLen
      )
      if (isDuplicate) {
        setError(`이미 등록된 항목입니다. (배치: ${batchNo} / 품목: ${itemCode} / 길이: ${lenStr})`)
        setBarcode('')
        setTimeout(() => barcodeInputRef.current?.focus(), 0)
        return
      }

      // 해당 품목코드 + 길이 그룹이 이미 완료된 경우 차단
      const isGroupCompleted = tableData.some(
        row => row.itemCode === itemCode && normLen(row.length) === scannedLen && row.completed
      )
      if (isGroupCompleted) {
        setError('이미 완료된 태그입니다.')
        setBarcode('')
        setTimeout(() => barcodeInputRef.current?.focus(), 0)
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
      setTimeout(() => barcodeInputRef.current?.focus(), 0)
      return
    }

    // 6파트가 아닌 경우 에러
    setError('바코드 형식이 올바르지 않습니다. (배치-품목코드-품목수-수주번호-수주행번-길이)')
    setBarcode('')
    setTimeout(() => barcodeInputRef.current?.focus(), 0)
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
      rows: tableData.map(row => ({
        batchNo:     row.batch,
        itemCode:    row.itemCode,
        sendReqNo:   '',
        sendReqSerl: '',
        coNo:        row.coNo,
        coSerl:      row.coSerl,
        qty:         row.batchCount,
        len:         row.length
      }))
    }

    const paramsLog = [
      '[PDA → 서버 API (POST /api/loading/picking-save) Body]',
      JSON.stringify(payload, null, 2),
      '',
      '[서버 → Oracle SP_PDA_PICKING_SAVE 전달 파라미터 (행별)]',
      payload.rows.map((r, i) => [
        `[행 ${i + 1}]`,
        `  P_BUSI_PLACE    = '1'`,
        `  P_END_YN        = '${payload.endYn}'`,
        `  P_SCAN_DATE     = '${payload.scanDate}'`,
        `  P_LOAD_INDI_NO  = '${payload.loadIndiNo}'`,
        `  P_BATCH_NO      = '${r.batchNo}'`,
        `  P_ITEM_CODE     = '${r.itemCode}'`,
        `  P_LOAD_TYPE     = 'sa05_lm10'`,
        `  P_CO_NO         = '${r.coNo}'`,
        `  P_CO_SERL       = '${r.coSerl}'`,
        `  P_QTY           = '${r.qty}'`,
        `  P_CAR_NO        = '${payload.carNo}'`,
        `  P_LEN           = '${r.len}'`,
        `  P_USER          = '${payload.user}'`
      ].join('\n')).join('\n\n'),
      '',
      `(전송일시: ${new Date().toLocaleString('ko-KR')})`
    ].join('\n')
    if (showOracleRefPanel) setPickingParamsText(paramsLog)
    setPickingResultText(null)

    setIsSaving(true)
    setError(null)
    try {
      const apiBase = (window as any).__API_BASE__ || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/loading/picking-save`, {
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
        <label className="loading-oracle-ref-check">
          <input
            type="checkbox"
            checked={showOracleRefPanel}
            onChange={handleOracleRefToggle}
          />
          <span>전달용</span>
        </label>
      </div>
      
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
            <span>조회 결과 SP_PDA_PICKING_SEL 반환값 (오라클 DB 유지보수팀 전달용)</span>
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
                id="instructionNumber1"
                value={instructionNumber1}
                onChange={(e) => setInstructionNumber1(e.target.value)}
                onKeyDown={handleInstructionEnter}
                placeholder="지시"
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
              <label htmlFor="quantitySum">수량</label>
              <input
                type="text"
                id="quantitySum"
                value={quantitySum}
                readOnly
                placeholder="수량"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <div className="input-with-icon barcode-input-wrap">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  id="barcode"
                  className="barcode-input"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="바코드"
                />
                <span className="camera-icon">📷</span>
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
                <th>완료</th>
                <th>순번</th>
                <th>품목코드</th>
                <th>품목</th>
                <th>길이</th>
                <th>품목수</th>
                <th>배치</th>
                <th>배치수</th>
                <th>다발수</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td data-label="완료">-</td>
                  <td data-label="순번">-</td>
                  <td data-label="품목코드">-</td>
                  <td data-label="품목">-</td>
                  <td data-label="길이">-</td>
                  <td data-label="품목수">-</td>
                  <td data-label="배치">-</td>
                  <td data-label="배치수">-</td>
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
                    <td data-label="순번">{row.sequence}</td>
                    <td data-label="품목코드">{row.itemCode}</td>
                    <td data-label="품목">{row.itemName}</td>
                    <td data-label="길이">{row.length}</td>
                    <td data-label="품목수">{row.itemCount}</td>
                    <td data-label="배치">{row.batch}</td>
                    <td data-label="배치수">{row.batchCount}</td>
                    <td data-label="다발수">{row.bundleCount}</td>
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
