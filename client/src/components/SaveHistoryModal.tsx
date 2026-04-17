import { useState, useEffect, useCallback } from 'react'
import { getScanHistory, PAGE_LABEL, localDateStr, isoToLocalDate, type ScanRecord } from '../utils/scanHistory'
import './SaveHistoryModal.css'

interface SaveHistoryModalProps {
  onClose: () => void
  isDarkMode: boolean
}

const PAGE_COLORS = {
  loading:  { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8', dot: '#3b82f6' },
  location: { bg: '#fffbeb', border: '#f59e0b', text: '#b45309', dot: '#f59e0b' },
  slitting: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d', dot: '#22c55e' },
}

const PAGE_KEYS = ['loading', 'location', 'slitting'] as const

function formatDatetime(iso: string): string {
  try {
    const d = new Date(iso)
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const dy = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${mo}/${dy} ${hh}:${mm}:${ss}`
  } catch {
    return iso
  }
}

export default function SaveHistoryModal({ onClose, isDarkMode }: SaveHistoryModalProps) {
  const [records, setRecords]         = useState<ScanRecord[]>([])
  const [dateFilter, setDateFilter]   = useState<'today' | 'all'>('today')
  const [pageFilter, setPageFilter]   = useState<'all' | 'loading' | 'location' | 'slitting'>('all')

  const todayStr = localDateStr()

  const reload = useCallback(() => {
    const all = getScanHistory()
      .filter(r => r.result === 'success')
      .slice()
      .reverse()
    setRecords(all)
  }, [])

  useEffect(() => { reload() }, [reload])

  const dateFiltered =
    dateFilter === 'today'
      ? records.filter(r => isoToLocalDate(r.datetime) === todayStr)
      : records

  const filtered =
    pageFilter === 'all'
      ? dateFiltered
      : dateFiltered.filter(r => r.page === pageFilter)

  const displayDate = (() => {
    const d = new Date()
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  })()

  return (
    <div className={`shm-overlay${isDarkMode ? ' dark' : ''}`} role="dialog" aria-modal="true" aria-label="최근 저장 이력">
      <div className="shm-modal">

        {/* 헤더 */}
        <div className="shm-header">
          <div className="shm-header-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shm-header-icon">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17,21 17,13 7,13 7,21"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7,3 7,8 15,8"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>최근 저장 이력</span>
          </div>
          <button className="shm-close-btn" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="shm-body">

          {/* 날짜 탭 */}
          <div className="shm-tab-row">
            <button
              className={`shm-tab${dateFilter === 'today' ? ' active' : ''}`}
              onClick={() => setDateFilter('today')}
            >
              오늘 ({records.filter(r => isoToLocalDate(r.datetime) === todayStr).length}건)
            </button>
            <button
              className={`shm-tab${dateFilter === 'all' ? ' active' : ''}`}
              onClick={() => setDateFilter('all')}
            >
              전체 ({records.length}건)
            </button>
          </div>

          {dateFilter === 'today' && (
            <p className="shm-date-label">{displayDate} 저장 현황</p>
          )}

          {/* 페이지별 요약 칩 */}
          <div className="shm-chip-row">
            <button
              className={`shm-chip${pageFilter === 'all' ? ' shm-chip--active' : ''}`}
              onClick={() => setPageFilter('all')}
            >
              전체 <span className="shm-chip-count">{dateFiltered.length}</span>
            </button>
            {PAGE_KEYS.map(page => {
              const c = PAGE_COLORS[page]
              const cnt = dateFiltered.filter(r => r.page === page).length
              const isActive = pageFilter === page
              return (
                <button
                  key={page}
                  className={`shm-chip${isActive ? ' shm-chip--active' : ''}`}
                  style={isActive ? { borderColor: c.border, background: c.bg, color: c.text } : undefined}
                  onClick={() => setPageFilter(isActive ? 'all' : page)}
                >
                  <span className="shm-chip-dot" style={{ background: c.dot }} />
                  {PAGE_LABEL[page]}
                  <span className="shm-chip-count" style={isActive ? { color: c.text } : undefined}>{cnt}</span>
                </button>
              )
            })}
          </div>

          {/* 이력 목록 */}
          <div className="shm-list">
            {filtered.length === 0 ? (
              <div className="shm-empty">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" opacity="0.25">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p>{dateFilter === 'today' ? '오늘 저장된 이력이 없습니다.' : '저장된 이력이 없습니다.'}</p>
              </div>
            ) : (
              filtered.map(r => {
                const c = PAGE_COLORS[r.page]
                return (
                  <div key={r.id} className="shm-item">
                    <span className="shm-item-check">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="shm-item-batch">{r.batchNo || '—'}</span>
                    <span
                      className="shm-item-page"
                      style={{ color: c.text, borderColor: c.border, background: c.bg }}
                    >
                      {PAGE_LABEL[r.page]}
                    </span>
                    <span className="shm-item-time">{formatDatetime(r.datetime)}</span>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
