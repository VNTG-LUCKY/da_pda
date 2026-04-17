// 스캔 이력 저장/조회 유틸리티
// localStorage 'pda_scan_history' 키에 최대 500건 FIFO 방식으로 보관

export type ScanPage = 'loading' | 'location' | 'slitting'

export const PAGE_LABEL: Record<ScanPage, string> = {
  loading:  '상차등록',
  location: '적재위치관리',
  slitting: '스켈프 투입',
}

export interface ScanRecord {
  id:        string      // 고유 ID (timestamp + random)
  page:      ScanPage
  datetime:  string      // ISO 8601
  batchNo:   string      // 스캔한 배치번호 (알 수 없으면 빈 문자열)
  result:    'success' | 'error'
  errorMsg?: string      // 에러 사유
}

const STORAGE_KEY = 'pda_scan_history'
const MAX_RECORDS = 500

export function addScanRecord(data: Omit<ScanRecord, 'id' | 'datetime'>): void {
  const record: ScanRecord = {
    ...data,
    id:       `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    datetime: new Date().toISOString(),
  }
  try {
    const prev = getScanHistory()
    const next = [...prev, record]
    if (next.length > MAX_RECORDS) next.splice(0, next.length - MAX_RECORDS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch { /* ignore */ }
}

export function getScanHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ScanRecord[]
  } catch {
    return []
  }
}

export function clearScanHistory(): void {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

// 로컬 기준 날짜 문자열 (YYYY-MM-DD)
export function localDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ISO datetime 문자열을 로컬 날짜 문자열(YYYY-MM-DD)로 변환
export function isoToLocalDate(iso: string): string {
  return localDateStr(new Date(iso))
}

export interface DayStats {
  total:   number
  success: number
  error:   number
  byPage:  Record<ScanPage, { success: number; error: number }>
}

export function getTodayStats(): DayStats {
  const today = localDateStr()
  const records = getScanHistory().filter(r => isoToLocalDate(r.datetime) === today)

  const byPage: DayStats['byPage'] = {
    loading:  { success: 0, error: 0 },
    location: { success: 0, error: 0 },
    slitting: { success: 0, error: 0 },
  }

  for (const r of records) {
    byPage[r.page][r.result]++
  }

  const success = records.filter(r => r.result === 'success').length
  const error   = records.filter(r => r.result === 'error').length

  return { total: records.length, success, error, byPage }
}
