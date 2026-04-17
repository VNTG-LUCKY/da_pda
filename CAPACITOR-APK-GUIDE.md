# DA PDA — Capacitor로 APK 만드는 방법 (초보자용)

이 문서는 **서버/앱 경험이 없어도** 따라 할 수 있도록 단계별로 적었습니다.  
DA PDA는 **웹 주소(http://pda.dongasteel.co.kr:3000/login)** 에서 동작하므로, APK는 **그 주소를 열어 주는 앱**입니다.  
즉, APK를 설치하면 휴대폰에서 주소를 입력하지 않고 **앱 아이콘만 눌러서** 같은 화면을 사용할 수 있습니다.

---

## 목차

1. [준비물](#1-준비물)
2. [1단계: Android Studio 설치](#2-1단계-android-studio-설치)
3. [2단계: 프로젝트에 Capacitor 설치](#3-2단계-프로젝트에-capacitor-설치)
4. [3단계: 앱이 열 주소 설정](#4-3단계-앱이-열-주소-설정)
5. [4단계: Android 앱 프로젝트 만들기](#5-4단계-android-앱-프로젝트-만들기)
6. [5단계: Android Studio에서 APK 빌드](#6-5단계-android-studio에서-apk-빌드)
7. [6단계: APK 파일 찾기 및 휴대폰에 설치](#7-6단계-apk-파일-찾기-및-휴대폰에-설치)
8. [문제 해결](#8-문제-해결)

---

## 1. 준비물

| 항목 | 설명 |
|------|------|
| **PC** | Windows 10 이상 (지금 DA PDA 개발하신 PC 그대로 사용 가능) |
| **용량** | 여유 공간 약 **8GB 이상** (Android Studio + SDK) |
| **이미 있는 것** | Node.js (DA PDA 만들 때 설치됨), 프로젝트 폴더 `da_pda` |
| **설치할 것** | Android Studio (아래 2단계에서 설치) |

**추가 계정이나 결제는 필요 없습니다.**  
Android Studio는 무료이고, DA PDA APK는 Play 스토어에 올리지 않고 직접 설치하는 방식입니다.

---

## 2. 1단계: Android Studio 설치

APK는 **Android Studio**라는 프로그램으로 만듭니다.  
한 번만 설치해 두면, 앞으로 APK 다시 만들 때도 그대로 사용합니다.

### 2-1. 다운로드

1. 브라우저에서 **https://developer.android.com/studio** 접속합니다.
2. **「Download Android Studio」** 버튼을 눌러 설치 파일을 받습니다.  
   (파일 이름 예: `android-studio-2024.x.x.x.xx-windows.exe`)
3. 다운로드가 끝날 때까지 기다립니다. (용량이 꽤 큽니다.)

### 2-2. 설치 실행

1. 다운로드한 **.exe** 파일을 더블클릭합니다.
2. **「Next」** 를 눌러 진행합니다.
3. **설치할 항목**은 기본값 그대로 두고 **「Next」** 합니다.
   - **Android Studio**, **Android Virtual Device** 등이 포함된 상태가 기본입니다.
4. **설치 경로**는 바꾸지 않아도 됩니다. (예: `C:\Program Files\Android\Android Studio`)
5. **「Install」** 을 누르고 설치가 끝날 때까지 기다립니다.
6. 끝나면 **「Finish」** 를 누릅니다.  
   (「Start Android Studio」에 체크되어 있으면 프로그램이 바로 실행됩니다.)

### 2-3. 첫 실행 시 설정 (SDK 설치)

1. **Android Studio**가 켜지면 **「Do not import settings」** 를 선택하고 **「OK」** 합니다.
2. **「Next」** → **「Standard」** 선택 → **「Next」** 합니다.
3. **테마**는 편한 대로 선택하고 **「Next」** → **「Finish」** 합니다.
4. **「Downloading Components」** 라고 나오면 **끝날 때까지 기다립니다.**  
   (인터넷 속도에 따라 10~30분 걸릴 수 있습니다. 중간에 끄지 마세요.)
5. 다운로드가 끝나면 **「Finish」** 를 누릅니다.

이제 Android Studio 설치와 Android SDK 설치가 끝난 상태입니다.  
**한 번만 하면 됩니다.** 다음부터는 3단계부터 진행하면 됩니다.

---

## 3. 2단계: 프로젝트에 Capacitor 설치

**Capacitor**는 「우리 웹 주소를 안드로이드 앱으로 열어 주는 도구」입니다.  
DA PDA 프로젝트 **안의 client 폴더**에서 아래 명령을 실행합니다.

> **⚠️ 중요:** 아래에 나오는 명령어를 복사할 때 **\`\`\`(백틱)이나 bat, ''' 같은 표시는 넣지 마세요.**  
> 터미널에는 **회색 박스 안의 한 줄만** 입력합니다. 그리고 **반드시 client 폴더**에서 실행하세요 (`cd client` 먼저).

### 3-1. 명령 프롬프트(터미널) 열기

1. **Cursor**에서 DA PDA 프로젝트를 연 상태에서:
   - 상단 메뉴 **Terminal → New Terminal** 을 누르거나,
   - 단축키 **Ctrl + `** (백틱) 로 터미널을 엽니다.
2. 터미널 아래쪽에 경로가 보입니다.  
   `client` 폴더에서 작업해야 하므로, 먼저 client로 이동합니다.

   **아래 한 줄만** 입력한 뒤 **Enter** (``` 또는 bat 같은 건 입력하지 마세요):

   ```
   cd client
   ```

### 3-2. Capacitor 패키지 설치

아래 명령을 **한 줄씩** 입력하고, 각각 **Enter** 로 실행합니다.  
**⚠️ 복사할 때:** `bat` 이나 ```(백틱) 같은 **코드 블록 표시는 복사하지 마세요.**  
**실제로 입력하는 것은 아래 회색 칸 안의 한 줄뿐입니다.**

```
npm install @capacitor/core @capacitor/cli @capacitor/android
```

- 처음 실행 시 인터넷에서 패키지를 받으므로 1~2분 걸릴 수 있습니다.
- 끝나면 에러 메시지 없이 다음 줄로 넘어갑니다.

### 3-3. Capacitor 초기화

같은 터미널에서 (여전히 `client` 폴더인지 확인).  
**한 줄만** 복사해서 입력 (코드 블록 표시 제외):

```
npx cap init "DA PDA" com.dongasteel.dapda --web-dir dist
```

- **「DA PDA」** = 앱 이름 (휴대폰에 보이는 이름)
- **com.dongasteel.dapda** = 앱의 고유 ID (보통 회사/서비스 이름으로 씀)
- **--web-dir dist** = 웹 빌드 결과물이 들어 있는 폴더 (Vite 기본값)

실행 후 `client` 폴더 안에 **capacitor.config.ts** 파일이 생깁니다.

---

## 4. 3단계: 앱이 열 주소 설정

설치한 APK가 **어떤 웹 주소를 열지** 설정합니다.  
지금은 **http://pda.dongasteel.co.kr:3000** 로 열리게 할 예정입니다.

### 4-1. 설정 파일 열기

1. Cursor 왼쪽 **파일 탐색기**에서  
   **client** → **capacitor.config.ts** 를 엽니다.
2. 안에 `appId`, `appName`, `webDir` 등이 보입니다.

### 4-2. 서버 주소 추가

**capacitor.config.ts** 안에서, `webDir` 다음 줄에 아래 **server** 부분을 넣습니다.  
(이미 `server`가 있다면 그 안의 `url`만 아래처럼 바꿉니다.)

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dongasteel.dapda',
  appName: 'DA PDA',
  webDir: 'dist',
  server: {
    url: 'http://pda.dongasteel.co.kr:3000',
    cleartext: true
  }
};

export default config;
```

- **url** = 앱이 실행될 때 여는 주소입니다.  
  로그인 화면이 `/login` 이면 브라우저에서는 `http://pda.dongasteel.co.kr:3000/login` 이고,  
  앱은 `http://pda.dongasteel.co.kr:3000` 만 써도 됩니다 (앱 안에서 로그인 페이지로 이동 가능).
- **cleartext: true** = http 주소를 허용한다는 뜻입니다. (https가 아니어도 됨)

파일을 **저장**합니다 (Ctrl + S).

---

## 5. 4단계: Android 앱 프로젝트 만들기

이제 「웹을 감싼 Android 프로젝트」를 만듭니다.  
**같은 터미널**에서, **client** 폴더인 상태로 아래를 실행합니다.

### 5-1. 웹 빌드 (한 번 필요)

**한 줄만** 입력 (코드 블록 표시는 빼고):

```
npm run build
```

- 오류 없이 끝나면 `client` 안에 **dist** 폴더가 생깁니다.  
  앱이 **실제로는 서버 주소를 여는 방식**이라도, Capacitor가 Android 프로젝트를 만들 때 이 폴더를 기준으로 합니다.

### 5-2. Android 플랫폼 추가

```
npx cap add android
```

- 실행 후 `client` 안에 **android** 폴더가 생깁니다.  
  이게 Android Studio에서 열 「Android 앱 프로젝트」입니다.

### 5-3. 동기화

```
npx cap sync android
```

- 웹 설정과 서버 주소 등이 Android 쪽에 반영됩니다.  
  이 명령은 **설정을 바꾼 뒤마다** 한 번씩 실행하는 것이 좋습니다.

여기까지 하면 **APK를 만들 준비**가 끝난 상태입니다.

### 런처 아이콘(홈 화면 단축아이콘)

APK 설치 시 보이는 **앱 아이콘**은 아래를 수정합니다.

| 바꿀 내용 | 파일 |
|-----------|------|
| **PDA 모양·스캔선 등 (Android 8+)** | `client/android/app/src/main/res/drawable/ic_launcher_foreground.xml` |
| **아이콘 배경색** | `client/android/app/src/main/res/values/ic_launcher_background.xml` |
| **구형 기기용 PNG** | `client`에서 `npm run android:icons` 실행 → `mipmap-mdpi` ~ `mipmap-xxxhdpi`의 `ic_launcher.png`, `ic_launcher_round.png` 자동 생성 |

**상세·전체 빌드 순서**는 **`client/android/ANDROID-LAUNCHER-ICONS.md`** 를 보세요.  
요약 순서: `client`에서 **`npm run android:icons`** (PNG 필요 시) → **`npm run build`** → **`npx cap sync android`** → Android Studio에서 APK 빌드.

---

## 6. 5단계: Android Studio에서 APK 빌드

실제 **APK 파일**은 **Android Studio**에서 만듭니다.

### 6-1. Android Studio로 프로젝트 열기

**방법 A — 터미널에서 열기 (권장)**  
`client` 폴더에서 아래 한 줄만 입력:

```
npx cap open android
```

- Android Studio가 실행되면서 **client/android** 프로젝트가 열립니다.

**방법 B — Android Studio에서 직접 열기**  
1. Android Studio를 실행합니다.  
2. **「Open」** 을 누릅니다.  
3. 폴더를 다음처럼 찾아 선택합니다:  
   `C:\Users\HDPARK\Desktop\da_pda\client\android`  
   (본인 PC의 da_pda 위치에 맞게 **client\android** 로 가면 됩니다.)  
4. **「OK」** 를 누릅니다.

### 6-2. 첫 열 때 나오는 동기화

- **「Sync Now」** 또는 **「Sync Project with Gradle Files」** 가 나오면 눌러서 동기화가 끝날 때까지 기다립니다.  
- 아래쪽 진행 표시가 사라지면 준비 완료입니다.

### 6-3. APK 빌드하기

1. 상단 메뉴에서 **「Build」** 를 클릭합니다.
2. 다음 중 보이는 메뉴를 선택합니다.  
   - **「Generate App Bundles or APKs」** (최신 Android Studio)  
   - 또는 **「Build Bundle(s) / APK(s)」** (구버전)  
   마우스를 올리면 옆에 서브메뉴(▶)가 열립니다.
3. 서브메뉴에서 **「Build APK(s)」** 를 클릭합니다.
4. 빌드가 끝날 때까지 기다립니다.  
   (처음에는 2~5분 걸릴 수 있습니다.)  
   완료되면 오른쪽 아래에 **「APK(s) generated successfully」** 같은 메시지가 뜹니다.
5. 메시지 안의 **「locate」** 를 누르면 APK가 들어 있는 폴더가 열립니다.

**APK 파일 위치 (직접 찾을 때):**

- 경로 예:  
  `client\android\app\build\outputs\apk\debug\app-debug.apk`  
- 즉, **da_pda → client → android → app → build → outputs → apk → debug** 안에 **app-debug.apk** 가 있습니다.

이 **app-debug.apk** 가 「DA PDA」 앱 파일입니다.

---

## 7. 6단계: APK 파일 찾기 및 휴대폰에 설치

### 7-1. APK 파일 복사 (방법 선택)

**방법 A — 웹 주소로 다운로드 (권장)**

서버에 APK를 올려 두면, 휴대폰 브라우저에서 **주소만 입력**해 받을 수 있습니다.

1. 빌드된 **app-debug.apk** 를 **client/apk** 폴더로 복사한 뒤, 파일 이름을 **da-pda.apk** 로 바꿉니다.  
   - 경로: `client\apk\da-pda.apk`
2. 프론트엔드 서버(3000)를 실행한 상태에서 아래 주소로 접속하면 APK가 다운로드됩니다.
   - **포트 사용:** `http://pda.dongasteel.co.kr:3000/download`
   - **포트 없이 (Nginx 사용 시):** `http://pda.dongasteel.co.kr/download`
3. 휴대폰 브라우저에 위 주소 중 하나를 입력해 APK를 받은 뒤, 아래 7-2대로 설치합니다.

**방법 B — 직접 복사**

- **app-debug.apk** 를 USB로 휴대폰에 복사하거나,
- 카카오톡/이메일 등으로 본인에게 보내서 휴대폰에서 받습니다.

### 7-2. 휴대폰에서 설치

1. 휴대폰에서 **app-debug.apk** 파일을 탭해서 설치를 시작합니다.
2. **「알 수 없는 앱 설치」** 또는 **「이 출처 허용」** 안내가 나오면:
   - **설정**으로 들어가서 **해당 출처(파일/브라우저 등)** 를 허용한 뒤 다시 설치합니다.
3. 설치가 끝나면 **「DA PDA」** 앱 아이콘이 생깁니다.
4. 아이콘을 누르면 **http://pda.dongasteel.co.kr:3000** 이 열리고,  
   서버가 켜져 있고 휴대폰이 인터넷에 연결되어 있으면 로그인 화면이 보입니다.

**참고:**  
- APK는 **서버 주소만 열어 주는 앱**이므로,  
  서버(pda.dongasteel.co.kr:3000)가 실제로 동작 중이어야 로그인·사용이 가능합니다.  
- 화면 수정·기능 수정은 **서버(웹)만 배포**하면 되고,  
  APK를 다시 만들 필요는 **앱 이름/아이콘/열 주소를 바꿀 때**만 있습니다.

---

## 8. 문제 해결

### 「npm을 찾을 수 없습니다」

- Node.js가 설치되어 있는지 확인합니다.  
  DA PDA를 만들 때 사용한 PC라면 보통 설치되어 있습니다.  
  터미널에서 `node -v` 를 입력해 보면 버전이 나옵니다.  
  나오지 않으면 https://nodejs.org 에서 LTS 버전을 설치합니다.

### 「cap은 인식되지 않습니다」 / 「npx cap: command not found」

- **반드시 client 폴더**에서 명령을 실행해야 합니다:  
  `cd client` 후 `npx cap init ...`, `npx cap add android` 등을 다시 실행합니다.  
- `npm install @capacitor/core @capacitor/cli @capacitor/android` 를 한 번 더 실행한 뒤 다시 시도합니다.

### Android Studio에서 「SDK not found」 / 빌드 실패

- Android Studio를 연 뒤 **「File → Settings」** (Mac은 **Android Studio → Preferences**)  
  → **「Appearance & Behavior → System Settings → Android SDK」** 에서  
  **Android SDK Location** 이 잡혀 있는지 확인합니다.  
  첫 설치 시 2-3단계를 끝까지 진행했다면 보통 자동으로 설정되어 있습니다.  
- **「SDK Tools」** 탭에서 **Android SDK Build-Tools**, **Android SDK Platform-Tools** 가 설치되어 있는지 확인합니다.

### 앱을 눌렀는데 흰 화면만 나와요

- **server.url** 이 **http://pda.dongasteel.co.kr:3000** 로 되어 있는지 **capacitor.config.ts** 를 다시 확인합니다.  
- 휴대폰이 **인터넷(Wi‑Fi/데이터)** 에 연결되어 있는지 확인합니다.  
- PC 브라우저에서 **http://pda.dongasteel.co.kr:3000/login** 이 정상적으로 열리는지 확인합니다.  
  (서버가 꺼져 있으면 앱에서도 열리지 않습니다.)

### 나중에 주소를 바꾸고 싶어요 (예: 포트 없이 쓰기)

1. **client/capacitor.config.ts** 에서 **server.url** 만 바꿉니다.  
   예: `url: 'http://pda.dongasteel.co.kr'`
2. 터미널에서 **client** 폴더로 이동한 뒤:  
   `npx cap sync android`
3. Android Studio에서 다시 **Build → Build Bundle(s) / APK(s) → Build APK(s)** 로 새 APK를 만듭니다.  
   새 APK를 휴대폰에 설치하면 바뀐 주소로 열립니다.

---

## 요약 체크리스트

- [ ] Android Studio 설치 및 SDK 다운로드 완료  
- [ ] `client` 폴더에서 `npm install @capacitor/core @capacitor/cli @capacitor/android`  
- [ ] `npx cap init "DA PDA" com.dongasteel.dapda --web-dir dist`  
- [ ] **capacitor.config.ts** 에 `server.url: 'http://pda.dongasteel.co.kr:3000'`, `cleartext: true` 추가  
- [ ] `npm run build` → `npx cap add android` → `npx cap sync android`  
- [ ] `npx cap open android` 로 Android Studio에서 **Build → Build APK(s)**  
- [ ] **app-debug.apk** 를 휴대폰으로 복사 후 설치 (또는 **client/apk/da-pda.apk** 로 복사 후 `.../download` 에서 다운로드)

이 순서대로 하시면, **주소 입력 없이 앱 아이콘만 눌러서** DA PDA를 사용할 수 있습니다.  
**APK 다운로드 주소:** 서버(3000) 실행 시 `http://pda.dongasteel.co.kr:3000/download` 또는 `http://pda.dongasteel.co.kr/download` (Nginx 사용 시). APK 파일은 **client/apk/da-pda.apk** 에 두면 됩니다.  
서버 접속 주소는 [DEPLOY.md](./DEPLOY.md)의 **공식 접속 주소**를 따릅니다.
