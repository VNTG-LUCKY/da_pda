import { useState, useEffect, useCallback } from 'react'
import {
  getScanHistory,
  getTodayStats,
  clearScanHistory,
  PAGE_LABEL,
  type ScanRecord,
  type DayStats,
} from '../utils/scanHistory'
import './ScanDashboard.css'

interface ScanDashboardProps {
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

function SuccessRate({ success, total }: { success: number; total: number }) {
  const rate = total === 0 ? 0 : Math.round((success / total) * 100)
  const color = rate >= 90 ? '#16a34a' : rate >= 70 ? '#d97706' : '#dc2626'
  return (
    <div className="sdb-rate-wrap">
      <svg className="sdb-rate-svg" viewBox="0 0 36 36">
        <circle className="sdb-rate-bg" cx="18" cy="18" r="15.9" />
        <circle
          className="sdb-rate-fg"
          cx="18" cy="18" r="15.9"
          stroke={color}
          strokeDasharray={`${rate} ${100 - rate}`}
          strokeDashoffset="25"
        />
      </svg>
      <span className="sdb-rate-num" style={{ color }}>{rate}%</span>
    </div>
  )
}

export default function ScanDashboard({ onClose, isDarkMode }: ScanDashboardProps) {
  const [stats, setStats]     = useState<DayStats>(getTodayStats())
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [filter, setFilter]   = useState<'all' | 'success' | 'error'>('all')
  const [pageFilter, setPageFilter] = useState<'all' | 'loading' | 'location' | 'slitting'>('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const HISTORY_SHOW = 100

  const reload = useCallback(() => {
    setStats(getTodayStats())
    setHistory(getScanHistory().slice().reverse()) // 최신순
  }, [])

  useEffect(() => { reload() }, [reload])

  const handleClear = () => {
    clearScanHistory()
    reload()
    setShowClearConfirm(false)
  }

  const filtered = history
    .filter(r => filter === 'all'   || r.result === filter)
    .filter(r => pageFilter === 'all' || r.page === pageFilter)
    .slice(0, HISTORY_SHOW)

  const todayStr = (() => {
    const d = new Date()
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  })()

  return (
    <div className={`sdb-overlay${isDarkMode ? ' dark' : ''}`} role="dialog" aria-modal="true" aria-label="스캔 이력 대시보드">
      <div className="sdb-modal">

        {/* 헤더 */}
        <div className="sdb-header">
          <div className="sdb-header-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="sdb-header-icon">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14h3v3M17 14h3M14 17v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>스캔 이력 / 통계</span>
          </div>
          <button className="sdb-close-btn" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="sdb-body">

          {/* 오늘 날짜 */}
          <p className="sdb-date-label">{todayStr} 스캔 현황</p>

          {/* 요약 카드 */}
          <div className="sdb-summary-row">
            <div className="sdb-stat-card sdb-stat-total">
              <span className="sdb-stat-num">{stats.total}</span>
              <span className="sdb-stat-label">전체</span>
            </div>
            <div className="sdb-stat-card sdb-stat-success">
              <span className="sdb-stat-num">{stats.success}</span>
              <span className="sdb-stat-label">성공</span>
            </div>
            <div className="sdb-stat-card sdb-stat-error">
              <span className="sdb-stat-num">{stats.error}</span>
              <span className="sdb-stat-label">오류</span>
            </div>
            <SuccessRate success={stats.success} total={stats.total} />
          </div>

          {/* 페이지별 분석 — 카드 클릭으로 이력 필터링 */}
          <div className="sdb-page-row">
            {PAGE_KEYS.map(page => {
              const p = stats.byPage[page]
              const total = p.success + p.error
              const c = PAGE_COLORS[page]
              const isActive = pageFilter === page
              return (
                <div
                  key={page}
                  className={`sdb-page-card${isActive ? ' sdb-page-card--active' : ''}`}
                  style={{
                    borderColor: c.border,
                    background: c.bg,
                    boxShadow: isActive ? `0 0 0 2.5px ${c.border}` : undefined,
                  }}
                  onClick={() => setPageFilter(isActive ? 'all' : page)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onKeyDown={e => e.key === 'Enter' && setPageFilter(isActive ? 'all' : page)}
                >
                  <div className="sdb-page-name" style={{ color: c.text }}>
                    <span className="sdb-page-dot" style={{ background: c.dot }} />
                    {PAGE_LABEL[page]}
                    <span className="sdb-page-tap-hint" style={{ color: c.border }}>
                      {isActive ? '▲ 전체 보기' : '▼ 이력 보기'}
                    </span>
                  </div>
                  <div className="sdb-page-nums">
                    <span className="sdb-page-ok" style={{ color: c.text }}>{p.success}<small>성공</small></span>
                    <span className="sdb-page-err">{p.error}<small>오류</small></span>
                  </div>
                  <div className="sdb-page-bar-wrap">
                    <div
                      className="sdb-page-bar-fill"
                      style={{
                        width: total === 0 ? '0%' : `${Math.round((p.success / total) * 100)}%`,
                        background: c.border,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* 이력 섹션 */}
          <div className="sdb-history-header">
            <span className="sdb-history-title">
              {pageFilter === 'all'
                ? `전체 이력 (${history.length}건)`
                : `${PAGE_LABEL[pageFilter]} 이력 (${history.filter(r => r.page === pageFilter).length}건)`}
            </span>
            <div className="sdb-filter-group">
              {(['all', 'success', 'error'] as const).map(f => (
                <button
                  key={f}
                  className={`sdb-filter-btn${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? '전체' : f === 'success' ? '성공' : '오류'}
                </button>
              ))}
            </div>
          </div>

          {/* 선택된 페이지 표시 + 전체 보기 버튼 */}
          {pageFilter !== 'all' && (
            <div className="sdb-page-filter-row">
              <span
                className="sdb-active-page-chip"
                style={{
                  borderColor: PAGE_COLORS[pageFilter].border,
                  color: PAGE_COLORS[pageFilter].text,
                  background: PAGE_COLORS[pageFilter].bg,
                }}
              >
                <span className="sdb-page-dot" style={{ background: PAGE_COLORS[pageFilter].dot }} />
                {PAGE_LABEL[pageFilter]}
              </span>
              <button
                className="sdb-page-filter-btn active"
                onClick={() => setPageFilter('all')}
              >
                ✕ 전체 보기
              </button>
            </div>
          )}

          {/* 이력 목록 */}
          <div className="sdb-history-list">
            {filtered.length === 0 ? (
              <div className="sdb-empty">해당하는 스캔 이력이 없습니다.</div>
            ) : (
              filtered.map(r => {
                const c = PAGE_COLORS[r.page]
                return (
                  <div key={r.id} className={`sdb-history-item${r.result === 'error' ? ' sdb-item-error' : ''}`}>
                    <span className="sdb-item-dot" style={{ background: r.result === 'success' ? '#22c55e' : '#ef4444' }} />
                    <div className="sdb-item-main">
                      <span className="sdb-item-batch">{r.batchNo || '—'}</span>
                      {r.result === 'error' && r.errorMsg && (
                        <span className="sdb-item-errmsg">{r.errorMsg}</span>
                      )}
                    </div>
                    <span className="sdb-item-page" style={{ color: c.text, borderColor: c.border, background: c.bg }}>
                      {PAGE_LABEL[r.page]}
                    </span>
                    <span className="sdb-item-time">{formatDatetime(r.datetime)}</span>
                  </div>
                )
              })
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="sdb-footer">
            {showClearConfirm ? (
              <div className="sdb-confirm-row">
                <span className="sdb-confirm-msg">전체 이력을 삭제할까요?</span>
                <button className="sdb-confirm-yes" onClick={handleClear}>삭제</button>
                <button className="sdb-confirm-no"  onClick={() => setShowClearConfirm(false)}>취소</button>
              </div>
            ) : (
              <button className="sdb-clear-btn" onClick={() => setShowClearConfirm(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/>
                </svg>
                이력 전체 삭제
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
