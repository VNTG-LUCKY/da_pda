// 스캔 효과음 + 진동 피드백 훅
//
// M3 SL20 등 Android PDA 대응:
//   - 바코드 스캔(하드웨어 입력)은 브라우저의 "user gesture"로 인정되지 않아
//     AudioContext 가 suspended 상태로 유지됨.
//   - 화면 첫 터치/클릭 시 AudioContext를 unlock(resume + silent buffer)하고
//     이후 스캔 효과음이 정상 재생되도록 처리.
//   - navigator.vibrate() 미지원 기기 대비 try-catch 처리.

let _audioCtx: AudioContext | null = null
let _unlocked = false

function getAudioCtx(): AudioContext | null {
  try {
    if (!_audioCtx || _audioCtx.state === 'closed') {
      _audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      _unlocked = false
    }
    return _audioCtx
  } catch {
    return null
  }
}

/** 무음 버퍼를 재생하여 AudioContext를 완전히 활성화 */
function playSilentBuffer(ctx: AudioContext) {
  try {
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch { /* ignore */ }
}

/** 첫 사용자 터치/클릭 시 AudioContext unlock */
function ensureUnlocked(): Promise<void> {
  const ctx = getAudioCtx()
  if (!ctx) return Promise.resolve()
  if (_unlocked && ctx.state === 'running') return Promise.resolve()

  return ctx.resume().then(() => {
    playSilentBuffer(ctx)
    _unlocked = true
  }).catch(() => {})
}

/** 앱 로드 시 최초 터치/클릭 이벤트로 AudioContext unlock 등록 */
function registerUnlockListeners() {
  const unlock = () => {
    ensureUnlocked().then(() => {
      if (_unlocked) {
        document.removeEventListener('touchstart', unlock, true)
        document.removeEventListener('touchend', unlock, true)
        document.removeEventListener('pointerdown', unlock, true)
        document.removeEventListener('click', unlock, true)
        document.removeEventListener('keydown', unlock, true)
      }
    })
  }
  document.addEventListener('touchstart', unlock, true)
  document.addEventListener('touchend', unlock, true)
  document.addEventListener('pointerdown', unlock, true)
  document.addEventListener('click', unlock, true)
  document.addEventListener('keydown', unlock, true)
}

// 모듈 로드 시 즉시 리스너 등록
registerUnlockListeners()

function beep(freq: number, durationMs: number, gain: number, startOffsetSec = 0) {
  const ctx = getAudioCtx()
  if (!ctx) return
  // suspended 상태이면 재생 시도 전 resume
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  try {
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.connect(g)
    g.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.value = gain
    const t = ctx.currentTime + startOffsetSec
    osc.start(t)
    osc.stop(t + durationMs / 1000)
  } catch { /* ignore */ }
}

function tryVibrate(pattern: number | number[]) {
  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern)
    }
  } catch { /* ignore */ }
}

export function useScanFeedback(isSoundEnabled: boolean, isVibrationEnabled: boolean) {
  const playSuccess = () => {
    if (isSoundEnabled) {
      beep(1046, 60,  0.25)          // C6 – 짧고 높은 음
      beep(1318, 80,  0.25, 0.075)   // E6 – 연속 상승
    }
    if (isVibrationEnabled) {
      tryVibrate(60)
    }
  }

  const playError = () => {
    if (isSoundEnabled) {
      beep(280, 140, 0.3)
      beep(250, 200, 0.3, 0.18)
    }
    if (isVibrationEnabled) {
      tryVibrate([140, 80, 180])
    }
  }

  return { playSuccess, playError }
}
