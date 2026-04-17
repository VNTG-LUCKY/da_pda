# Android 런처 아이콘(PDA) — 파일 위치와 빌드 순서

## 전체 APK 빌드 권장 순서 (아이콘 포함)

| 순서 | 작업 위치 | 명령 / 작업 |
|------|-----------|-------------|
| 1 | `client` | 아이콘(레거시 PNG) 갱신: `npm run android:icons` 또는 `node android\scripts\generate-mipmap-pngs.mjs` |
| 2 | `client` | 웹 리소스 빌드: `npm run build` |
| 3 | `client` | Capacitor 동기화: `npx cap sync android` |
| 4 | Android Studio (`client/android` 열림) | **Build → Build APK(s)** (또는 사용 중인 Release 절차) |
| 5 | PDA/휴대폰 | 새 APK 설치 (아이콘이 캐시되면 앱 삭제 후 재설치 권장) |

**Android 8+ 홈 화면 아이콘**은 적응형 아이콘으로, 배경색 + `drawable/ic_launcher_foreground.xml`(PDA 벡터)이 적용됩니다. **구형 기기**는 1단계에서 만든 `mipmap-*`의 `ic_launcher.png` / `ic_launcher_round.png`가 사용됩니다.

---

## 무엇이 바뀌었나요?

| 구분 | 경로 |
|------|------|
| **적응형 아이콘 (Android 8+)** | `app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`, `ic_launcher_round.xml` |
| **전경 벡터 (PDA 실루엣)** | `app/src/main/res/drawable/ic_launcher_foreground.xml` |
| **배경색** | `app/src/main/res/values/ic_launcher_background.xml` (`#1E4A6E` 스틸 블루) |
| **레거시 런처 (API 25 이하)** | `app/src/main/res/mipmap-mdpi` … `mipmap-xxxhdpi` 의 `ic_launcher.png`, `ic_launcher_round.png` |

레거시 PNG는 **스크립트로 생성**합니다. 저장소에 PNG가 없을 경우 아래 **한 번** 실행하세요.

**참고:** `mipmap-*`에 `ic_launcher.png`와 **같은 이름의** `ic_launcher.webp`가 같이 있으면 Android Studio 빌드 시 `Duplicate resources` 오류가 납니다. `npm run android:icons` 실행 시 스크립트가 `ic_launcher.webp` / `ic_launcher_round.webp`를 먼저 제거합니다.

---

## 1) mipmap PNG 생성 (필수)

**작업 폴더: `client`**

```bat
cd client
node android\scripts\generate-mipmap-pngs.mjs
```

또는:

```bat
npm run android:icons
```

(위 `npm run`은 같은 스크립트를 호출합니다. `node`만 있으면 됩니다.)

---

## 2) 웹 빌드 → Capacitor 동기화

```bat
cd client
npm run build
npx cap sync android
```

---

## 3) APK 빌드 (Android Studio)

1. Android Studio에서 **`client/android`** 폴더를 엽니다.
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)** (또는 기존에 쓰시던 Release APK 절차).
3. 생성된 APK를 PDA/휴대폰에 설치합니다.

**기기에서 아이콘이 예전 그대로면:** 앱 삭제 후 재설치하거나, 기기 재부팅 후 확인해 보세요.

---

## 아이콘만 다시 바꿀 때

1. **색만 바꾸기:** `values/ic_launcher_background.xml` 의 색상 수정.
2. **PDA 모양(벡터) 바꾸기:** `drawable/ic_launcher_foreground.xml` 수정.
3. **레거시 PNG도 같이 맞추기:** `android/scripts/generate-mipmap-pngs.mjs` 안의 좌표/색상을 벡터와 맞춘 뒤, 위 1) 단계 다시 실행.

---

## 참고

- `AndroidManifest.xml` 의 `android:icon` / `android:roundIcon` 은 `@mipmap/ic_launcher` 를 가리킵니다. 파일명을 바꾸지 마세요.
- Play 스토어 배포 없이 사내 APK만 쓰는 경우에도 위 절차는 동일합니다.
