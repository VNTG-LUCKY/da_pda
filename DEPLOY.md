# 61.107.76.23 배포 (프론트 3000 → 백엔드 6000 → Oracle 172.17.1.56)

## 구성
- **브라우저** → `http://61.107.76.23:3000` 만 사용
- **3000** 서버가 `/api` 요청을 **6000** 백엔드로 프록시
- **백엔드(6000)** 가 Oracle DB **172.17.1.56** 접속

## 서버에서 실행 순서

### 1. 폴더 복사
- `da_pda` 전체를 예: `C:\da_pda` 에 복사

### 2. 백엔드 (포트 6000)
```bat
cd C:\da_pda\server
set PORT=6000
npm install
npm run dev
```
- Oracle DB(172.17.1.56)는 `server/.env` 또는 기본값으로 이미 설정됨

### 3. 프론트엔드 (포트 3000, /api → 6000 프록시)
```bat
cd C:\da_pda\client
npm install
npm run build
set PORT=3000
set BACKEND_URL=http://localhost:6000
npm run start
```
- `BACKEND_URL` 없으면 기본값 `http://localhost:6000` 사용

### 4. 접속
- 브라우저: `http://61.107.76.23:3000` (또는 해당 도메인)

## 로컬과의 차이
| 구분       | 로컬           | 61.107.76.23      |
|------------|----------------|-------------------|
| 프론트     | 3000 (Vite)    | 3000 (start-preview) |
| 백엔드     | 5000           | **6000**          |
| API 호출   | Vite가 5000으로 프록시 | 3000 서버가 6000으로 프록시 |
| Oracle DB  | 172.17.1.56    | 172.17.1.56       |
