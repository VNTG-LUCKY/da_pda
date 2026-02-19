# 로컬 개발 (localhost:3000)

배포(61.107.76.23) 전에 내 PC에서 수정 사항을 확인할 때 사용합니다.

## 방법 1: 개발 모드 (권장)

**터미널 2개**를 열어서 실행합니다.

| 터미널 | 폴더 | 명령 | 설명 |
|--------|------|------|------|
| 1 | `da_pda/server` | `npm run dev` | 백엔드 **5000** 포트 실행 |
| 2 | `da_pda/client` | `npm run dev` | 프론트 **3000** 포트 실행 (Vite, /api → 5000 프록시) |

이후 브라우저에서 **http://localhost:3000/login** 접속하면 됩니다.

- 포트: 프론트 **3000**, 백엔드 **5000**
- API는 Vite가 5000으로 프록시하므로 브라우저는 3000만 사용합니다.

## 방법 2: 빌드본으로 로컬 확인

배포용 빌드를 로컬에서 띄워보고 싶을 때:

| 터미널 | 폴더 | 명령 |
|--------|------|------|
| 1 | `da_pda/server` | `npm run dev` (백엔드 5000) |
| 2 | `da_pda/client` | `npm run build` 후 `START-LOCAL.bat` 실행 (또는 `set BACKEND_URL=http://localhost:5000` 후 `npm run start`) |

이후 **http://localhost:3000/login** 접속.

---

## 요약

| 환경 | 프론트 | 백엔드 | 접속 주소 |
|------|--------|--------|-----------|
| **로컬 개발** | 3000 (npm run dev) | 5000 | http://localhost:3000 |
| **로컬 빌드 테스트** | 3000 (npm run start, BACKEND_URL=5000) | 5000 | http://localhost:3000 |
| **배포 서버** | 3000 (npm run start, BACKEND_URL=6000) | 6000 | http://61.107.76.23:3000 |
