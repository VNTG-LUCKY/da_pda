# 61.107.76.23 / pda.dongasteel.co.kr 배포 (프론트 3000 → 백엔드 6000 → Oracle 172.17.1.56)

## 공식 접속 주소 (DNS)

- **현재 사용:** `http://pda.dongasteel.co.kr:3000/login`  
  - 로그인·앱 접속 시 이 주소를 사용합니다.
- **참고:** 나중에 포트 없이 `http://pda.dongasteel.co.kr/login` 형태로 전환할 수 있습니다. (아래 "포트 없이 접속하기" 참고)

**휴대폰/PDA에서 앱(APK)으로 설치해 쓰려면:** [CAPACITOR-APK-GUIDE.md](./CAPACITOR-APK-GUIDE.md) 참고 (초보자용 단계별 설명).

**APK 다운로드 주소:** 프론트엔드(3000) 실행 시 `http://pda.dongasteel.co.kr:3000/download` 또는 (Nginx 사용 시) `http://pda.dongasteel.co.kr/download`. APK 파일은 **client/apk/da-pda.apk** 에 두면 됩니다.

## 구성
- **브라우저** → `http://pda.dongasteel.co.kr:3000` 또는 **(Nginx 설정 시)** `http://pda.dongasteel.co.kr` (포트 없이)
- **3000** 서버가 `/api` 요청을 **6000** 백엔드로 프록시
- **백엔드(6000)** 가 Oracle DB **172.17.1.56** 접속

## 로컬 vs 서버 — 누가 뭘 하나요?

| 할 일 | 로컬 (Cursor/개발 PC) | 서버 (C:\da_pda) |
|--------|------------------------|-------------------|
| **npm install** | client 폴더에서 실행 (의존성 설치·테스트용). 서버에 복사 전에 한 번 해 두면 package-lock.json 등이 맞음. | **반드시 실행.** 복사 후 `C:\da_pda\client`에서 실행해 @capacitor/app 등 의존성 설치. |
| **npm run build** | 선택. 로컬에서 미리 빌드해 보려면 실행. | **반드시 실행.** `C:\da_pda\client`에서 실행해 dist 갱신. |
| **npx cap sync** | **APK를 새로 만들 때만** 실행 (로컬 client에서). 서버에는 Android 프로젝트가 없으므로 서버에서는 실행하지 않음. | **실행 안 함.** 서버는 웹(dist)만 서빙함. |

- **화면 종료** 같은 프론트만 수정한 경우: 서버에서 `npm install` → `npm run build` → **프론트엔드(3000) 재시작**만 하면 됨. PDA 앱(APK)은 그 주소를 열기 때문에, 재시작 후 앱만 다시 열면 새 화면이 보임.
- **APK를 새로 만들어 배포**할 때만 로컬에서 `npx cap sync` 후 Android Studio로 APK 빌드.

## 서버에서 실행 순서

### 1. 폴더 복사
- `da_pda` 전체를 서버에 복사 (예: `C:\da_pda`)

### 2. 백엔드 (포트 6000)
```bat
cd C:\da_pda\server
npm install
npm run build
set PORT=6000
npm run start
```
- **중요:** 배포 환경에서는 반드시 `set PORT=6000` 후 실행 (클라이언트가 6000으로 프록시함)
- Oracle DB는 `server/.env` 또는 기본값으로 이미 설정됨

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
- **현재 공식 주소:** `http://pda.dongasteel.co.kr:3000/login`
- **방법 B (선택):** [아래 "포트 없이 접속하기"](#포트-없이-접속하기-80-사용) 설정 후 `http://pda.dongasteel.co.kr/login` 사용 가능

---

## 서버에서 “화면 종료” 등 프론트만 반영할 때 (요약)

1. **수정된 코드**를 서버 `C:\da_pda`에 복사 (최소한 `client\src`, `client\package.json` 등 변경된 부분).
2. **PowerShell 또는 CMD**에서:
   ```bat
   cd C:\da_pda\client
   npm install
   npm run build
   ```
3. **기존 프론트엔드(3000) 종료**  
   (해당 창에서 Ctrl+C 또는 `taskkill`로 3000 포트 프로세스 종료)
4. **프론트엔드 다시 시작:**
   ```bat
   set PORT=3000
   set BACKEND_URL=http://localhost:6000
   npm run start
   ```
5. PDA에서 앱 다시 실행(또는 브라우저 새로고침)하면 로그인 화면에 **화면 종료** 버튼이 보임.

서버에서는 **npx cap sync 는 하지 않습니다.** (서버에는 Android 프로젝트가 없고, 웹만 서빙합니다.)

---

## 포트 없이 접속하기 (80 사용)

`:3000` 없이 `http://pda.dongasteel.co.kr` 또는 `http://pda.dongasteel.co.kr/login` 으로 접속하려면 **리버스 프록시**를 사용합니다. 웹 서버(80 포트)가 요청을 받아 내부의 3000 포트로 넘겨 줍니다.

### Nginx 사용 (권장) — Windows 구체 절차

#### 2-1. 다운로드할 파일 고르기 (nginx.org/download)
- 페이지에 나열된 항목이 **이름 순**이라 위쪽은 옛날 버전(0.1.x, 0.2.x …)입니다. **아래로 스크롤**해서 **1.26 또는 1.29 대**를 찾습니다.
- Windows용은 반드시 `.zip` 만 받습니다.  
  `.tar.gz` 는 리눅스/소스용이므로 Windows에서는 사용하지 않습니다.

| 받을 파일 | 설명 |
|-----------|------|
| **nginx-1.26.2.zip** | Stable(안정) 버전 — 권장 |
| 또는 **nginx-1.29.5.zip** | Mainline(최신 기능) 버전 |

- 다운로드 링크 예:  
  [https://nginx.org/download/nginx-1.26.2.zip](https://nginx.org/download/nginx-1.26.2.zip)  
  (최신 번호는 [nginx.org/download](https://nginx.org/download/) 에서 **nginx-1.26.x.zip** 또는 **nginx-1.29.x.zip** 중 하나 선택)

#### 2-2. 압축 해제 및 폴더 위치

1. 받은 `nginx-1.26.2.zip` (또는 선택한 버전)을 **`C:\da_pda` 안에** 압축 해제합니다.
2. 해제하면 **`nginx-1.26.2`** 폴더 하나가 생깁니다.  
   → 최종 경로: **`C:\da_pda\nginx-1.26.2`** (그 안에 `nginx.exe` 있음)  
   ⚠ **`C:\da_pda\nginx\nginx-1.26.2`** 가 아닙니다. zip을 풀면 `nginx` 한 단계 없이 바로 `nginx-1.26.2` 폴더가 생깁니다.
3. 다른 위치에 두고 싶으면 예: `C:\nginx` 에 풀어서 `C:\nginx\nginx-1.26.2\nginx.exe` 로 두어도 됩니다.

#### 2-3. 설정 파일 경로

- 프로젝트의 설정 파일 경로: **`C:\da_pda\deploy\nginx-pda.conf`**
- 서버의 da_pda 경로가 `C:\da_pda` 가 맞다면 그대로 사용하면 됩니다.

#### 2-4. Nginx 실행

**방법 A — 배치 파일 사용 (권장)**  
- `C:\da_pda\deploy\START-NGINX.bat` 를 더블클릭하거나, CMD/PowerShell에서 실행합니다.  
- nginx가 `C:\da_pda\nginx-1.26.2` 등에 있으면 자동으로 찾아서 실행합니다.

**방법 B — 수동 실행**  
1. **CMD** 또는 **PowerShell**을 엽니다 (필요 시 관리자 권한).
2. **nginx.exe가 있는 폴더로 이동**합니다. (PATH에 없으면 반드시 이 단계 필요)  
   ```powershell
   cd C:\da_pda\nginx-1.26.2
   ```  
   ⚠ `C:\da_pda\nginx\nginx-1.26.2` 가 아니라 **`C:\da_pda\nginx-1.26.2`** 입니다.
3. **같은 폴더에서** 아래처럼 **`.\nginx.exe`** 로 실행합니다. (`nginx` 만 쓰면 "인식되지 않습니다" 오류 남)  
   ```powershell
   .\nginx.exe -c "C:\da_pda\deploy\nginx-pda.conf"
   ```
4. 오류 없이 실행되면 화면에는 아무 메시지도 안 나올 수 있습니다. 정상입니다.
5. 브라우저에서 `http://pda.dongasteel.co.kr` 또는 `http://pda.dongasteel.co.kr/login` 으로 접속해 봅니다.

#### 2-5. Nginx 중지/재시작 (필요할 때)

- **중지:** `C:\da_pda\deploy\STOP-NGINX.bat` 실행  
  또는 `nginx-1.26.2` 폴더에서 `.\nginx.exe -s stop`
- **설정 다시 읽고 재시작:**  
  `.\nginx.exe -s reload` (nginx.exe가 있는 폴더에서 실행)

#### 2-6. 방화벽

- 서버 방화벽에서 **TCP 80** 포트가 허용되어 있어야 외부에서 `http://pda.dongasteel.co.kr` 로 접속할 수 있습니다.

---

### Linux에서 Nginx 사용 시

- `sudo cp C:\da_pda\deploy\nginx-pda.conf /etc/nginx/conf.d/pda.conf` (해당 서버 경로로 조정)
- `sudo nginx -s reload`

---

### 참고
- 앱 코드 수정은 필요 없습니다. 브라우저가 접속한 주소(80이든 3000이든)로 `/api`를 호출하므로 그대로 동작합니다.
- 방화벽에서 **80 포트**가 열려 있어야 합니다.

---

## 문제 해결

### "EADDRINUSE: address already in use 0.0.0.0:5000" (또는 6000)
- **원인:** 해당 포트를 이미 다른 프로세스(이전에 켜 둔 서버 등)가 사용 중임.
- **해결:**
  1. `server` 폴더에서 `KILL-PORT.bat 5000` 또는 `KILL-PORT.bat 6000` 실행 후
  2. 백엔드 다시 시작: `set PORT=6000` 후 `npm run start`
- 수동으로 종료하려면 PowerShell에서:
  ```powershell
  netstat -ano | findstr :6000
  taskkill /PID <표시된PID> /F
  ```

### 조회/저장 시 "Network Error", O_OUT_YN=(미수신)
- **원인:** 백엔드(6000)가 꺼져 있거나, 5000으로만 떠 있어서 프론트(3000)의 /api 프록시가 6000에 연결 실패.
- **해결:**
  1. 백엔드가 **6000** 포트로 떠 있는지 확인 (위 "2. 백엔드" 순서대로 `set PORT=6000` 후 `npm run start`).
  2. EADDRINUSE로 서버가 안 떴다면 위 "EADDRINUSE" 항목대로 포트 정리 후 재시작.

## 로컬과의 차이
| 구분       | 로컬           | 배포 서버 (pda.dongasteel.co.kr 등) |
|------------|----------------|-------------------------------------|
| 프론트     | 3000 (Vite)    | 3000 (start-preview)                |
| 백엔드     | 5000           | **6000**                            |
| 접속 URL   | localhost:3000 | **:3000** 또는 **(Nginx 시)** 포트 없이 `pda.dongasteel.co.kr` |
| API 호출   | Vite가 5000으로 프록시 | 3000 서버가 6000으로 프록시        |
| Oracle DB  | 172.17.1.56    | 172.17.1.56                         |
