import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "동아스틸 IT팀";
pptx.company = "동아스틸";
pptx.subject = "DA PDA 시스템 사용자 매뉴얼";
pptx.title = "동아스틸 PDA 시스템 사용자 매뉴얼";

const C = {
  primary: "1B3A5C",
  secondary: "2E86AB",
  accent: "F18F01",
  dark: "1A1A2E",
  light: "F5F5F5",
  white: "FFFFFF",
  gray: "666666",
  lightGray: "E8E8E8",
  green: "2D936C",
  red: "E63946",
  blue: "457B9D",
  darkBlue: "0D1B2A",
  orange: "F59E0B",
  cardGreen: "22C55E",
  cardBlue: "3B82F6",
  purple: "7C3AED",
  warn: "F97316",
  tipBg: "FFFBEB",
  warnBg: "FEF2F2",
  infoBg: "EFF6FF",
  stepBg: "F0FDF4",
};

const TOTAL = 19;

function footer(s) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.15, w: 13.33, h: 0.35, fill: { color: C.primary } });
  s.addText("동아스틸 PDA 시스템 사용자 매뉴얼", {
    x: 0.5, y: 7.15, w: 10, h: 0.35, fontSize: 8, color: C.white, fontFace: "맑은 고딕",
  });
}
function pageNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7.0, w: 1.5, h: 0.3, fontSize: 9, color: C.gray, align: "right" });
}
function hdr(s, title, sub) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 1.1, fill: { color: C.primary } });
  s.addText(title, { x: 0.6, y: 0.15, w: 10, h: 0.55, fontSize: 24, color: C.white, bold: true, fontFace: "맑은 고딕" });
  if (sub) s.addText(sub, { x: 0.6, y: 0.65, w: 10, h: 0.35, fontSize: 12, color: "A8D0E6", fontFace: "맑은 고딕" });
}

function tipBox(s, x, y, w, h, text, type = "tip") {
  const bg = type === "warn" ? C.warnBg : type === "info" ? C.infoBg : C.tipBg;
  const border = type === "warn" ? C.red : type === "info" ? C.cardBlue : C.orange;
  const icon = type === "warn" ? "⚠️" : type === "info" ? "ℹ️" : "💡";
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: bg }, rectRadius: 0.08, line: { color: border, width: 1 } });
  s.addText(`${icon}  ${text}`, { x: x + 0.15, y, w: w - 0.3, h, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.3 });
}

function stepBadge(s, x, y, num, color) {
  s.addShape(pptx.shapes.OVAL, { x, y, w: 0.45, h: 0.45, fill: { color: color || C.secondary } });
  s.addText(String(num), { x, y, w: 0.45, h: 0.45, fontSize: 14, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
}

// ============================================================
// 1. 표지
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.darkBlue };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.accent } });
  s.addText("동아스틸", { x: 0.8, y: 1.2, w: 6, h: 0.5, fontSize: 18, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText("PDA 시스템\n사용자 매뉴얼", {
    x: 0.8, y: 1.9, w: 8, h: 2.0, fontSize: 40, color: C.white, bold: true, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3,
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.1, w: 3.5, h: 0.04, fill: { color: C.accent } });
  s.addText("현장 실무자를 위한 단계별 사용 안내서", {
    x: 0.8, y: 4.4, w: 7, h: 0.5, fontSize: 16, color: "A8D0E6", fontFace: "맑은 고딕",
  });
  s.addText("접속 주소:  http://pda.dongasteel.co.kr", {
    x: 0.8, y: 5.2, w: 7, h: 0.4, fontSize: 14, color: C.orange, bold: true, fontFace: "맑은 고딕",
  });
  s.addText("2025. 03  |  동아스틸 IT팀", { x: 0.8, y: 6.2, w: 5, h: 0.4, fontSize: 13, color: C.gray, fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.5, w: 4.0, h: 4.5, fill: { color: C.primary }, rectRadius: 0.15 });
  s.addText("📖", { x: 9.5, y: 2.2, w: 2, h: 1.8, fontSize: 70, align: "center" });
  s.addText("User Manual", { x: 8.8, y: 4.2, w: 3.5, h: 0.5, fontSize: 16, color: "A8D0E6", align: "center", fontFace: "맑은 고딕" });
}

// ============================================================
// 2. 목차
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "목 차", "Contents");
  footer(s); pageNum(s, 2);

  const items = [
    { n: "01", t: "앱 접속 및 설치", d: "웹 주소 접속, APK 설치, 홈화면 바로가기" },
    { n: "02", t: "로그인 / 로그아웃 / 종료", d: "로그인 방법, 종료 및 다시 시작" },
    { n: "03", t: "메인 화면", d: "메뉴 카드, 순서 변경, 옵션 설정" },
    { n: "04", t: "적재위치관리", d: "적재대 선택, 바코드 스캔, 저장" },
    { n: "05", t: "스켈프 투입", d: "공정/작업장 선택, 조회, 바코드 스캔" },
    { n: "06", t: "상차등록", d: "지시번호 조회, 피킹 스캔, 임시/최종 저장" },
    { n: "07", t: "기능 화면 공통 옵션", d: "다크모드, 효과음, 진동, 전달용, 이메일" },
    { n: "08", t: "바코드 스캔 방법", d: "스캐너 사용법, 키보드 전환, 바코드 형식" },
    { n: "09", t: "스캔 이력 / 저장 이력", d: "대시보드, 필터, 통계" },
    { n: "10", t: "문제 해결 (FAQ)", d: "자주 묻는 질문, 오류 대처법" },
    { n: "11", t: "연락처 / 지원", d: "IT팀 연락처, 긴급 대응" },
  ];
  items.forEach((it, i) => {
    const y = 1.4 + i * 0.5;
    s.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y, w: 0.6, h: 0.4, fill: { color: C.primary }, rectRadius: 0.06 });
    s.addText(it.n, { x: 1.5, y, w: 0.6, h: 0.4, fontSize: 12, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(it.t, { x: 2.4, y, w: 3.5, h: 0.4, fontSize: 14, color: C.dark, bold: true, fontFace: "맑은 고딕" });
    s.addText(it.d, { x: 6.0, y, w: 6, h: 0.4, fontSize: 11, color: C.gray, fontFace: "맑은 고딕" });
    if (i < items.length - 1) s.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y: y + 0.44, w: 9.5, h: 0.01, fill: { color: C.lightGray } });
  });
}

// ============================================================
// 3. 앱 접속 및 설치
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "01. 앱 접속 및 설치 방법", "How to Access & Install");
  footer(s); pageNum(s, 3);

  // 방법 1: 웹 브라우저
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.4, w: 4.0, h: 4.0, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1.5 } });
  stepBadge(s, 0.5, 1.5, 1, C.cardBlue);
  s.addText("웹 브라우저 접속", { x: 1.1, y: 1.5, w: 3, h: 0.45, fontSize: 15, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① PDA 또는 스마트폰의 Chrome 브라우저 실행\n\n" +
    "② 주소창에 아래 주소를 입력\n\n" +
    "③ 로그인 화면이 나타나면 성공!",
    { x: 0.6, y: 2.1, w: 3.4, h: 1.8, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 }
  );
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.0, w: 3.4, h: 0.5, fill: { color: C.cardBlue }, rectRadius: 0.08 });
  s.addText("http://pda.dongasteel.co.kr", { x: 0.6, y: 4.0, w: 3.4, h: 0.5, fontSize: 12, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  tipBox(s, 0.5, 4.7, 3.5, 0.55, "가장 간편한 방법! 별도 설치 없이 바로 사용");

  // 방법 2: APK
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.6, y: 1.4, w: 4.0, h: 4.0, fill: { color: C.stepBg }, rectRadius: 0.15, line: { color: C.cardGreen, width: 1.5 } });
  stepBadge(s, 4.8, 1.5, 2, C.cardGreen);
  s.addText("APK 앱 설치 (안드로이드)", { x: 5.2, y: 1.5, w: 3.2, h: 0.45, fontSize: 14, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① IT팀에서 전달받은 APK 파일 다운로드\n\n" +
    "② '출처를 알 수 없는 앱 설치 허용'\n    (설정 → 보안에서 활성화)\n\n" +
    "③ APK 파일 실행하여 설치\n\n" +
    "④ 앱 아이콘 터치하여 실행",
    { x: 4.9, y: 2.1, w: 3.4, h: 2.6, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 }
  );
  tipBox(s, 4.8, 4.7, 3.5, 0.55, "앱처럼 사용 가능! 홈 화면에 아이콘 자동 생성");

  // 방법 3: 홈화면 추가
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.9, y: 1.4, w: 4.1, h: 4.0, fill: { color: C.tipBg }, rectRadius: 0.15, line: { color: C.orange, width: 1.5 } });
  stepBadge(s, 9.1, 1.5, 3, C.orange);
  s.addText("홈 화면에 바로가기 추가", { x: 9.5, y: 1.5, w: 3.2, h: 0.45, fontSize: 14, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① Chrome으로 PDA 주소 접속\n\n" +
    "② 우측 상단 ⋮ (점 3개) 메뉴 터치\n\n" +
    "③ '홈 화면에 추가' 선택\n\n" +
    "④ 이름 확인 후 '추가' 터치\n\n" +
    "⑤ 홈 화면 아이콘으로 바로 접속",
    { x: 9.2, y: 2.1, w: 3.5, h: 2.6, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 }
  );
  tipBox(s, 9.1, 4.7, 3.6, 0.55, "APK 없이도 앱처럼 사용 가능!");

  tipBox(s, 0.3, 5.9, 12.7, 0.55, "LTE 통신이 가능한 환경이면 어디서나 접속할 수 있습니다. Wi-Fi 연결은 필요하지 않습니다.", "info");

  // 주의
  tipBox(s, 0.3, 6.5, 12.7, 0.45, "주의: 반드시 Chrome 브라우저를 사용해 주세요. 삼성 인터넷, 네이버앱 등에서는 일부 기능이 제한될 수 있습니다.", "warn");
}

// ============================================================
// 4. 로그인 / 로그아웃 / 종료
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "02. 로그인 / 로그아웃 / 종료", "Login / Logout / Exit");
  footer(s); pageNum(s, 4);

  // 로그인
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.4, w: 4.2, h: 5.4, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1.5 } });
  s.addText("🔐  로그인 방법", { x: 0.6, y: 1.5, w: 3.5, h: 0.45, fontSize: 15, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });

  const loginSteps = [
    "앱 또는 브라우저로 PDA 접속",
    "아이디 입력란에 아이디 입력",
    "비밀번호 입력란에 비밀번호 입력",
    "[로그인] 버튼 터치",
    "메인 화면으로 이동하면 성공!",
  ];
  loginSteps.forEach((st, i) => {
    stepBadge(s, 0.6, 2.15 + i * 0.65, i + 1, C.cardBlue);
    s.addText(st, { x: 1.15, y: 2.15 + i * 0.65, w: 3.1, h: 0.45, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", valign: "middle" });
  });

  tipBox(s, 0.5, 5.5, 3.8, 0.5, "마지막 로그인 아이디가 자동 기억됩니다.");
  tipBox(s, 0.5, 6.1, 3.8, 0.5, "아이디/비밀번호 오류 시 빨간색 메시지가 표시됩니다.", "warn");

  // 로그아웃
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.7, y: 1.4, w: 4.0, h: 2.6, fill: { color: C.stepBg }, rectRadius: 0.15, line: { color: C.cardGreen, width: 1.5 } });
  s.addText("🚪  로그아웃", { x: 5.0, y: 1.5, w: 3.4, h: 0.45, fontSize: 15, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "메인 화면 좌측 상단의\n[로그아웃] 버튼을 터치하면\n로그인 화면으로 돌아갑니다.\n\n※ 설정값(다크모드, 글꼴 등)은\n   그대로 유지됩니다.",
    { x: 5.0, y: 2.05, w: 3.4, h: 1.8, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  // 종료
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.7, y: 4.2, w: 4.0, h: 2.6, fill: { color: C.warnBg }, rectRadius: 0.15, line: { color: C.red, width: 1.5 } });
  s.addText("⛔  프로그램 종료", { x: 5.0, y: 4.3, w: 3.4, h: 0.45, fontSize: 15, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "로그인 화면 하단의\n[프로그램 종료] 버튼을 터치하면:\n\n" +
    "• 캐시(임시 데이터)가 삭제됩니다\n" +
    "• \"프로그램이 종료되었습니다\" 표시\n" +
    "• [다시 시작] 버튼으로 재접속 가능",
    { x: 5.0, y: 4.85, w: 3.4, h: 1.8, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );

  // 모의 화면
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.0, y: 1.4, w: 4.0, h: 5.4, fill: { color: C.light }, rectRadius: 0.15, line: { color: C.lightGray, width: 1 } });
  s.addText("화면 미리보기", { x: 9.0, y: 1.45, w: 4.0, h: 0.4, fontSize: 12, color: C.gray, align: "center", fontFace: "맑은 고딕" });

  // 모의 로그인 UI
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.5, y: 2.0, w: 3.0, h: 4.0, fill: { color: C.white }, rectRadius: 0.15, shadow: { type: "outer", blur: 5, offset: 2, color: "CCCCCC" } });
  s.addText("동아스틸", { x: 9.5, y: 2.2, w: 3.0, h: 0.35, fontSize: 14, color: C.primary, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addText("PDA", { x: 9.5, y: 2.5, w: 3.0, h: 0.3, fontSize: 18, color: C.primary, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addText("물류 관리 시스템", { x: 9.5, y: 2.8, w: 3.0, h: 0.25, fontSize: 9, color: C.gray, align: "center", fontFace: "맑은 고딕" });
  // ID input
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 10.0, y: 3.2, w: 2.0, h: 0.35, fill: { color: C.light }, rectRadius: 0.05, line: { color: C.lightGray, width: 0.5 } });
  s.addText("아이디", { x: 10.1, y: 3.2, w: 1.8, h: 0.35, fontSize: 9, color: "AAAAAA", fontFace: "맑은 고딕" });
  // PW input
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 10.0, y: 3.7, w: 2.0, h: 0.35, fill: { color: C.light }, rectRadius: 0.05, line: { color: C.lightGray, width: 0.5 } });
  s.addText("비밀번호", { x: 10.1, y: 3.7, w: 1.8, h: 0.35, fontSize: 9, color: "AAAAAA", fontFace: "맑은 고딕" });
  // Login btn
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 10.0, y: 4.2, w: 2.0, h: 0.35, fill: { color: C.primary }, rectRadius: 0.05 });
  s.addText("로그인", { x: 10.0, y: 4.2, w: 2.0, h: 0.35, fontSize: 10, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  // Exit btn
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 10.0, y: 4.7, w: 2.0, h: 0.35, fill: { color: C.red }, rectRadius: 0.05 });
  s.addText("프로그램 종료", { x: 10.0, y: 4.7, w: 2.0, h: 0.35, fontSize: 10, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

  s.addText("← [로그인] 터치", { x: 11.1, y: 4.2, w: 1.8, h: 0.35, fontSize: 8, color: C.cardBlue, fontFace: "맑은 고딕" });
  s.addText("← [프로그램 종료]", { x: 11.1, y: 4.7, w: 1.8, h: 0.35, fontSize: 8, color: C.red, fontFace: "맑은 고딕" });
}

// ============================================================
// 5. 메인 화면 안내
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "03. 메인 화면 안내", "Main Screen Guide");
  footer(s); pageNum(s, 5);

  // 왼쪽: 모의 메인 UI
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.4, w: 5.5, h: 5.5, fill: { color: C.light }, rectRadius: 0.15, line: { color: C.lightGray, width: 1 } });

  // 헤더바
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 5.0, h: 0.6, fill: { color: C.primary }, rectRadius: 0.08 });
  s.addText("로그아웃", { x: 0.8, y: 1.75, w: 1.0, h: 0.5, fontSize: 9, color: C.white, fontFace: "맑은 고딕", valign: "middle" });
  s.addText("동아스틸 PDA", { x: 2.2, y: 1.73, w: 2.0, h: 0.3, fontSize: 11, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addText("물류 관리 시스템", { x: 2.2, y: 2.0, w: 2.0, h: 0.2, fontSize: 7, color: "A8D0E6", align: "center", fontFace: "맑은 고딕" });
  s.addText("☰", { x: 4.7, y: 1.75, w: 0.7, h: 0.5, fontSize: 16, color: C.white, align: "center", valign: "middle" });

  // 화살표 설명
  s.addText("←  로그아웃 버튼", { x: 0.6, y: 2.45, w: 2.5, h: 0.3, fontSize: 9, color: C.cardBlue, fontFace: "맑은 고딕" });
  s.addText("옵션 메뉴  →", { x: 3.6, y: 2.45, w: 2.0, h: 0.3, fontSize: 9, color: C.cardBlue, align: "right", fontFace: "맑은 고딕" });

  // 카드들
  const cards = [
    { name: "📦  적재위치관리", sub: "적재위치 관리", color: C.orange, bg: "FFF8E1" },
    { name: "🔧  스켈프 투입", sub: "스켈프 투입 처리", color: C.cardGreen, bg: "F0FDF4" },
    { name: "🚛  상차등록", sub: "상차 등록 처리", color: C.cardBlue, bg: "EFF6FF" },
  ];
  cards.forEach((c, i) => {
    const y = 3.0 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.9, y, w: 4.4, h: 0.75, fill: { color: c.bg }, rectRadius: 0.1, line: { color: c.color, width: 1.5 } });
    s.addText(c.name, { x: 1.1, y, w: 3.0, h: 0.45, fontSize: 13, color: c.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(c.sub, { x: 1.1, y: y + 0.4, w: 3.0, h: 0.3, fontSize: 8, color: C.gray, fontFace: "맑은 고딕" });
    s.addText("⋮⋮", { x: 4.5, y, w: 0.6, h: 0.75, fontSize: 14, color: C.gray, align: "center", valign: "middle" });
  });

  s.addText("↑ 카드 터치 → 해당 기능 화면 이동", { x: 0.6, y: 5.9, w: 5.0, h: 0.3, fontSize: 10, color: C.primary, bold: true, fontFace: "맑은 고딕", align: "center" });
  tipBox(s, 0.5, 6.3, 5.0, 0.5, "⋮⋮ 드래그 핸들을 길게 터치 후 위/아래로 이동하면 카드 순서를 변경할 수 있습니다.");

  // 오른쪽: 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.1, y: 1.4, w: 6.9, h: 5.5, fill: { color: C.white }, rectRadius: 0.15, line: { color: C.secondary, width: 1.5 } });
  s.addText("메인 화면 구성 요소", { x: 6.4, y: 1.5, w: 6, h: 0.45, fontSize: 16, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const elems = [
    { name: "헤더 영역", desc: "좌측: [로그아웃] 버튼 — 터치 시 로그인 화면으로 이동\n중앙: 시스템 명칭 (동아스틸 PDA)\n우측: [☰] 옵션 메뉴 버튼", color: C.primary },
    { name: "메뉴 카드 (3개)", desc: "적재위치관리 (주황) — 적재대에 코일/자재 위치 등록\n스켈프 투입 (초록) — 스켈프 공정 투입 실적 등록\n상차등록 (파랑) — 상차지시 기반 피킹 확인 및 등록", color: C.secondary },
    { name: "드래그 핸들 (⋮⋮)", desc: "카드 우측의 점 6개 아이콘을 길게 터치 → 위/아래 드래그\n자주 쓰는 기능을 맨 위로 배치 가능 (순서 자동 저장)", color: C.accent },
    { name: "옵션 메뉴 (☰)", desc: "다크 모드, 화면 꺼짐 방지, 글꼴 크기 조절\n서버 상태 확인, 입력 딜레이, 스캔/저장 이력 조회", color: C.purple },
  ];
  elems.forEach((e, i) => {
    const y = 2.15 + i * 1.25;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.3, y, w: 0.12, h: 1.05, fill: { color: e.color }, rectRadius: 0.03 });
    s.addText(e.name, { x: 6.6, y, w: 3.0, h: 0.35, fontSize: 12, color: e.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(e.desc, { x: 6.6, y: y + 0.35, w: 6.1, h: 0.7, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 });
  });
}

// ============================================================
// 6. 메인 화면 옵션 메뉴
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "03. 메인 화면 옵션 메뉴 (☰)", "Main Options Menu");
  footer(s); pageNum(s, 6);

  s.addText("메인 화면 우측 상단 [☰] 버튼을 터치하면 아래 옵션 메뉴가 표시됩니다.", {
    x: 0.5, y: 1.25, w: 12, h: 0.35, fontSize: 12, color: C.primary, fontFace: "맑은 고딕",
  });

  const opts = [
    { name: "다크 모드", how: "토글 ON/OFF", desc: "어두운 테마로 전환합니다. 야간 작업 시 눈 피로를 줄여줍니다.", icon: "🌙", color: "818CF8" },
    { name: "화면 꺼짐 방지", how: "토글 ON/OFF", desc: "PDA 화면이 자동으로 꺼지지 않도록 합니다. 바코드 스캔 대기 시 유용합니다.", icon: "🖥️", color: C.cardGreen },
    { name: "글꼴 크기", how: "소 / 중 / 대 선택", desc: "앱 전체 글꼴 크기를 조절합니다. 현장에서 보기 어려울 때 '대'로 설정하세요.", icon: "🔤", color: "64748B" },
    { name: "서버 상태", how: "자동 확인 + 🔄 버튼", desc: "서버 연결 상태를 확인합니다. ● 연결됨(초록), ● 연결 안됨(빨강)으로 표시됩니다.", icon: "🖧", color: C.cardBlue },
    { name: "입력 딜레이", how: "짧게 / 보통 / 길게", desc: "바코드 스캐너 입력 속도를 조절합니다. 스캔이 두 번 되면 '길게'로 변경하세요.", icon: "📊", color: C.orange },
    { name: "스캔 이력", how: "터치 → 대시보드 열기", desc: "오늘 스캔 통계(성공/오류)와 전체 스캔 이력을 확인할 수 있습니다.", icon: "📋", color: "6366F1" },
    { name: "저장 이력", how: "터치 → 모달 열기", desc: "DB에 성공적으로 저장된 이력을 오늘/전체, 페이지별로 확인합니다.", icon: "💾", color: C.cardGreen },
  ];

  opts.forEach((o, i) => {
    const y = 1.75 + i * 0.73;
    const isEven = i % 2 === 0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 0.63, fill: { color: isEven ? "F8F9FA" : C.white }, rectRadius: 0.06 });
    s.addText(o.icon, { x: 0.5, y, w: 0.5, h: 0.63, fontSize: 16, align: "center", valign: "middle" });
    s.addText(o.name, { x: 1.1, y, w: 1.7, h: 0.63, fontSize: 12, color: o.color, bold: true, fontFace: "맑은 고딕", valign: "middle" });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.9, y: y + 0.14, w: 2.2, h: 0.35, fill: { color: C.light }, rectRadius: 0.05, line: { color: C.lightGray, width: 0.5 } });
    s.addText(o.how, { x: 3.0, y: y + 0.14, w: 2.0, h: 0.35, fontSize: 9, color: C.gray, fontFace: "맑은 고딕", valign: "middle" });
    s.addText(o.desc, { x: 5.3, y, w: 7.5, h: 0.63, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.25 });
  });

  tipBox(s, 0.3, 6.9, 12.7, 0.15, "", "info");
  s.addText("메뉴 영역 바깥을 터치하면 옵션 메뉴가 자동으로 닫힙니다.", {
    x: 0.5, y: 6.55, w: 12, h: 0.35, fontSize: 10, color: C.primary, fontFace: "맑은 고딕",
  });
}

// ============================================================
// 7. 적재위치관리 - 화면 안내 + 사용 절차
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "04. 적재위치관리 사용 방법", "Location Management");
  footer(s); pageNum(s, 7);

  // 왼쪽: step by step
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.5, h: 5.55, fill: { color: C.tipBg }, rectRadius: 0.15, line: { color: C.orange, width: 1.5 } });
  s.addText("📦  사용 절차 (Step by Step)", { x: 0.6, y: 1.4, w: 6, h: 0.45, fontSize: 15, color: C.orange, bold: true, fontFace: "맑은 고딕" });

  const locSteps = [
    { t: "적재대 선택", d: "① 적재대스캔 입력란에 QR코드를 스캔 (\"구분코드-번호코드\" 형식)\n    → 적재대구분·적재대번호가 자동으로 선택됩니다.\n    또는 드롭다운에서 직접 적재대구분 → 적재대번호 순서로 선택" },
    { t: "바코드 스캔", d: "② 적재대 선택 완료 후 바코드 입력란에 커서가 자동 이동\n    → PDA 스캐너로 자재 바코드를 스캔합니다.\n    (형식: 배치-자재코드-본수-수주번호-행번[-길이])" },
    { t: "본수 확인 / 변경", d: "③ 기본: [정상] 모드 → 바코드의 본수가 자동 입력\n    본수를 바꿔야 하면: [본수변경] 선택 후 본수 입력란에 숫자 입력" },
    { t: "테이블 확인", d: "④ 스캔된 데이터가 하단 테이블에 추가됩니다.\n    잘못 스캔한 행: 터치하여 선택 → [삭제] 버튼" },
    { t: "저장", d: "⑤ 모든 스캔이 완료되면 [저장] 버튼 터치\n    → Oracle DB에 실시간 저장됩니다." },
  ];
  locSteps.forEach((st, i) => {
    const y = 2.0 + i * 1.05;
    stepBadge(s, 0.5, y, i + 1, C.orange);
    s.addText(st.t, { x: 1.1, y, w: 2.0, h: 0.35, fontSize: 11, color: C.orange, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.1, y: y + 0.3, w: 5.5, h: 0.65, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 오른쪽: 주의사항 + 테이블 컬럼
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.35, w: 6.0, h: 2.5, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1 } });
  s.addText("📋  테이블 컬럼 안내", { x: 7.2, y: 1.4, w: 5, h: 0.4, fontSize: 13, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "일자 | 시간 | 배치번호 | 자재코드 | 길이 | 본수\n수주번호 | 행번 | 적재대구분 | 적재대번호\n\n" +
    "• 일자·시간은 스캔 시점에 자동 기록\n" +
    "• 적재대구분·번호는 선택한 드롭다운 값 표시",
    { x: 7.2, y: 1.85, w: 5.5, h: 1.8, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  // 주의사항
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.05, w: 6.0, h: 2.85, fill: { color: C.warnBg }, rectRadius: 0.15, line: { color: C.red, width: 1 } });
  s.addText("⚠️  주의사항", { x: 7.2, y: 4.1, w: 5, h: 0.4, fontSize: 13, color: C.red, bold: true, fontFace: "맑은 고딕" });
  const warns = [
    "적재대구분·번호를 반드시 먼저 선택 후 스캔하세요.",
    "같은 배치번호+자재코드는 중복 등록할 수 없습니다.",
    "저장 전에는 PDA 로컬에만 있으므로, 저장 버튼을 반드시 눌러주세요.",
    "[삭제] 버튼은 테이블에서 행을 터치 선택 후 사용합니다.",
    "스캔 성공 시 '삐' 소리, 실패 시 '삐삐' 소리가 납니다.\n(☰ 옵션에서 효과음 ON 필요)",
  ];
  warns.forEach((w, i) => {
    s.addText(`•  ${w}`, { x: 7.2, y: 4.55 + i * 0.45, w: 5.5, h: 0.4, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 });
  });
}

// ============================================================
// 8. 스켈프 투입 - 화면 안내 + 사용 절차
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "05. 스켈프 투입 사용 방법", "Slitting Input");
  footer(s); pageNum(s, 8);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.5, h: 5.55, fill: { color: C.stepBg }, rectRadius: 0.15, line: { color: C.cardGreen, width: 1.5 } });
  s.addText("🔧  사용 절차 (Step by Step)", { x: 0.6, y: 1.4, w: 6, h: 0.45, fontSize: 15, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });

  const slitSteps = [
    { t: "일자 선택", d: "① 오늘 날짜가 기본 선택됩니다.\n    다른 날짜의 데이터를 처리하려면 일자를 변경하세요." },
    { t: "공정 → 작업장 → 근무조 선택", d: "② 공정 드롭다운 선택 → 작업장 목록이 자동 로드\n    작업장 선택 → 근무조(주간/야간) 선택\n    3개 모두 선택하면 바코드 입력란으로 자동 포커스" },
    { t: "기존 데이터 불러오기 (선택)", d: "③ [조회] 버튼 터치 → 이미 등록된 투입 데이터를 불러옵니다.\n    이전에 스캔한 데이터를 이어서 작업할 때 사용" },
    { t: "바코드 스캔", d: "④ PDA 스캐너로 코일 바코드를 스캔합니다.\n    (형식: 배치번호-품목코드, 예: HR06582801-DS100006)\n    순번이 자동 부여되며 테이블에 추가됩니다." },
    { t: "저장", d: "⑤ 모든 투입 코일 스캔이 완료되면 [저장] 버튼 터치\n    → Oracle DB에 투입 실적이 저장됩니다." },
  ];
  slitSteps.forEach((st, i) => {
    const y = 2.0 + i * 1.05;
    stepBadge(s, 0.5, y, i + 1, C.cardGreen);
    s.addText(st.t, { x: 1.1, y, w: 3.0, h: 0.35, fontSize: 11, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.1, y: y + 0.3, w: 5.5, h: 0.65, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 오른쪽
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.35, w: 6.0, h: 2.3, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1 } });
  s.addText("📋  테이블 컬럼 안내", { x: 7.2, y: 1.4, w: 5, h: 0.4, fontSize: 13, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
  s.addText("순번 | 배치번호 | 품목코드 | 스캔일자 | 스캔시간\n\n• 순번: 투입 순서 자동 부여 (1, 2, 3…)\n• 스캔일자·시간: 스캔 시점 자동 기록", {
    x: 7.2, y: 1.85, w: 5.5, h: 1.5, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 3.85, w: 6.0, h: 1.8, fill: { color: C.warnBg }, rectRadius: 0.15, line: { color: C.red, width: 1 } });
  s.addText("⚠️  주의사항", { x: 7.2, y: 3.9, w: 5, h: 0.4, fontSize: 13, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "•  공정·작업장·근무조를 반드시 먼저 선택하세요.\n" +
    "•  같은 배치번호는 중복 입력할 수 없습니다.\n" +
    "•  [조회]로 불러온 데이터에 추가 스캔하여 이어서 작업 가능\n" +
    "•  잘못 스캔한 행: 터치 선택 → [삭제]",
    { x: 7.2, y: 4.35, w: 5.5, h: 1.1, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  tipBox(s, 7.0, 5.85, 6.0, 0.5, "조회 결과가 없어도 새로 스캔하여 데이터를 추가할 수 있습니다.");
  tipBox(s, 7.0, 6.45, 6.0, 0.4, "← 뒤로 버튼을 터치하면 메인 화면으로 돌아갑니다.", "info");
}

// ============================================================
// 9. 상차등록 - 화면 안내
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "06. 상차등록 사용 방법 ①", "Loading Registration - Step 1~3");
  footer(s); pageNum(s, 9);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.5, h: 5.55, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1.5 } });
  s.addText("🚛  사용 절차 전반부 (조회까지)", { x: 0.6, y: 1.4, w: 6, h: 0.45, fontSize: 15, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });

  const loadSteps1 = [
    { t: "일자 확인", d: "① 오늘 날짜가 기본 선택됩니다." },
    { t: "지시번호 입력", d: "② '지시' 입력란에 상차지시번호 7자리를 입력합니다.\n    → 7자리 입력 완료 시 자동으로 조회가 시작됩니다.\n    (또는 엔터 키를 눌러서 조회할 수도 있습니다.)" },
    { t: "피킹 목록 자동 로드", d: "③ 조회 성공 시:\n    • 차량번호가 자동으로 표시됩니다.\n    • 계획 수량이 자동 계산됩니다.\n    • 피킹 대상 품목 목록이 테이블에 나타납니다.\n    • 바코드 입력란으로 커서가 자동 이동합니다." },
  ];
  loadSteps1.forEach((st, i) => {
    const y = 2.0 + i * 1.7;
    stepBadge(s, 0.5, y, i + 1, C.cardBlue);
    s.addText(st.t, { x: 1.1, y, w: 3.0, h: 0.35, fontSize: 12, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.1, y: y + 0.35, w: 5.5, h: 1.2, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 });
  });

  // 오른쪽: 테이블 컬럼
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.35, w: 6.0, h: 3.0, fill: { color: "F0F4F8" }, rectRadius: 0.15, line: { color: C.secondary, width: 1 } });
  s.addText("📋  테이블 컬럼 안내", { x: 7.2, y: 1.4, w: 5, h: 0.4, fontSize: 13, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  const cols = [
    ["컬럼", "설명"],
    ["완료 ✔", "지시수 = 피킹수 합계 시 자동 체크"],
    ["순번", "행 순서 (자동)"],
    ["품목코드 / 품목", "출하 대상 품목 정보"],
    ["길이", "품목 길이 (매칭 키)"],
    ["지시수", "출하 계획 수량"],
    ["배치", "바코드 스캔 시 자동 입력"],
    ["피킹수", "스캔된 실제 수량"],
    ["다발수", "다발 수량"],
  ];
  s.addTable(cols, {
    x: 7.1, y: 1.85, w: 5.7, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.5, 4.2], rowH: [0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22],
    autoPage: false, color: C.dark,
    headerRow: true, firstRowFill: { color: C.secondary }, firstRowColor: C.white,
    altFill: { color: "F0F7FF" },
  });

  // 입력 필드 요약
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.55, w: 6.0, h: 2.3, fill: { color: C.tipBg }, rectRadius: 0.15, line: { color: C.orange, width: 1 } });
  s.addText("📝  입력 필드 요약", { x: 7.2, y: 4.6, w: 5, h: 0.35, fontSize: 13, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 일자: 오늘 날짜 (수정 가능)\n" +
    "• 지시: 상차지시번호 7자리 (숫자만)\n" +
    "• 차량: 조회 시 자동 입력 (수정 가능)\n" +
    "• 네임: 기사명 (수동 입력)\n" +
    "• 계획: 지시수 합계 (자동, 수정 불가)\n" +
    "• 피킹: 스캔된 피킹수 합계 (자동)\n" +
    "• 라인: 배치가 채워진 행 수 (자동)",
    { x: 7.2, y: 5.0, w: 5.5, h: 1.7, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );
}

// ============================================================
// 10. 상차등록 - 사용 절차 후반
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "06. 상차등록 사용 방법 ②", "Loading Registration - Step 4~6");
  footer(s); pageNum(s, 10);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.5, h: 5.55, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1.5 } });
  s.addText("🚛  사용 절차 후반부 (스캔 ~ 저장)", { x: 0.6, y: 1.4, w: 6, h: 0.45, fontSize: 15, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });

  const loadSteps2 = [
    { t: "바코드 스캔", d: "④ PDA 스캐너로 출하 물품의 바코드를 스캔합니다.\n    (형식: 배치-품목코드-수량-수주번호-수주행번-길이)\n    → 품목코드+길이가 일치하는 행에 자동 매칭됩니다.\n    → 배치가 빈 행에 채워지고, 없으면 새 행이 삽입됩니다." },
    { t: "수량 변경 (필요 시)", d: "⑤ 기본: [정상] 모드 → 바코드의 수량이 피킹수로 자동 입력\n    수량을 바꿔야 하면: [수량변경] 선택 후 숫자 입력\n    → 바코드 스캔 시 입력한 수량으로 피킹수가 설정됩니다." },
    { t: "저장", d: "⑥ 아직 스캔 중인 경우: [임시 저장] → 나중에 이어서 작업 가능\n    모든 스캔이 완료된 경우: [최종 저장]\n    → 계획 수량과 피킹 수량이 일치해야 최종 저장 가능\n    → 최종 저장 후에는 수정할 수 없습니다!" },
  ];
  loadSteps2.forEach((st, i) => {
    const y = 2.0 + i * 1.65;
    stepBadge(s, 0.5, y, i + 4, C.cardBlue);
    s.addText(st.t, { x: 1.1, y, w: 3.0, h: 0.35, fontSize: 12, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.1, y: y + 0.35, w: 5.5, h: 1.15, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 });
  });

  // 오른쪽: 버튼 설명 + 자동완료
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.35, w: 6.0, h: 2.5, fill: { color: C.stepBg }, rectRadius: 0.15, line: { color: C.cardGreen, width: 1.5 } });
  s.addText("🔘  하단 버튼 3종", { x: 7.2, y: 1.4, w: 5, h: 0.45, fontSize: 14, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });

  const btns = [
    { name: "최종 저장", desc: "모든 스캔 완료 시. 계획=피킹 일치 필수.\n저장 후 수정 불가. 확인 팝업이 나타남.", color: C.red },
    { name: "임시 저장", desc: "작업 중간에 저장. 나중에 이어서 스캔 가능.\n수량 불일치도 저장 가능.", color: C.accent },
    { name: "삭 제", desc: "선택한 행을 삭제합니다.\n행 터치 → 파란색 선택 → [삭제] 터치", color: C.gray },
  ];
  btns.forEach((b, i) => {
    const y = 2.0 + i * 0.6;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.3, y, w: 1.3, h: 0.4, fill: { color: b.color }, rectRadius: 0.05 });
    s.addText(b.name, { x: 7.3, y, w: 1.3, h: 0.4, fontSize: 10, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(b.desc, { x: 8.8, y, w: 4.0, h: 0.55, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 자동 완료 체크
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.1, w: 6.0, h: 1.5, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1 } });
  s.addText("✔  자동 완료 체크란 안내", { x: 7.2, y: 4.15, w: 5, h: 0.4, fontSize: 12, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "테이블 '완료' 컬럼의 체크박스는 자동으로 체크됩니다.\n\n" +
    "같은 품목코드+길이 그룹의 피킹수 합계가\n해당 그룹의 지시수와 같아지면 → ✔ 자동 체크\n이미 완료된 그룹에 추가 스캔하면 → 오류 처리",
    { x: 7.2, y: 4.55, w: 5.5, h: 0.9, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );

  // 주의사항
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 5.8, w: 6.0, h: 1.1, fill: { color: C.warnBg }, rectRadius: 0.15, line: { color: C.red, width: 1 } });
  s.addText("⚠️  주의: 최종 저장 후에는 수정이 불가능합니다!", { x: 7.2, y: 5.85, w: 5.5, h: 0.4, fontSize: 11, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText("반드시 테이블을 꼼꼼히 확인한 후 [최종 저장]을 눌러주세요.\n확신이 없으면 [임시 저장]을 먼저 사용하세요.", {
    x: 7.2, y: 6.25, w: 5.5, h: 0.5, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
}

// ============================================================
// 11. 기능 화면 공통 옵션
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "07. 기능 화면 공통 옵션 메뉴", "Feature Screen Options");
  footer(s); pageNum(s, 11);

  s.addText("적재위치관리 / 스켈프 투입 / 상차등록 화면에서 우측 상단 [☰] 버튼을 터치하면 아래 옵션이 표시됩니다.", {
    x: 0.5, y: 1.25, w: 12, h: 0.35, fontSize: 11, color: C.primary, fontFace: "맑은 고딕" });

  const feOpts = [
    { name: "다크 모드", how: "토글 ON/OFF", desc: "어두운 테마 전환 (야간 작업용)", icon: "🌙", color: "818CF8" },
    { name: "전달용 (Oracle Ref)", how: "토글 ON/OFF", desc: "Oracle SP 호출 파라미터·결과를 화면에 표시 (IT관리자·디버깅용)", icon: "📄", color: "64748B" },
    { name: "이메일 전달", how: "토글 ON/OFF", desc: "저장/조회 시 SP 파라미터·결과를 지정 이메일로 자동 발송", icon: "📧", color: C.cardBlue },
    { name: "화면 꺼짐 방지", how: "토글 ON/OFF", desc: "PDA 화면 자동 꺼짐 방지 (스캔 대기 시 유용)", icon: "🖥️", color: C.cardGreen },
    { name: "글꼴 크기", how: "소 / 중 / 대", desc: "앱 전체 글꼴 크기 3단계 조절", icon: "🔤", color: "64748B" },
    { name: "스캔 효과음", how: "토글 ON/OFF", desc: "바코드 스캔 성공/실패 시 효과음 재생", icon: "🔊", color: C.cardBlue },
    { name: "진동 피드백", how: "토글 ON/OFF", desc: "바코드 스캔 성공/실패 시 PDA 진동 피드백", icon: "📳", color: C.orange },
    { name: "스캔 이력", how: "터치 → 대시보드", desc: "스캔 성공/오류 통계 및 이력 목록 확인", icon: "📋", color: "6366F1" },
    { name: "저장 이력", how: "터치 → 모달", desc: "DB 저장 성공 이력 확인 (오늘/전체)", icon: "💾", color: C.cardGreen },
  ];

  feOpts.forEach((o, i) => {
    const y = 1.7 + i * 0.58;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 0.5, fill: { color: i % 2 === 0 ? "F8F9FA" : C.white }, rectRadius: 0.05 });
    s.addText(o.icon, { x: 0.4, y, w: 0.45, h: 0.5, fontSize: 14, align: "center", valign: "middle" });
    s.addText(o.name, { x: 0.95, y, w: 2.1, h: 0.5, fontSize: 11, color: o.color, bold: true, fontFace: "맑은 고딕", valign: "middle" });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.1, y: y + 0.1, w: 1.5, h: 0.3, fill: { color: o.color }, rectRadius: 0.04 });
    s.addText(o.how, { x: 3.1, y: y + 0.1, w: 1.5, h: 0.3, fontSize: 8, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(o.desc, { x: 4.8, y, w: 8.0, h: 0.5, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", valign: "middle" });
  });

  tipBox(s, 0.3, 6.95, 12.7, 0.15, "", "info");
  s.addText("전달용(Oracle Ref)과 이메일 전달은 IT관리자용 기능입니다. 일반 작업자는 사용하지 않아도 됩니다.", {
    x: 0.5, y: 6.55, w: 12, h: 0.35, fontSize: 10, color: C.primary, fontFace: "맑은 고딕" });
}

// ============================================================
// 12. 바코드 스캔 방법
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "08. 바코드 스캔 방법", "How to Scan Barcodes");
  footer(s); pageNum(s, 12);

  // 방법 1: 하드웨어 스캐너
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.3, h: 2.8, fill: { color: C.infoBg }, rectRadius: 0.15, line: { color: C.cardBlue, width: 1.5 } });
  stepBadge(s, 0.5, 1.45, 1, C.cardBlue);
  s.addText("PDA 내장 스캐너 사용 (기본)", { x: 1.1, y: 1.45, w: 5, h: 0.4, fontSize: 14, color: C.cardBlue, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① 바코드 입력란에 커서가 깜빡이는지 확인\n" +
    "② PDA의 스캔 버튼(측면 또는 트리거)을 누름\n" +
    "③ 바코드에 레이저를 조준하여 스캔\n" +
    "④ 성공 시 자동으로 데이터가 입력됩니다.\n\n" +
    "※ 소프트 키보드(가상 키보드)는 자동으로 숨겨져 있습니다.\n   이는 스캐너 입력만 받기 위한 설계입니다.",
    { x: 0.6, y: 2.0, w: 5.8, h: 2.0, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  // 방법 2: 수동 입력
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.35, w: 6.3, h: 2.5, fill: { color: C.tipBg }, rectRadius: 0.15, line: { color: C.orange, width: 1.5 } });
  stepBadge(s, 0.5, 4.45, 2, C.orange);
  s.addText("수동 입력 (키보드)", { x: 1.1, y: 4.45, w: 5, h: 0.4, fontSize: 14, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "스캐너가 작동하지 않거나, 바코드가 훼손된 경우:\n\n" +
    "① 바코드 입력란 우측의 📷 버튼을 터치\n" +
    "② 소프트 키보드가 나타납니다.\n" +
    "③ 바코드 번호를 직접 입력 후 [입력] 버튼 또는 엔터",
    { x: 0.6, y: 5.0, w: 5.8, h: 1.6, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  // 오른쪽: 바코드 형식
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.35, w: 6.2, h: 5.5, fill: { color: "F0F4F8" }, rectRadius: 0.15, line: { color: C.secondary, width: 1.5 } });
  s.addText("📊  바코드 형식 안내", { x: 7.1, y: 1.4, w: 5, h: 0.5, fontSize: 15, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const formats = [
    { page: "적재위치관리", format: "배치번호-자재코드-본수-수주번호-행번[-길이]", example: "HG00160205-DS100179-0180-15400-1\nHG00160200-DP200800-0120-15400-1-6.84", parts: "5~6파트", color: C.orange },
    { page: "스켈프 투입", format: "배치번호-품목코드", example: "HR06582801-DS100006", parts: "2파트", color: C.cardGreen },
    { page: "상차등록", format: "배치-품목코드-수량-수주번호-수주행번-길이", example: "HG00160200-DP200800-0120-15400-1-6.84", parts: "6파트", color: C.cardBlue },
  ];
  formats.forEach((f, i) => {
    const y = 2.1 + i * 1.6;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y, w: 5.8, h: 1.4, fill: { color: C.white }, rectRadius: 0.08, line: { color: f.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: y + 0.05, w: 0.08, h: 1.3, fill: { color: f.color }, rectRadius: 0.03 });
    s.addText(`${f.page}  [${f.parts}]`, { x: 7.35, y, w: 5.2, h: 0.35, fontSize: 11, color: f.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(f.format, { x: 7.35, y: y + 0.35, w: 5.2, h: 0.3, fontSize: 9, color: C.gray, fontFace: "Consolas" });
    s.addText(`예시: ${f.example}`, { x: 7.35, y: y + 0.7, w: 5.2, h: 0.6, fontSize: 9, color: C.dark, fontFace: "Consolas", lineSpacingMultiple: 1.3 });
  });

  tipBox(s, 6.8, 6.95, 6.2, 0.15, "", "info");
  s.addText("바코드의 각 파트는 '-'(하이픈)으로 구분됩니다.", { x: 7.0, y: 6.55, w: 6, h: 0.3, fontSize: 10, color: C.primary, fontFace: "맑은 고딕" });
}

// ============================================================
// 13. 스캔 이력 / 저장 이력
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "09. 스캔 이력 / 저장 이력", "Scan History & Save History");
  footer(s); pageNum(s, 13);

  // 스캔 이력
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 6.3, h: 5.55, fill: { color: "EEF2FF" }, rectRadius: 0.15, line: { color: "6366F1", width: 2 } });
  s.addText("📋  스캔 이력 대시보드", { x: 0.6, y: 1.4, w: 5.5, h: 0.5, fontSize: 15, color: "6366F1", bold: true, fontFace: "맑은 고딕" });
  s.addText("☰ 옵션 → [스캔 이력] 터치 시 열림", { x: 0.6, y: 1.85, w: 5.5, h: 0.3, fontSize: 10, color: C.gray, fontFace: "맑은 고딕" });

  const dashFeatures = [
    "오늘 스캔 통계: 전체 / 성공 / 오류 건수 카드",
    "성공률: 도넛 차트 (90%↑ 초록, 70%↑ 노랑, 미만 빨강)",
    "페이지별 카드: 상차 / 적재 / 스켈프 별 성공·오류 현황",
    "카드 터치 시 해당 페이지 이력만 필터링",
    "결과 필터: [전체] / [성공] / [오류] 버튼",
    "이력 목록: 배치번호, 페이지, 시간 표시 (최근 100건)",
    "하단 [이력 전체 삭제] 버튼 (확인 후 삭제)",
    "최대 500건까지 PDA 로컬에 보관",
  ];
  dashFeatures.forEach((f, i) => {
    s.addText(`•  ${f}`, { x: 0.6, y: 2.25 + i * 0.43, w: 5.8, h: 0.4, fontSize: 10, color: C.dark, fontFace: "맑은 고딕" });
  });

  tipBox(s, 0.5, 5.75, 5.8, 0.5, "스캔 이력은 PDA 로컬(브라우저)에 저장됩니다.\n프로그램 종료해도 유지되지만, 캐시 삭제 시 사라집니다.");
  tipBox(s, 0.5, 6.35, 5.8, 0.4, "닫기: 우측 상단 ✕ 버튼 터치", "info");

  // 저장 이력
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.35, w: 6.2, h: 5.55, fill: { color: "F0FDF4" }, rectRadius: 0.15, line: { color: C.cardGreen, width: 2 } });
  s.addText("💾  저장 이력 모달", { x: 7.1, y: 1.4, w: 5.5, h: 0.5, fontSize: 15, color: C.cardGreen, bold: true, fontFace: "맑은 고딕" });
  s.addText("☰ 옵션 → [저장 이력] 터치 시 열림", { x: 7.1, y: 1.85, w: 5.5, h: 0.3, fontSize: 10, color: C.gray, fontFace: "맑은 고딕" });

  const saveFeatures = [
    "성공적으로 DB에 저장된 이력만 표시",
    "날짜 탭: [오늘] / [전체] 전환",
    "페이지 칩: [전체] [상차] [적재] [스켈프] 필터",
    "각 칩 옆에 건수 표시",
    "이력 목록: ✔ 배치번호, 페이지 태그, 시간",
    "색상 태그로 페이지 구분 (파랑/주황/초록)",
    "메인 화면 + 모든 기능 화면에서 접근 가능",
  ];
  saveFeatures.forEach((f, i) => {
    s.addText(`•  ${f}`, { x: 7.1, y: 2.25 + i * 0.43, w: 5.8, h: 0.4, fontSize: 10, color: C.dark, fontFace: "맑은 고딕" });
  });

  tipBox(s, 7.0, 5.35, 5.7, 0.5, "저장 이력으로 \"방금 저장이 제대로 되었는지\" 즉시 확인할 수 있습니다.");

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 5.95, w: 5.7, h: 0.85, fill: { color: C.tipBg }, rectRadius: 0.08, line: { color: C.orange, width: 1 } });
  s.addText("💡  활용 팁\n\"저장했는데 맞나?\" 싶을 때 → 저장 이력에서 배치번호를 확인!\n\"오늘 몇 건 스캔했지?\" → 스캔 이력 대시보드에서 한눈에 확인!", {
    x: 7.15, y: 5.95, w: 5.4, h: 0.85, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
}

// ============================================================
// 14~17: FAQ / 문제 해결
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "10. 자주 묻는 질문 (FAQ)", "Frequently Asked Questions");
  footer(s); pageNum(s, 14);

  const faqs = [
    { q: "바코드 스캔이 안 돼요.", a: "① 바코드 입력란에 커서(깜빡임)가 있는지 확인\n② 입력란 터치하여 포커스 이동\n③ PDA 스캔 버튼 다시 시도\n④ 안 되면 📷 버튼으로 수동 입력" },
    { q: "스캔하면 두 번 입력돼요.", a: "메인 화면 ☰ → '입력 딜레이'를 '길게(200ms)'로 변경하세요." },
    { q: "화면이 자꾸 꺼져요.", a: "☰ → '화면 꺼짐 방지'를 ON으로 설정하세요." },
    { q: "글자가 너무 작아서 안 보여요.", a: "☰ → '글꼴 크기'를 '대'로 변경하세요." },
    { q: "\"서버 연결 안됨\"이 표시돼요.", a: "① LTE 신호 확인 (PDA 상단바)\n② 장소 이동 후 재시도\n③ 지속되면 IT팀 연락 (내선 XXX)" },
    { q: "저장 버튼을 눌렀는데 오류가 나요.", a: "① 빨간색 오류 메시지 내용 확인\n② 필수 항목(적재대, 지시번호 등) 선택 여부 확인\n③ 지속되면 오류 메시지를 캡처하여 IT팀에 전달" },
    { q: "로그인이 안 돼요.", a: "① 아이디·비밀번호 정확히 입력 확인\n② Caps Lock 해제 확인\n③ 주소가 http://pda.dongasteel.co.kr 인지 확인" },
    { q: "상차등록에서 최종저장 후 수정하고 싶어요.", a: "최종 저장은 취소할 수 없습니다.\n수정이 필요하면 IT팀에 연락해 주세요." },
  ];

  faqs.forEach((f, i) => {
    const y = 1.3 + i * 0.72;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 0.64, fill: { color: i % 2 === 0 ? "F8F9FA" : C.white }, rectRadius: 0.06, line: { color: C.lightGray, width: 0.5 } });
    s.addText("Q", { x: 0.4, y, w: 0.4, h: 0.64, fontSize: 14, color: C.cardBlue, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
    s.addText(f.q, { x: 0.9, y, w: 3.5, h: 0.64, fontSize: 10.5, color: C.primary, bold: true, fontFace: "맑은 고딕", valign: "middle" });
    s.addText(f.a, { x: 4.5, y, w: 8.3, h: 0.64, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.15 });
  });
}

// ============================================================
// 15. 문제 해결 가이드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "10. 문제 해결 가이드", "Troubleshooting Guide");
  footer(s); pageNum(s, 15);

  const troubles = [
    { symptom: "앱이 로딩되지 않음\n(빈 화면)", steps: "① 인터넷(LTE) 연결 확인\n② 주소창에 http://pda.dongasteel.co.kr 정확히 입력\n③ Chrome 브라우저인지 확인\n④ 브라우저 캐시 삭제: Chrome → 설정 → 인터넷 사용기록 삭제\n⑤ PDA 재부팅 후 재시도", color: C.red },
    { symptom: "스캔 시 \"형식 오류\"", steps: "① 바코드가 훼손되지 않았는지 확인\n② 다른 바코드로 테스트\n③ 수동 입력(📷)으로 번호 직접 입력\n④ 바코드 형식이 해당 화면에 맞는지 확인", color: C.orange },
    { symptom: "\"이미 등록된 배치\"", steps: "① 같은 바코드를 두 번 스캔한 것\n② 스캔 이력에서 확인\n③ 이미 등록된 것이 맞다면 다음 바코드로 진행", color: C.accent },
    { symptom: "저장 중 통신 오류", steps: "① 잠시 후 다시 [저장] 시도\n② LTE 신호 확인 후 장소 이동\n③ ☰ → 서버 상태에서 '● 연결됨' 확인 후 재시도\n④ 지속 시 IT팀 연락", color: C.cardBlue },
    { symptom: "화면이 이상하게 보임", steps: "① 브라우저 확대/축소 100%로 리셋\n② ☰ → 글꼴 크기 '중'으로 설정\n③ 다크 모드 ON/OFF 토글\n④ 프로그램 종료 후 다시 시작", color: C.purple },
  ];

  troubles.forEach((t, i) => {
    const y = 1.35 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 1.05, fill: { color: C.white }, rectRadius: 0.08, line: { color: t.color, width: 1.5 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: y + 0.08, w: 0.1, h: 0.88, fill: { color: t.color }, rectRadius: 0.03 });
    s.addText(t.symptom, { x: 0.7, y, w: 2.8, h: 1.05, fontSize: 11, color: t.color, bold: true, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.3 });
    s.addText(t.steps, { x: 3.7, y, w: 9.1, h: 1.05, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.25 });
  });

  tipBox(s, 0.3, 6.55, 12.7, 0.5, "위 방법으로 해결되지 않는 경우, 오류 화면을 캡처하여 IT팀에 전달해 주세요. 캡처 방법: 전원+볼륨 하 동시 누름", "info");
}

// ============================================================
// 16. 빠른 참조 카드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "빠른 참조 카드", "Quick Reference Card");
  footer(s); pageNum(s, 16);

  // 적재위치관리
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.35, w: 4.0, h: 5.5, fill: { color: C.white }, rectRadius: 0.15, line: { color: C.orange, width: 2 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.3, y: 1.35, w: 4.0, h: 0.55, fill: { color: C.orange }, rectRadius: 0.15 });
  s.addText("📦  적재위치관리", { x: 0.3, y: 1.35, w: 4.0, h: 0.55, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  const locQ = ["적재대스캔 QR 또는 드롭다운 선택", "적재대구분 → 적재대번호", "바코드 스캔 (5~6파트)", "정상 / 본수변경 모드", "스캔 데이터 테이블 확인", "[저장] → Oracle DB 저장", "[삭제] → 선택 행 제거"];
  locQ.forEach((q, i) => {
    s.addText(`${i + 1}.  ${q}`, { x: 0.6, y: 2.1 + i * 0.48, w: 3.4, h: 0.42, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕" });
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 5.6, w: 3.6, h: 0.4, fill: { color: "FFF8E1" }, rectRadius: 0.05 });
  s.addText("바코드: 배치-자재-본수-수주-행번[-길이]", { x: 0.6, y: 5.6, w: 3.4, h: 0.4, fontSize: 8.5, color: C.orange, fontFace: "Consolas" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 6.1, w: 3.6, h: 0.55, fill: { color: C.warnBg }, rectRadius: 0.05 });
  s.addText("⚠️ 적재대 먼저 선택!\n⚠️ 중복 배치 불가!", { x: 0.6, y: 6.1, w: 3.4, h: 0.55, fontSize: 9, color: C.red, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });

  // 스켈프 투입
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.6, y: 1.35, w: 4.0, h: 5.5, fill: { color: C.white }, rectRadius: 0.15, line: { color: C.cardGreen, width: 2 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 4.6, y: 1.35, w: 4.0, h: 0.55, fill: { color: C.cardGreen }, rectRadius: 0.15 });
  s.addText("🔧  스켈프 투입", { x: 4.6, y: 1.35, w: 4.0, h: 0.55, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  const slitQ = ["일자 확인 (오늘 기본)", "공정 → 작업장 → 근무조 선택", "[조회] → 기존 데이터 불러오기", "바코드 스캔 (배치-품목코드)", "순번 자동 부여", "[저장] → Oracle DB 저장", "[삭제] → 선택 행 제거"];
  slitQ.forEach((q, i) => {
    s.addText(`${i + 1}.  ${q}`, { x: 4.9, y: 2.1 + i * 0.48, w: 3.4, h: 0.42, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕" });
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.8, y: 5.6, w: 3.6, h: 0.4, fill: { color: "F0FDF4" }, rectRadius: 0.05 });
  s.addText("바코드: 배치번호-품목코드", { x: 4.9, y: 5.6, w: 3.4, h: 0.4, fontSize: 8.5, color: C.cardGreen, fontFace: "Consolas" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.8, y: 6.1, w: 3.6, h: 0.55, fill: { color: C.warnBg }, rectRadius: 0.05 });
  s.addText("⚠️ 공정+작업장+근무조 먼저!\n⚠️ 중복 배치 불가!", { x: 4.9, y: 6.1, w: 3.4, h: 0.55, fontSize: 9, color: C.red, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });

  // 상차등록
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.9, y: 1.35, w: 4.1, h: 5.5, fill: { color: C.white }, rectRadius: 0.15, line: { color: C.cardBlue, width: 2 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 8.9, y: 1.35, w: 4.1, h: 0.55, fill: { color: C.cardBlue }, rectRadius: 0.15 });
  s.addText("🚛  상차등록", { x: 8.9, y: 1.35, w: 4.1, h: 0.55, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  const loadQ = ["지시번호 7자리 입력 (자동조회)", "피킹 목록 확인 (자동 로드)", "바코드 스캔 (6파트)", "정상 / 수량변경 모드", "완료 ✔ 자동 체크 확인", "[임시 저장] 또는 [최종 저장]", "최종 저장 시 계획=피킹 필수!"];
  loadQ.forEach((q, i) => {
    s.addText(`${i + 1}.  ${q}`, { x: 9.2, y: 2.1 + i * 0.48, w: 3.5, h: 0.42, fontSize: 10.5, color: C.dark, fontFace: "맑은 고딕" });
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.1, y: 5.6, w: 3.7, h: 0.4, fill: { color: "EFF6FF" }, rectRadius: 0.05 });
  s.addText("바코드: 배치-품목-수량-수주-행번-길이", { x: 9.2, y: 5.6, w: 3.5, h: 0.4, fontSize: 8.5, color: C.cardBlue, fontFace: "Consolas" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.1, y: 6.1, w: 3.7, h: 0.55, fill: { color: C.warnBg }, rectRadius: 0.05 });
  s.addText("⚠️ 최종 저장 후 수정 불가!\n⚠️ 불확실하면 임시 저장 먼저!", { x: 9.2, y: 6.1, w: 3.5, h: 0.55, fontSize: 9, color: C.red, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
}

// ============================================================
// 17. 화면 네비게이션 흐름도
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "화면 이동 흐름도", "Screen Navigation Flow");
  footer(s); pageNum(s, 17);

  // 로그인 → 메인
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.0, y: 1.5, w: 3.0, h: 0.8, fill: { color: C.primary }, rectRadius: 0.1 });
  s.addText("로그인 화면", { x: 5.0, y: 1.5, w: 3.0, h: 0.8, fontSize: 14, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });

  s.addText("▼  로그인 성공", { x: 5.3, y: 2.35, w: 2.5, h: 0.35, fontSize: 10, color: C.primary, align: "center", fontFace: "맑은 고딕" });

  // 메인
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.5, y: 2.8, w: 4.0, h: 1.0, fill: { color: C.secondary }, rectRadius: 0.1 });
  s.addText("메인 화면\n(적재위치 | 스켈프 | 상차)", { x: 4.5, y: 2.8, w: 4.0, h: 1.0, fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });

  // 분기 화살표
  s.addText("▼", { x: 2.0, y: 3.85, w: 1, h: 0.35, fontSize: 14, color: C.orange, align: "center" });
  s.addText("▼", { x: 5.8, y: 3.85, w: 1, h: 0.35, fontSize: 14, color: C.cardGreen, align: "center" });
  s.addText("▼", { x: 9.5, y: 3.85, w: 1, h: 0.35, fontSize: 14, color: C.cardBlue, align: "center" });

  // 3개 기능 화면
  const funcs = [
    { name: "적재위치관리", color: C.orange, x: 0.8 },
    { name: "스켈프 투입", color: C.cardGreen, x: 4.8 },
    { name: "상차등록", color: C.cardBlue, x: 8.8 },
  ];
  funcs.forEach(f => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: f.x, y: 4.3, w: 3.5, h: 0.7, fill: { color: f.color }, rectRadius: 0.1 });
    s.addText(f.name, { x: f.x, y: 4.3, w: 3.5, h: 0.7, fontSize: 13, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });

    s.addText("← 뒤로 →", { x: f.x + 0.5, y: 5.05, w: 2.5, h: 0.3, fontSize: 9, color: f.color, align: "center", fontFace: "맑은 고딕" });
  });

  // 로그아웃 / 종료
  s.addText("로그아웃 ↗", { x: 8.5, y: 2.8, w: 2.0, h: 0.5, fontSize: 10, color: C.red, fontFace: "맑은 고딕" });
  s.addText("종료 ↙", { x: 3.2, y: 1.5, w: 1.5, h: 0.5, fontSize: 10, color: C.red, fontFace: "맑은 고딕" });

  // 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.6, w: 12.7, h: 1.3, fill: { color: "F8F9FA" }, rectRadius: 0.1, line: { color: C.lightGray, width: 1 } });
  s.addText("📌  화면 이동 요약", { x: 0.6, y: 5.65, w: 5, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "•  메인 → 기능 화면: 해당 카드를 터치\n" +
    "•  기능 화면 → 메인: [← 뒤로] 또는 [BACK] 버튼 터치\n" +
    "•  메인 → 로그인: [로그아웃] 버튼 터치\n" +
    "•  로그인 → 종료: [프로그램 종료] 버튼 터치 → 캐시 삭제 → [다시 시작]으로 재접속",
    { x: 0.6, y: 6.0, w: 12, h: 0.8, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );
}

// ============================================================
// 18. 옵션 설정 추천값
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "추천 옵션 설정", "Recommended Settings");
  footer(s); pageNum(s, 18);

  s.addText("처음 사용 시 아래와 같이 설정하면 현장 작업에 최적화됩니다.", {
    x: 0.5, y: 1.25, w: 12, h: 0.35, fontSize: 12, color: C.primary, fontFace: "맑은 고딕" });

  const recs = [
    ["설정 항목", "추천값", "이유"],
    ["화면 꺼짐 방지", "ON ✅", "바코드 스캔 대기 중 화면이 꺼지지 않도록"],
    ["글꼴 크기", "중 또는 대", "현장(야외)에서 잘 보이도록"],
    ["스캔 효과음", "ON ✅", "스캔 성공/실패를 소리로 즉시 확인"],
    ["진동 피드백", "ON ✅", "시끄러운 현장에서도 스캔 결과 인지"],
    ["다크 모드", "상황에 따라", "야간 작업 시 ON, 주간에는 OFF"],
    ["입력 딜레이", "보통 (100ms)", "스캔이 두 번 되면 '길게'로 변경"],
    ["전달용 (Oracle Ref)", "OFF ❌", "IT관리자 전용. 일반 작업자는 OFF"],
    ["이메일 전달", "OFF ❌", "IT관리자 전용. 일반 작업자는 OFF"],
  ];

  s.addTable(recs, {
    x: 0.5, y: 1.8, w: 12.3,
    fontSize: 11, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.5, 2.0, 7.8],
    rowH: [0.4, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    autoPage: false, color: C.dark,
    headerRow: true,
    firstRowFill: { color: C.primary },
    firstRowColor: C.white,
    altFill: { color: "F5F8FF" },
  });

  tipBox(s, 0.5, 6.0, 12.3, 0.5, "이 설정들은 앱을 종료해도 유지됩니다. 한 번만 설정하면 매번 바꿀 필요가 없습니다.");
  tipBox(s, 0.5, 6.6, 12.3, 0.4, "설정은 메인 화면과 각 기능 화면의 ☰ (옵션 메뉴) 에서 변경할 수 있습니다.", "info");
}

// ============================================================
// 19. 연락처 / 지원
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.darkBlue };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.accent } });

  s.addText("11. 연락처 / 지원 안내", {
    x: 0.8, y: 1.0, w: 10, h: 0.6, fontSize: 28, color: C.white, bold: true, fontFace: "맑은 고딕",
  });

  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 3, h: 0.04, fill: { color: C.accent } });

  s.addText("시스템 관련 문의 및 긴급 지원", {
    x: 0.8, y: 2.1, w: 10, h: 0.5, fontSize: 16, color: "A8D0E6", fontFace: "맑은 고딕",
  });

  const contacts = [
    { label: "시스템 접속 주소", value: "http://pda.dongasteel.co.kr", icon: "🌐" },
    { label: "담당 부서", value: "동아스틸 IT팀", icon: "🏢" },
    { label: "문의 방법", value: "내선 전화 또는 카카오톡 IT팀 그룹", icon: "📞" },
    { label: "긴급 장애 시", value: "IT팀 담당자에게 즉시 연락\n(오류 화면 캡처 첨부)", icon: "🚨" },
  ];

  contacts.forEach((c, i) => {
    const y = 3.0 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y, w: 10, h: 0.75, fill: { color: C.primary }, rectRadius: 0.1 });
    s.addText(c.icon, { x: 1.8, y, w: 0.6, h: 0.75, fontSize: 20, align: "center", valign: "middle" });
    s.addText(c.label, { x: 2.5, y, w: 2.5, h: 0.75, fontSize: 13, color: "A8D0E6", bold: true, fontFace: "맑은 고딕", valign: "middle" });
    s.addText(c.value, { x: 5.2, y, w: 6, h: 0.75, fontSize: 13, color: C.white, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.3 });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 6.2, w: 10, h: 0.7, fill: { color: C.accent }, rectRadius: 0.1 });
  s.addText("감사합니다. DA PDA 시스템과 함께 스마트한 물류 관리를 시작하세요! 📱", {
    x: 1.5, y: 6.2, w: 10, h: 0.7, fontSize: 14, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕",
  });
}

// ============================================================
const outputPath = "c:\\Users\\HDPARK\\Desktop\\da_pda\\DongaSteel_PDA_UserManual.pptx";
pptx.write("nodebuffer").then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("사용자 매뉴얼 PPT 생성 완료:", outputPath);
  console.log("파일 크기:", (buffer.length / 1024).toFixed(1), "KB");
  console.log("총 슬라이드:", TOTAL, "페이지");
}).catch(err => {
  console.error("PPT 생성 실패:", err);
});
