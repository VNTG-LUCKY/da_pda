import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FontSizeLevel } from '../App'
import ScanDashboard from '../components/ScanDashboard'
import SaveHistoryModal from '../components/SaveHistoryModal'
import './Main.css'

interface MenuCard {
  id: string
  className: string
  route: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

const MENU_CARDS: MenuCard[] = [
  {
    id: 'location',
    className: 'card-orange',
    route: '/location-management',
    title: '적재위치관리',
    subtitle: '적재위치 관리',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"/>
        <path d="M2 17L12 22L22 17" stroke="#f59e0b" strokeWidth="2"/>
        <path d="M2 12L12 17L22 12" stroke="#f59e0b" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'slitting',
    className: 'card-green',
    route: '/slitting-input',
    title: '스켈프 투입',
    subtitle: '스켈프 투입 처리',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" fill="#22c55e" stroke="#22c55e" strokeWidth="2"/>
        <path d="M8 10H16M8 14H16" stroke="white" strokeWidth="2"/>
        <path d="M12 6V18" stroke="white" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'loading',
    className: 'card-blue',
    route: '/loading-registration',
    title: '상차등록',
    subtitle: '상차 등록 처리',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="8" width="20" height="12" rx="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M6 8V6C6 4.89543 6.89543 4 8 4H16C17.1046 4 18 4.89543 18 6V8" stroke="white" strokeWidth="2"/>
        <path d="M8 12H16" stroke="white" strokeWidth="2"/>
      </svg>
    )
  }
]

type ServerStatus = 'unknown' | 'checking' | 'online' | 'offline'
type DbEnv = 'unknown' | 'checking' | 'development' | 'production'

interface MainProps {
  setIsAuthenticated: (value: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  isWakeLock: boolean
  setIsWakeLock: (value: boolean) => void
  fontSizeLevel: FontSizeLevel
  setFontSizeLevel: (value: FontSizeLevel) => void
  barcodeDelay: number
  setBarcodeDelay: (value: number) => void
}

const DELAY_PRESETS = [
  { label: '짧게', ms: 50  },
  { label: '보통', ms: 100 },
  { label: '길게', ms: 200 },
]

function Main({ setIsAuthenticated, isDarkMode, setIsDarkMode, isWakeLock, setIsWakeLock, fontSizeLevel, setFontSizeLevel, barcodeDelay, setBarcodeDelay }: MainProps) {
  const navigate = useNavigate()
  const [isOptionsOpen, setIsOptionsOpen]       = useState(false)
  const [showDashboard, setShowDashboard]         = useState(false)
  const [showSaveHistory, setShowSaveHistory]     = useState(false)
  const [serverStatus, setServerStatus]           = useState<ServerStatus>('unknown')
  const [dbEnv, setDbEnv]                         = useState<DbEnv>('unknown')
  const optionsRef = useRef<HTMLDivElement>(null)

  // 카드 순서 - localStorage에서 복원
  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('main_card_order')
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        const allIds = MENU_CARDS.map(c => c.id)
        if (
          Array.isArray(parsed) &&
          parsed.length === allIds.length &&
          allIds.every(id => parsed.includes(id))
        ) return parsed
      }
    } catch { /* ignore */ }
    return MENU_CARDS.map(c => c.id)
  })

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // 드래그 상태 ref
  const pointerStartId  = useRef<string | null>(null)
  const pointerStartPos = useRef({ x: 0, y: 0 })
  const isDragMode      = useRef(false)
  const dragOverIdRef   = useRef<string | null>(null)
  const cardEls         = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
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

  // 서버 연결 상태 확인
  const checkServer = useCallback(() => {
    setServerStatus('checking')
    fetch('/api/health', { signal: AbortSignal.timeout(5000) })
      .then(res => {
        setServerStatus(res.ok ? 'online' : 'offline')
      })
      .catch(() => setServerStatus('offline'))
  }, [])

  // DB 환경 확인
  const checkDbEnv = useCallback(() => {
    setDbEnv('checking')
    fetch('/api/db/env', { signal: AbortSignal.timeout(5000) })
      .then(res => res.json())
      .then(data => {
        const env = data.NODE_ENV
        setDbEnv(env === 'production' ? 'production' : 'development')
      })
      .catch(() => setDbEnv('unknown'))
  }, [])

  // 드롭다운 열릴 때 자동으로 서버 상태 및 DB 환경 확인
  useEffect(() => {
    if (isOptionsOpen) {
      checkServer()
      checkDbEnv()
    }
  }, [isOptionsOpen, checkServer, checkDbEnv])

  // ── 드래그 핸들 포인터 이벤트 ──────────────────────────────────
  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    pointerStartId.current  = id
    pointerStartPos.current = { x: e.clientX, y: e.clientY }
    isDragMode.current      = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartId.current) return
    const dy = Math.abs(e.clientY - pointerStartPos.current.y)

    if (!isDragMode.current && dy > 6) {
      isDragMode.current = true
      setDraggingId(pointerStartId.current)
    }

    if (isDragMode.current) {
      let overId: string | null = null
      cardEls.current.forEach((el, cardId) => {
        if (cardId === pointerStartId.current) return
        const rect = el.getBoundingClientRect()
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          overId = cardId
        }
      })
      dragOverIdRef.current = overId
      setDragOverId(overId)
    }
  }

  const handlePointerUp = () => {
    const toId   = dragOverIdRef.current
    const fromId = pointerStartId.current

    if (isDragMode.current && fromId && toId && fromId !== toId) {
      setCardOrder(prev => {
        const next    = [...prev]
        const fromIdx = next.indexOf(fromId)
        const toIdx   = next.indexOf(toId)
        if (fromIdx < 0 || toIdx < 0) return prev
        next.splice(fromIdx, 1)
        next.splice(toIdx, 0, fromId)
        try { localStorage.setItem('main_card_order', JSON.stringify(next)) } catch { /* ignore */ }
        return next
      })
    }

    isDragMode.current     = false
    dragOverIdRef.current  = null
    pointerStartId.current = null
    setDraggingId(null)
    setDragOverId(null)
  }

  const orderedCards = cardOrder
    .map(id => MENU_CARDS.find(c => c.id === id))
    .filter((c): c is MenuCard => Boolean(c))

  return (
    <div className="main-container">
      <div className="main-header">
        <div className="main-header-side main-header-left">
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
        <div className="main-header-content">
          <div className="main-header-line1">
            <span className="main-company-name">동아스틸</span>
            <span className="main-app-name"> PDA</span>
          </div>
          <p className="main-subtitle">물류 관리 시스템</p>
        </div>
        <div className="main-header-side main-header-right">
          <div className="options-dropdown-wrapper" ref={optionsRef}>
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

                {/* 다크 모드 */}
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
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={e => setIsDarkMode(e.target.checked)}
                      aria-label="다크 모드 토글"
                    />
                    <span className="options-toggle-slider" />
                  </span>
                </label>

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
                    <input
                      type="checkbox"
                      checked={isWakeLock}
                      onChange={e => setIsWakeLock(e.target.checked)}
                      aria-label="화면 꺼짐 방지 토글"
                    />
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
                    <button
                      type="button"
                      className={`options-font-size-btn${fontSizeLevel === 'small' ? ' active' : ''}`}
                      onClick={() => setFontSizeLevel('small')}
                    >소</button>
                    <button
                      type="button"
                      className={`options-font-size-btn${fontSizeLevel === 'medium' ? ' active' : ''}`}
                      onClick={() => setFontSizeLevel('medium')}
                    >중</button>
                    <button
                      type="button"
                      className={`options-font-size-btn${fontSizeLevel === 'large' ? ' active' : ''}`}
                      onClick={() => setFontSizeLevel('large')}
                    >대</button>
                  </div>
                </div>

                {/* 서버 연결 상태 */}
                <div className="options-dropdown-item options-server-item">
                  <span className="options-dropdown-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="3" width="20" height="5" rx="1" stroke="#64748b" strokeWidth="2"/>
                      <rect x="2" y="10" width="20" height="5" rx="1" stroke="#64748b" strokeWidth="2"/>
                      <rect x="2" y="17" width="20" height="5" rx="1" stroke="#64748b" strokeWidth="2"/>
                      <circle cx="19" cy="5.5"  r="1.5" fill="#64748b"/>
                      <circle cx="19" cy="12.5" r="1.5" fill="#64748b"/>
                      <circle cx="19" cy="19.5" r="1.5" fill="#64748b"/>
                    </svg>
                  </span>
                  <span className="options-dropdown-item-label">서버 상태</span>
                  <span className={`options-server-badge options-server-badge--${serverStatus}`}>
                    {serverStatus === 'checking' && (
                      <span className="options-server-spinner" />
                    )}
                    {serverStatus === 'unknown'  && '—'}
                    {serverStatus === 'checking' && '확인 중'}
                    {serverStatus === 'online'   && '● 연결됨'}
                    {serverStatus === 'offline'  && '● 연결 안됨'}
                  </span>
                  <button
                    type="button"
                    className="options-server-refresh"
                    onClick={e => { e.stopPropagation(); checkServer() }}
                    aria-label="서버 상태 새로고침"
                    disabled={serverStatus === 'checking'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M23 4v6h-6"/>
                      <path d="M1 20v-6h6"/>
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                  </button>
                </div>

                {/* DB 환경 */}
                <div className="options-dropdown-item options-server-item">
                  <span className="options-dropdown-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#64748b" strokeWidth="2"/>
                      <path d="M3 5v5c0 1.657 4.03 3 9 3s9-1.343 9-3V5" stroke="#64748b" strokeWidth="2"/>
                      <path d="M3 10v5c0 1.657 4.03 3 9 3s9-1.343 9-3v-5" stroke="#64748b" strokeWidth="2"/>
                    </svg>
                  </span>
                  <span className="options-dropdown-item-label">DB 환경</span>
                  <span className={`options-db-env-badge options-db-env-badge--${dbEnv}`}>
                    {dbEnv === 'checking'    && <span className="options-server-spinner" />}
                    {dbEnv === 'unknown'     && '—'}
                    {dbEnv === 'checking'    && '확인 중'}
                    {dbEnv === 'development' && '● 개발 DB'}
                    {dbEnv === 'production'  && '● 운영 DB'}
                  </span>
                </div>

                {/* 바코드 입력 딜레이 */}
                <div className="options-dropdown-item options-dropdown-item--fontsize" role="group" aria-label="바코드 입력 딜레이">
                  <span className="options-dropdown-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2"  y="4" width="2"  height="16" rx="1" fill="#64748b"/>
                      <rect x="6"  y="4" width="1"  height="16" rx="0.5" fill="#64748b"/>
                      <rect x="9"  y="4" width="3"  height="16" rx="1" fill="#64748b"/>
                      <rect x="14" y="4" width="1"  height="16" rx="0.5" fill="#64748b"/>
                      <rect x="17" y="4" width="2"  height="16" rx="1" fill="#64748b"/>
                      <rect x="21" y="4" width="1"  height="16" rx="0.5" fill="#64748b"/>
                    </svg>
                  </span>
                  <span className="options-dropdown-item-label">입력 딜레이</span>
                  <div className="options-font-size-buttons">
                    {DELAY_PRESETS.map(({ label, ms }) => (
                      <button
                        key={ms}
                        type="button"
                        className={`options-font-size-btn${barcodeDelay === ms ? ' active' : ''}`}
                        onClick={() => setBarcodeDelay(ms)}
                        title={`${ms}ms`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

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
      </div>

      {showDashboard && (
        <ScanDashboard isDarkMode={isDarkMode} onClose={() => setShowDashboard(false)} />
      )}

      {showSaveHistory && (
        <SaveHistoryModal isDarkMode={isDarkMode} onClose={() => setShowSaveHistory(false)} />
      )}

      <div className="main-content">
        <h2 className="main-title">주요 기능</h2>

        <div className="function-cards">
          {orderedCards.map(card => (
            <div
              key={card.id}
              ref={el => {
                if (el) cardEls.current.set(card.id, el)
                else cardEls.current.delete(card.id)
              }}
              className={[
                'function-card',
                card.className,
                draggingId === card.id ? 'card-dragging' : '',
                dragOverId === card.id  ? 'card-drag-over' : ''
              ].filter(Boolean).join(' ')}
              onClick={() => navigate(card.route)}
            >
              <div className="card-icon">
                {card.icon}
              </div>
              <div className="card-text">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-subtitle">{card.subtitle}</p>
              </div>
              {/* 드래그 핸들 */}
              <div
                className="card-drag-handle"
                onPointerDown={e => handlePointerDown(card.id, e)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={e => e.stopPropagation()}
                aria-label="순서 변경 핸들"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true">
                  <circle cx="9"  cy="5"  r="1.6" fill="currentColor"/>
                  <circle cx="15" cy="5"  r="1.6" fill="currentColor"/>
                  <circle cx="9"  cy="12" r="1.6" fill="currentColor"/>
                  <circle cx="15" cy="12" r="1.6" fill="currentColor"/>
                  <circle cx="9"  cy="19" r="1.6" fill="currentColor"/>
                  <circle cx="15" cy="19" r="1.6" fill="currentColor"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main
