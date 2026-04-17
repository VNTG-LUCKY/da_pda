import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "동아스틸 IT팀";
pptx.company = "동아스틸";
pptx.subject = "DA PDA 시스템 운영·유지보수 매뉴얼";
pptx.title = "DA PDA 시스템 매뉴얼";

const C = {
  dark: "0F172A", primary: "1E3A5F", secondary: "2563EB", accent: "F59E0B",
  white: "FFFFFF", light: "F1F5F9", gray: "64748B", lightGray: "E2E8F0",
  green: "16A34A", red: "DC2626", purple: "7C3AED", orange: "EA580C",
  teal: "0D9488", indigo: "4F46E5", sky: "0EA5E9", code: "1E1E1E",
};
const TOTAL = 18;

function footer(s) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.15, w: 13.33, h: 0.35, fill: { color: C.primary } });
  s.addText("DA PDA 시스템 운영·유지보수 매뉴얼  |  Confidential", { x: 0.5, y: 7.15, w: 10, h: 0.35, fontSize: 8, color: C.white, fontFace: "맑은 고딕" });
}
function pn(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7.18, w: 1.5, h: 0.3, fontSize: 8, color: "94A3B8", align: "right" });
}
function hdr(s, title, sub) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 1.05, fill: { color: C.primary } });
  s.addText(title, { x: 0.6, y: 0.12, w: 11, h: 0.52, fontSize: 22, color: C.white, bold: true, fontFace: "맑은 고딕" });
  if (sub) s.addText(sub, { x: 0.6, y: 0.6, w: 11, h: 0.35, fontSize: 11, color: "93C5FD", fontFace: "맑은 고딕" });
}
function codeBox(s, x, y, w, h, text, title) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.code }, rectRadius: 0.1 });
  if (title) s.addText(title, { x: x + 0.15, y, w: w - 0.3, h: 0.3, fontSize: 8, color: C.accent, bold: true, fontFace: "Consolas" });
  s.addText(text, { x: x + 0.2, y: y + (title ? 0.28 : 0.08), w: w - 0.4, h: h - (title ? 0.36 : 0.16), fontSize: 9, color: "D4D4D4", fontFace: "Consolas", lineSpacingMultiple: 1.35, valign: "top" });
}
function tip(s, x, y, w, h, text, type) {
  const bg = type === "warn" ? "FEF2F2" : type === "info" ? "EFF6FF" : "FFFBEB";
  const bc = type === "warn" ? C.red : type === "info" ? C.secondary : C.accent;
  const ic = type === "warn" ? "⚠️" : type === "info" ? "ℹ️" : "💡";
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: bg }, rectRadius: 0.06, line: { color: bc, width: 1 } });
  s.addText(`${ic}  ${text}`, { x: x + 0.12, y, w: w - 0.24, h, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.25 });
}
function badge(s, x, y, n, color) {
  s.addShape(pptx.shapes.OVAL, { x, y, w: 0.4, h: 0.4, fill: { color: color || C.secondary } });
  s.addText(String(n), { x, y, w: 0.4, h: 0.4, fontSize: 13, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
}

// ============================================================
// 1. 표지
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent } });
  s.addText("DA PDA", { x: 0.8, y: 1.0, w: 5, h: 0.4, fontSize: 14, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText("시스템 운영·유지보수\n매뉴얼", { x: 0.8, y: 1.6, w: 8, h: 1.8, fontSize: 36, color: C.white, bold: true, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 3.6, w: 3, h: 0.04, fill: { color: C.accent } });
  s.addText("PDA 시스템 담당자를 위한 설치·운영·배포·유지보수 가이드", { x: 0.8, y: 3.9, w: 8, h: 0.5, fontSize: 14, color: "93C5FD", fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 4.8, w: 7.5, h: 1.2, fill: { color: C.primary }, rectRadius: 0.1 });
  s.addText(
    "프로젝트 경로:  C:\\da_pda\n" +
    "접속 주소:        http://pda.dongasteel.co.kr\n" +
    "기술 스택:        React + TypeScript / Node.js + Express / Oracle DB",
    { x: 1.0, y: 4.85, w: 7, h: 1.1, fontSize: 11, color: "93C5FD", fontFace: "Consolas", lineSpacingMultiple: 1.5 }
  );
  s.addText("2025. 03  |  동아스틸 IT팀", { x: 0.8, y: 6.3, w: 5, h: 0.4, fontSize: 12, color: C.gray, fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.0, y: 1.5, w: 3.5, h: 4.0, fill: { color: C.primary }, rectRadius: 0.2 });
  s.addText("🛠️", { x: 9.5, y: 2.0, w: 2.5, h: 1.5, fontSize: 60, align: "center", valign: "middle" });
  s.addText("System\nMaintenance\nManual", { x: 9.2, y: 3.5, w: 3.2, h: 1.5, fontSize: 14, color: "93C5FD", align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
}

// ============================================================
// 2. 목차
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "목 차", "Contents"); footer(s); pn(s, 2);
  const toc = [
    { n: "01", t: "시스템 아키텍처 개요", p: "3" },
    { n: "02", t: "개발 환경 설치 (필수 프로그램)", p: "4" },
    { n: "03", t: "프로젝트 폴더 구조", p: "5" },
    { n: "04", t: "로컬 개발 — 프론트엔드", p: "6" },
    { n: "05", t: "로컬 개발 — 백엔드", p: "7" },
    { n: "06", t: "Oracle DB 연결 설정", p: "8" },
    { n: "07", t: "환경변수(.env) 관리", p: "9" },
    { n: "08", t: "Cursor AI로 유지보수하는 방법", p: "10" },
    { n: "09", t: "요구사항 수정 프로세스", p: "11" },
    { n: "10", t: "빌드 및 서버 배포", p: "12" },
    { n: "11", t: "서버 운영 — 프론트엔드 (Port 3000)", p: "13" },
    { n: "12", t: "서버 운영 — 백엔드 (Port 6000)", p: "14" },
    { n: "13", t: "서버 운영 — Nginx (Port 80)", p: "15" },
    { n: "14", t: "APK 빌드 및 PDA 설정", p: "16" },
    { n: "15", t: "자주 발생하는 오류 및 해결", p: "17" },
    { n: "16", t: "운영 점검 체크리스트", p: "18" },
  ];
  toc.forEach((t, i) => {
    const y = 1.3 + i * 0.36;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.2, y, w: 0.55, h: 0.3, fill: { color: C.primary }, rectRadius: 0.04 });
    s.addText(t.n, { x: 1.2, y, w: 0.55, h: 0.3, fontSize: 9, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(t.t, { x: 2.0, y, w: 7, h: 0.3, fontSize: 12, color: C.dark, fontFace: "맑은 고딕" });
    s.addText(t.p, { x: 10.5, y, w: 1, h: 0.3, fontSize: 10, color: C.gray, align: "right", fontFace: "맑은 고딕" });
    if (i < toc.length - 1) s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: y + 0.32, w: 10, h: 0.008, fill: { color: C.lightGray } });
  });
}

// ============================================================
// 3. 시스템 아키텍처
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "01. 시스템 아키텍처 개요", "System Architecture"); footer(s); pn(s, 3);

  // 아키텍처 다이어그램
  const boxes = [
    { label: "PDA / 스마트폰\n(Chrome 브라우저)", x: 0.5, y: 1.6, w: 2.5, h: 0.9, color: C.teal },
    { label: "Nginx\n:80 → :3000", x: 4.0, y: 1.6, w: 2.2, h: 0.9, color: C.purple },
    { label: "프론트엔드 (React)\nstart-preview.cjs :3000", x: 7.0, y: 1.6, w: 3.0, h: 0.9, color: C.secondary },
    { label: "백엔드 (Node.js)\nExpress API :6000", x: 7.0, y: 3.0, w: 3.0, h: 0.9, color: C.green },
    { label: "Oracle DB (ERP)\n172.17.1.59:1521/DAERP", x: 7.0, y: 4.4, w: 3.0, h: 0.9, color: C.orange },
  ];
  boxes.forEach(b => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: b.color }, rectRadius: 0.08 });
    s.addText(b.label, { x: b.x, y: b.y, w: b.w, h: b.h, fontSize: 10, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 });
  });
  // 화살표
  s.addText("→", { x: 3.1, y: 1.8, w: 0.8, h: 0.5, fontSize: 20, color: C.gray, align: "center" });
  s.addText("→", { x: 6.3, y: 1.8, w: 0.7, h: 0.5, fontSize: 20, color: C.gray, align: "center" });
  s.addText("▼  /api 프록시", { x: 7.5, y: 2.55, w: 2, h: 0.4, fontSize: 9, color: C.gray, align: "center", fontFace: "맑은 고딕" });
  s.addText("▼  oracledb", { x: 7.5, y: 3.95, w: 2, h: 0.4, fontSize: 9, color: C.gray, align: "center", fontFace: "맑은 고딕" });

  // 포트 요약 테이블
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 3.0, w: 6.0, h: 3.8, fill: { color: C.light }, rectRadius: 0.12, line: { color: C.lightGray, width: 1 } });
  s.addText("📌  포트 / 서비스 구성표", { x: 0.6, y: 3.05, w: 5, h: 0.4, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const portTable = [
    ["서비스", "포트", "실행 방법", "비고"],
    ["Nginx (리버스프록시)", "80", "START-NGINX.bat", "외부 접속 창구 (DNS)"],
    ["프론트엔드 (React)", "3000", "START-SERVER.bat", "정적 파일 + API 프록시"],
    ["백엔드 (Express)", "6000", "START-SERVER.bat", "Oracle DB 연동 API"],
    ["Oracle DB (운영)", "1521", "(기존 ERP 서버)", "172.17.1.59/DAERP"],
    ["Oracle DB (개발)", "1521", "(기존 ERP 서버)", "172.17.1.56/DAERP"],
  ];
  s.addTable(portTable, {
    x: 0.4, y: 3.5, w: 5.8, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.0, 0.6, 1.6, 1.6], autoPage: false, color: C.dark,
    headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white, altFill: { color: "F0F4FF" },
  });

  // 트래픽 흐름
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 10.3, y: 1.6, w: 2.7, h: 4.3, fill: { color: "F0F9FF" }, rectRadius: 0.12, line: { color: C.sky, width: 1 } });
  s.addText("🔀  요청 흐름", { x: 10.4, y: 1.65, w: 2.4, h: 0.35, fontSize: 12, color: C.sky, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① 사용자 접속\n   pda.dongasteel.co.kr\n\n" +
    "② DNS → 서버 IP\n   61.107.76.23\n\n" +
    "③ Nginx :80\n   → :3000 프록시\n\n" +
    "④ /api 요청만\n   → :6000 프록시\n\n" +
    "⑤ 백엔드\n   → Oracle SP 호출",
    { x: 10.5, y: 2.1, w: 2.4, h: 3.5, fontSize: 8.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 }
  );
}

// ============================================================
// 4. 개발 환경 설치
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "02. 개발 환경 설치 (필수 프로그램)", "Development Environment Setup"); footer(s); pn(s, 4);

  const tools = [
    { name: "Node.js", ver: "v20 LTS 이상", url: "https://nodejs.org", desc: "프론트엔드·백엔드 실행 런타임.\nnpm(패키지 매니저) 포함.", icon: "🟢", color: C.green },
    { name: "Git", ver: "최신 버전", url: "https://git-scm.com", desc: "소스코드 버전 관리.\n서버와 소스 동기화에 사용.", icon: "🔀", color: C.orange },
    { name: "Cursor IDE", ver: "최신 버전", url: "https://cursor.sh", desc: "AI 코딩 어시스턴트 내장 IDE.\nVS Code 기반, PDA 유지보수에 사용.", icon: "🤖", color: C.purple },
    { name: "Oracle Instant Client", ver: "21c 이상", url: "oracle.com/downloads", desc: "Node.js에서 Oracle DB 연결 시 필요.\n서버·로컬 모두 설치 필요.", icon: "🗄️", color: C.red },
  ];

  tools.forEach((t, i) => {
    const y = 1.3 + i * 1.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 1.05, fill: { color: i % 2 === 0 ? "F8FAFC" : C.white }, rectRadius: 0.1, line: { color: t.color, width: 1.5 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: y + 0.08, w: 0.08, h: 0.88, fill: { color: t.color }, rectRadius: 0.03 });
    s.addText(t.icon, { x: 0.7, y, w: 0.55, h: 1.05, fontSize: 22, valign: "middle" });
    s.addText(t.name, { x: 1.4, y: y + 0.05, w: 2.5, h: 0.35, fontSize: 15, color: t.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(t.ver, { x: 1.4, y: y + 0.38, w: 2.5, h: 0.25, fontSize: 9, color: C.gray, fontFace: "맑은 고딕" });
    s.addText(t.url, { x: 1.4, y: y + 0.62, w: 2.5, h: 0.25, fontSize: 8, color: C.secondary, fontFace: "Consolas" });
    s.addText(t.desc, { x: 4.5, y, w: 4.5, h: 1.05, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.35 });
  });

  // 설치 확인 커맨드
  codeBox(s, 0.3, 6.15, 12.7, 0.85,
    "node -v          # v20.x.x 확인\nnpm -v           # 10.x.x 확인\ngit --version    # git version 2.x 확인",
    "설치 확인 명령어 (CMD / PowerShell)"
  );

  // Oracle Instant Client 설치
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.3, y: 1.3, w: 3.7, h: 4.6, fill: { color: "FEF2F2" }, rectRadius: 0.1, line: { color: C.red, width: 1.5 } });
  s.addText("⚠️  Oracle Instant Client 설치", { x: 9.5, y: 1.35, w: 3.3, h: 0.35, fontSize: 11, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① oracle.com에서\n   instantclient-basic 다운로드\n   (Windows x64 ZIP)\n\n" +
    "② 압축 해제\n   C:\\oracle\\instantclient_21_x\n\n" +
    "③ 환경변수 PATH에 추가\n   시스템 변수 → Path 편집\n   → 위 경로 추가\n\n" +
    "④ CMD 재실행 후 확인\n\n" +
    "⑤ 서버에도 동일하게 설치!",
    { x: 9.5, y: 1.75, w: 3.3, h: 4.0, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );
}

// ============================================================
// 5. 프로젝트 폴더 구조
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "03. 프로젝트 폴더 구조", "Project Directory Structure"); footer(s); pn(s, 5);

  // 좌측: client 폴더
  codeBox(s, 0.3, 1.3, 4.1, 3.6,
    "C:\\da_pda\\\n" +
    "├── client/            ← 프론트엔드\n" +
    "│   ├── src/\n" +
    "│   │   ├── pages/    ← 화면 컴포넌트\n" +
    "│   │   │   ├── Login.tsx\n" +
    "│   │   │   ├── Main.tsx\n" +
    "│   │   │   ├── LocationManagement.tsx\n" +
    "│   │   │   ├── SlittingInput.tsx\n" +
    "│   │   │   └── LoadingRegistration.tsx\n" +
    "│   │   ├── components/  ← 공통 컴포넌트\n" +
    "│   │   ├── hooks/       ← 커스텀 훅\n" +
    "│   │   ├── utils/       ← 유틸리티\n" +
    "│   │   └── App.tsx      ← 앱 진입점\n" +
    "│   ├── dist/          ← 빌드 결과물\n" +
    "│   ├── apk/           ← APK 파일\n" +
    "│   ├── start-preview.cjs ← 운영 서버\n" +
    "│   ├── START-SERVER.bat\n" +
    "│   ├── vite.config.ts\n" +
    "│   └── package.json",
    "client/ (프론트엔드)"
  );

  // 중앙: server + deploy 폴더
  codeBox(s, 4.6, 1.3, 4.0, 3.6,
    "├── server/            ← 백엔드\n" +
    "│   ├── src/\n" +
    "│   │   ├── routes/   ← API 라우트\n" +
    "│   │   │   ├── location.ts\n" +
    "│   │   │   ├── slitting.ts\n" +
    "│   │   │   ├── loading.ts\n" +
    "│   │   │   └── email.ts\n" +
    "│   │   ├── config/\n" +
    "│   │   │   └── database.ts ← DB연결\n" +
    "│   │   └── index.ts  ← 서버 진입점\n" +
    "│   ├── dist/          ← 빌드 결과물\n" +
    "│   ├── .env.development  ← 개발 환경\n" +
    "│   ├── .env.production   ← 운영 환경\n" +
    "│   ├── START-SERVER.bat\n" +
    "│   └── package.json\n" +
    "├── deploy/            ← 배포 설정\n" +
    "│   ├── nginx-pda.conf\n" +
    "│   ├── START-NGINX.bat\n" +
    "│   └── STOP-NGINX.bat\n" +
    "└── generate-*.mjs     ← PPT 스크립트",
    "server/ + deploy/"
  );

  // 우측: 주요 파일 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.8, y: 1.3, w: 4.2, h: 3.6, fill: { color: C.light }, rectRadius: 0.12 });
  s.addText("📁  주요 파일 역할", { x: 9.0, y: 1.35, w: 3.8, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });

  const files = [
    { f: "pages/*.tsx", d: "화면 컴포넌트 (수정 대상)", color: C.secondary },
    { f: "pages/*.css", d: "스타일시트 (디자인 수정)", color: C.teal },
    { f: "start-preview.cjs", d: "운영 프론트서버 스크립트", color: C.purple },
    { f: "vite.config.ts", d: "개발서버 설정 (:3000)", color: C.sky },
    { f: "routes/*.ts", d: "API (Oracle SP 호출)", color: C.green },
    { f: "config/database.ts", d: "DB 연결 풀 설정", color: C.orange },
    { f: ".env.development", d: "개발 DB (.56)", color: C.indigo },
    { f: ".env.production", d: "운영 DB (.59)", color: C.red },
    { f: "nginx-pda.conf", d: "Nginx 80→3000 프록시", color: C.purple },
    { f: "apk/da-pda.apk", d: "/download APK 제공", color: C.teal },
  ];
  files.forEach((fi, i) => {
    const y = 1.8 + i * 0.3;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.9, y: y + 0.02, w: 0.06, h: 0.22, fill: { color: fi.color }, rectRadius: 0.02 });
    s.addText(fi.f, { x: 9.1, y, w: 2.0, h: 0.28, fontSize: 7.5, color: fi.color, bold: true, fontFace: "Consolas", valign: "middle" });
    s.addText(fi.d, { x: 11.1, y, w: 1.8, h: 0.28, fontSize: 7.5, color: C.dark, fontFace: "맑은 고딕", valign: "middle" });
  });

  // 하단: 파일 수정 가이드
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.1, w: 12.7, h: 1.8, fill: { color: "F0F9FF" }, rectRadius: 0.1, line: { color: C.sky, width: 1 } });
  s.addText("📌  수정 시 참고 — 어떤 파일을 수정해야 하나?", { x: 0.5, y: 5.15, w: 8, h: 0.35, fontSize: 12, color: C.sky, bold: true, fontFace: "맑은 고딕" });
  const guide = [
    ["수정 유형", "대상 파일", "위치"],
    ["화면 UI/로직 변경", "Login.tsx, Main.tsx, LocationManagement.tsx 등", "client/src/pages/"],
    ["화면 디자인(CSS) 변경", "Login.css, Main.css, LocationManagement.css 등", "client/src/pages/"],
    ["API 로직 / SP 호출 변경", "location.ts, slitting.ts, loading.ts, email.ts", "server/src/routes/"],
    ["DB 접속 정보 변경", ".env.development, .env.production", "server/"],
    ["Nginx / DNS 변경", "nginx-pda.conf", "deploy/"],
  ];
  s.addTable(guide, {
    x: 0.4, y: 5.55, w: 12.5, fontSize: 8.5, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [2.5, 5.5, 2.5],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.sky }, firstRowColor: C.white, altFill: { color: "F5F8FF" },
  });
}

// ============================================================
// 6. 로컬 개발 — 프론트엔드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "04. 로컬 개발 — 프론트엔드", "Local Development: Frontend"); footer(s); pn(s, 6);

  s.addText("개발자 PC에서 프론트엔드를 수정·확인하는 방법입니다.", { x: 0.5, y: 1.2, w: 12, h: 0.3, fontSize: 11, color: C.primary, fontFace: "맑은 고딕" });

  // Step 1: 의존성 설치
  badge(s, 0.4, 1.65, 1, C.secondary);
  s.addText("의존성 설치 (최초 1회 또는 package.json 변경 시)", { x: 0.95, y: 1.65, w: 6, h: 0.4, fontSize: 12, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 2.1, 6.0, 0.6, "cd C:\\da_pda\\client\nnpm install", "CMD / PowerShell");

  // Step 2: 개발 서버 시작
  badge(s, 0.4, 2.85, 2, C.secondary);
  s.addText("개발 서버 시작 (Vite Hot Reload)", { x: 0.95, y: 2.85, w: 6, h: 0.4, fontSize: 12, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 3.3, 6.0, 0.6, "npm run dev\n# → http://localhost:3000 에서 확인", "개발 모드 (코드 수정 시 자동 반영)");

  // Step 3
  badge(s, 0.4, 4.05, 3, C.secondary);
  s.addText("빌드 (서버 배포용 정적 파일 생성)", { x: 0.95, y: 4.05, w: 6, h: 0.4, fontSize: 12, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 4.5, 6.0, 0.6, "npm run build\n# → client/dist/ 폴더에 빌드 결과물 생성", "프로덕션 빌드");

  // 우측: vite.config.ts 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.6, w: 6.2, h: 2.8, fill: { color: "F0F9FF" }, rectRadius: 0.1, line: { color: C.sky, width: 1 } });
  s.addText("⚙️  vite.config.ts 핵심 설정", { x: 7.0, y: 1.65, w: 5, h: 0.35, fontSize: 12, color: C.sky, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 7.0, 2.05, 5.8, 2.2,
    "export default defineConfig({\n" +
    "  plugins: [react()],\n" +
    "  server: {\n" +
    "    host: true,     // LAN 접속 허용\n" +
    "    port: 3000,\n" +
    "    proxy: {\n" +
    "      '/api': {\n" +
    "        target: 'http://localhost:5000',\n" +
    "        changeOrigin: true,\n" +
    "      },\n" +
    "    },\n" +
    "  },\n" +
    "})", "client/vite.config.ts"
  );

  // 주요 명령어 요약
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 4.6, w: 6.2, h: 2.3, fill: { color: C.light }, rectRadius: 0.1 });
  s.addText("📌  프론트엔드 명령어 요약", { x: 7.0, y: 4.65, w: 5, h: 0.35, fontSize: 12, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const feCmds = [
    ["명령어", "용도", "포트"],
    ["npm run dev", "개발 서버 (Hot Reload)", "3000"],
    ["npm run build", "프로덕션 빌드 → dist/", "-"],
    ["npm run preview", "빌드 결과 미리보기", "4173"],
    ["npm start", "운영 서버 (start-preview.cjs)", "3000"],
  ];
  s.addTable(feCmds, {
    x: 7.0, y: 5.05, w: 5.8, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [1.8, 2.5, 1.0],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white,
  });

  tip(s, 0.4, 5.4, 6.0, 0.5, "개발 모드에서는 /api 요청이 localhost:5000으로 프록시됩니다.\n별도 터미널에서 서버(백엔드)도 실행해야 API가 동작합니다.", "info");
  tip(s, 0.4, 6.0, 6.0, 0.5, "npm run dev는 코드 저장 시 즉시 반영(Hot Reload)됩니다.\n브라우저를 새로고침할 필요 없이 변경 사항을 확인할 수 있습니다.");
  tip(s, 0.4, 6.6, 6.0, 0.35, "서버 배포 시에는 반드시 npm run build 후 dist/ 폴더를 복사!", "warn");
}

// ============================================================
// 7. 로컬 개발 — 백엔드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "05. 로컬 개발 — 백엔드", "Local Development: Backend"); footer(s); pn(s, 7);

  badge(s, 0.4, 1.4, 1, C.green);
  s.addText("의존성 설치", { x: 0.95, y: 1.4, w: 5, h: 0.4, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 1.85, 6.0, 0.6, "cd C:\\da_pda\\server\nnpm install", "CMD / PowerShell");

  badge(s, 0.4, 2.6, 2, C.green);
  s.addText("개발 서버 시작 (개발 DB 연결)", { x: 0.95, y: 2.6, w: 6, h: 0.4, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 3.05, 6.0, 0.85,
    "npm run dev\n# .env.development 사용 → 172.17.1.56 (개발DB)\n# Port 5000에서 실행", "개발 모드 (ts-node-dev, 자동 재시작)");

  badge(s, 0.4, 4.1, 3, C.green);
  s.addText("빌드 (TypeScript → JavaScript)", { x: 0.95, y: 4.1, w: 6, h: 0.4, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 4.55, 6.0, 0.6, "npm run build\n# → server/dist/ 폴더에 .js 파일 생성", "프로덕션 빌드");

  badge(s, 0.4, 5.3, 4, C.green);
  s.addText("빌드본 실행 (운영 DB 연결)", { x: 0.95, y: 5.3, w: 6, h: 0.4, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.4, 5.75, 6.0, 0.6, "npm run start:prod\n# .env.production 사용 → 172.17.1.59 (운영DB)", "프로덕션 실행");

  // 우측: 명령어 비교 + API 목록
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.4, w: 6.2, h: 2.3, fill: { color: "F0FDF4" }, rectRadius: 0.1, line: { color: C.green, width: 1 } });
  s.addText("📌  백엔드 명령어 비교", { x: 7.0, y: 1.45, w: 5, h: 0.35, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  const beCmds = [
    ["명령어", "환경", "DB", "포트"],
    ["npm run dev", "개발 (ts-node-dev)", "개발 (.56)", "5000"],
    ["npm run dev:prod", "개발 (ts-node-dev)", "운영 (.59)", "5000"],
    ["npm run start", "빌드본 실행", "기본", "5000"],
    ["npm run start:prod", "빌드본 실행", "운영 (.59)", "5000"],
  ];
  s.addTable(beCmds, {
    x: 7.0, y: 1.85, w: 5.8, fontSize: 8.5, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [1.7, 1.5, 1.3, 0.8],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.green }, firstRowColor: C.white,
  });

  // API 라우트 목록
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 3.9, w: 6.2, h: 3.0, fill: { color: "EEF2FF" }, rectRadius: 0.1, line: { color: C.indigo, width: 1 } });
  s.addText("🔗  API 라우트 목록", { x: 7.0, y: 3.95, w: 5, h: 0.35, fontSize: 12, color: C.indigo, bold: true, fontFace: "맑은 고딕" });
  const apis = [
    ["경로", "파일", "기능"],
    ["/api/health", "index.ts", "서버 상태 확인"],
    ["/api/location/*", "routes/location.ts", "적재위치 관리 (SP 호출)"],
    ["/api/slitting/*", "routes/slitting.ts", "스켈프 투입 (SP/SF 호출)"],
    ["/api/loading/*", "routes/loading.ts", "상차등록 (SP 호출)"],
    ["/api/email/*", "routes/email.ts", "이메일 발송 (nodemailer)"],
    ["/api/db/test", "index.ts", "DB 연결 테스트"],
  ];
  s.addTable(apis, {
    x: 7.0, y: 4.35, w: 5.8, fontSize: 8.5, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [1.7, 1.8, 1.8],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.indigo }, firstRowColor: C.white,
  });
}

// ============================================================
// 8. Oracle DB 연결 설정
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "06. Oracle DB 연결 설정", "Oracle Database Connection"); footer(s); pn(s, 8);

  // DB 연결 구조
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.3, h: 3.5, fill: { color: "FFF7ED" }, rectRadius: 0.12, line: { color: C.orange, width: 1.5 } });
  s.addText("🗄️  DB 연결 구조", { x: 0.6, y: 1.35, w: 5, h: 0.4, fontSize: 14, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.5, 1.8, 5.9, 2.8,
    "// server/src/config/database.ts\n\n" +
    "// 환경변수에서 DB 접속 정보 로드\n" +
    "const dbUser = process.env.DB_USER       // daerp\n" +
    "const dbPassword = process.env.DB_PASSWORD // daerp#2018\n" +
    "const dbConnectString = process.env.DB_CONNECTION_STRING\n" +
    "  // 개발: 172.17.1.56:1521/DAERP\n" +
    "  // 운영: 172.17.1.59:1521/DAERP\n\n" +
    "// Oracle Thick 모드 (Instant Client 필요)\n" +
    "oracledb.initOracleClient();\n\n" +
    "// 연결 풀 설정\n" +
    "poolMin: 0, poolMax: 10, poolTimeout: 60",
    "database.ts — 핵심 코드"
  );

  // 연결 정보
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 2.0, fill: { color: C.light }, rectRadius: 0.12 });
  s.addText("📋  DB 접속 정보", { x: 7.0, y: 1.35, w: 5, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const dbInfo = [
    ["환경", "IP", "포트", "SID", "User", "Password"],
    ["개발", "172.17.1.56", "1521", "DAERP", "daerp", "daerp#2018"],
    ["운영", "172.17.1.59", "1521", "DAERP", "daerp", "daerp#2018"],
  ];
  s.addTable(dbInfo, {
    x: 7.0, y: 1.75, w: 5.8, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [0.6, 1.2, 0.5, 0.8, 0.8, 1.2],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white,
  });

  // SP/SF 목록
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 3.5, w: 6.2, h: 3.3, fill: { color: "EEF2FF" }, rectRadius: 0.12, line: { color: C.indigo, width: 1 } });
  s.addText("⚡  사용 중인 Oracle SP / SF 목록", { x: 7.0, y: 3.55, w: 5.5, h: 0.4, fontSize: 13, color: C.indigo, bold: true, fontFace: "맑은 고딕" });
  const sps = [
    ["SP/SF 명", "기능", "호출 위치"],
    ["SP_PDA_LOAD_SCAN", "적재위치 데이터 저장", "routes/location.ts"],
    ["SP_PDA_PICKING_SEL", "상차 피킹 목록 조회", "routes/loading.ts"],
    ["SP_PDA_PICKING_SAVE", "상차 피킹 데이터 저장", "routes/loading.ts"],
    ["SP_PDA_PR09080_RET", "상차 마스터 조회", "routes/loading.ts"],
    ["SF_GET_PDA_WK", "스켈프 데이터 조회", "routes/slitting.ts"],
    ["SF_GET_PDA_WK_DTL", "스켈프 상세 조회", "routes/slitting.ts"],
    ["SF_GET_PRO_LIST", "공정 목록 조회", "routes/slitting.ts"],
    ["SF_GET_WC_LIST", "작업장 목록 조회", "routes/slitting.ts"],
  ];
  s.addTable(sps, {
    x: 7.0, y: 4.0, w: 5.8, fontSize: 8, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [2.0, 1.8, 1.6],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.indigo }, firstRowColor: C.white,
  });

  // DB 연결 테스트
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.0, w: 6.3, h: 1.8, fill: { color: "F0FDF4" }, rectRadius: 0.1, line: { color: C.green, width: 1 } });
  s.addText("✅  DB 연결 테스트 방법", { x: 0.5, y: 5.05, w: 5, h: 0.35, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "백엔드 서버 실행 후 브라우저에서:\n" +
    "http://localhost:5000/api/db/test\n" +
    "→ {\"status\":\"success\"} 가 나오면 정상 연결\n\n" +
    "실패 시: Oracle Instant Client 설치 확인, .env 파일 확인",
    { x: 0.5, y: 5.4, w: 5.8, h: 1.2, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );
}

// ============================================================
// 9. 환경변수(.env) 관리
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "07. 환경변수(.env) 관리", "Environment Variables"); footer(s); pn(s, 9);

  s.addText("백엔드 서버는 NODE_ENV 값에 따라 .env 파일을 자동 선택합니다.", { x: 0.5, y: 1.2, w: 12, h: 0.3, fontSize: 11, color: C.primary, fontFace: "맑은 고딕" });

  // .env.development
  codeBox(s, 0.3, 1.65, 6.0, 2.5,
    "PORT=5000\nNODE_ENV=development\n\n" +
    "# Oracle Database (개발 DB)\n" +
    "DB_USER=daerp\n" +
    'DB_PASSWORD="daerp#2018"\n' +
    "DB_CONNECTION_STRING=172.17.1.56:1521/DAERP\n\n" +
    "# SMTP Email\n" +
    "SMTP_HOST=mail.seah.co.kr\n" +
    "SMTP_PORT=25",
    "server/.env.development  (개발 환경)"
  );

  // .env.production
  codeBox(s, 6.7, 1.65, 6.3, 2.5,
    "PORT=5000\nNODE_ENV=production\n\n" +
    "# Oracle Database (운영 DB)\n" +
    "DB_USER=daerp\n" +
    'DB_PASSWORD="daerp#2018"\n' +
    "DB_CONNECTION_STRING=172.17.1.59:1521/DAERP\n\n" +
    "# SMTP Email\n" +
    "SMTP_HOST=mail.seah.co.kr\n" +
    "SMTP_PORT=25",
    "server/.env.production  (운영 환경)"
  );

  // 환경 전환 방법
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.35, w: 12.7, h: 1.3, fill: { color: "F0F9FF" }, rectRadius: 0.1, line: { color: C.sky, width: 1 } });
  s.addText("🔄  환경 전환 원리", { x: 0.5, y: 4.4, w: 5, h: 0.35, fontSize: 13, color: C.sky, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "database.ts가 NODE_ENV 값을 읽어 .env.{NODE_ENV} 파일을 로드합니다.\n\n" +
    "• npm run dev          → NODE_ENV=development → .env.development (개발DB .56)\n" +
    "• npm run dev:prod     → NODE_ENV=production  → .env.production  (운영DB .59)\n" +
    "• npm run start:prod   → NODE_ENV=production  → .env.production  (운영DB .59)",
    { x: 0.5, y: 4.8, w: 12, h: 0.75, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  tip(s, 0.3, 5.85, 6.0, 0.5, 'DB_PASSWORD에 # 기호가 포함되어 있으므로\n반드시 큰따옴표로 감싸야 합니다: DB_PASSWORD="daerp#2018"', "warn");
  tip(s, 6.7, 5.85, 6.3, 0.5, ".env 파일은 Git에 커밋하지 않습니다.\n서버에 직접 생성하거나 별도로 관리하세요.", "warn");

  tip(s, 0.3, 6.5, 12.7, 0.45, "서버의 START-SERVER.bat은 PORT=6000으로 설정합니다. 로컬 개발 시에는 기본 5000 포트를 사용합니다.", "info");
}

// ============================================================
// 10. Cursor AI로 유지보수하는 방법
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "08. Cursor AI로 유지보수하는 방법", "Maintenance with Cursor AI"); footer(s); pn(s, 10);

  // 좌: Cursor 사용법
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.5, h: 5.6, fill: { color: "F5F3FF" }, rectRadius: 0.15, line: { color: C.purple, width: 1.5 } });
  s.addText("🤖  Cursor IDE 사용 가이드", { x: 0.6, y: 1.35, w: 5.5, h: 0.5, fontSize: 15, color: C.purple, bold: true, fontFace: "맑은 고딕" });

  const cursorSteps = [
    { t: "프로젝트 열기", d: "Cursor 실행 → File → Open Folder\n→ C:\\da_pda 폴더 선택" },
    { t: "Agent 모드 활용", d: "Ctrl+I (또는 Cmd+I) 로 AI 채팅 열기\n→ 자연어(한국어)로 수정 요청\n예: \"적재위치관리에서 칼럼 추가해줘\"" },
    { t: "Ask 모드 활용", d: "코드 이해·질문 시 사용\n예: \"이 SP_PDA_LOAD_SCAN 호출 흐름 설명해줘\"\n→ 수정 없이 코드 분석만 받기" },
    { t: "@ 참조 활용", d: "@파일명 으로 특정 파일 참조하며 대화\n@LocationManagement.tsx 이 파일에서...\n→ AI가 해당 파일 컨텍스트를 자동 인식" },
    { t: "코드 생성 후 검증", d: "AI가 생성한 코드를 Accept/Reject\nnpm run dev로 즉시 확인\n→ 오류 시 에러 메시지를 AI에 전달" },
  ];
  cursorSteps.forEach((st, i) => {
    const y = 2.0 + i * 0.92;
    badge(s, 0.5, y, i + 1, C.purple);
    s.addText(st.t, { x: 1.05, y, w: 2.5, h: 0.3, fontSize: 11, color: C.purple, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.05, y: y + 0.28, w: 5.5, h: 0.55, fontSize: 8.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 우: 유용한 프롬프트 예시
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.3, w: 6.0, h: 5.6, fill: { color: "EFF6FF" }, rectRadius: 0.15, line: { color: C.secondary, width: 1.5 } });
  s.addText("💬  유용한 프롬프트 예시", { x: 7.3, y: 1.35, w: 5, h: 0.5, fontSize: 15, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const prompts = [
    { cat: "기능 추가", ex: "\"상차등록에 인쇄 버튼을 추가하고\n클릭하면 테이블 내용을 PDF로 생성해줘\"" },
    { cat: "버그 수정", ex: "\"스켈프 투입에서 바코드 스캔 시\n아래 오류가 발생해: [오류메시지 붙여넣기]\"" },
    { cat: "디자인 수정", ex: "\"@LoadingRegistration.css\n테이블 헤더 색상을 파란색으로 변경해줘\"" },
    { cat: "SP 연동 추가", ex: "\"새로운 SP_PDA_NEW_FUNC를 호출하는\nAPI를 만들어줘. 파라미터는 [...]\"" },
    { cat: "코드 이해", ex: "\"@database.ts 이 파일의 연결 풀 구조와\n에러 처리 방식을 설명해줘\" (Ask 모드)" },
    { cat: "서버 구성", ex: "\"Nginx에서 HTTPS를 적용하려면\n어떻게 설정해야 하는지 알려줘\" (Ask 모드)" },
  ];
  prompts.forEach((p, i) => {
    const y = 2.0 + i * 0.88;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.2, y, w: 1.3, h: 0.3, fill: { color: C.secondary }, rectRadius: 0.04 });
    s.addText(p.cat, { x: 7.2, y, w: 1.3, h: 0.3, fontSize: 8, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(p.ex, { x: 7.2, y: y + 0.32, w: 5.5, h: 0.5, fontSize: 8.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });
}

// ============================================================
// 11. 요구사항 수정 프로세스
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "09. 요구사항 수정 프로세스", "Change Request Workflow"); footer(s); pn(s, 11);

  const flow = [
    { step: "1", title: "요구사항 접수", desc: "현업에서 수정/추가 요청 접수\n(예: \"바코드 칼럼 추가\", \"버튼 색상 변경\")", color: C.secondary, icon: "📝" },
    { step: "2", title: "영향 범위 파악", desc: "수정이 필요한 파일 확인\n• 화면 수정 → client/src/pages/*.tsx\n• API 수정 → server/src/routes/*.ts\n• SP 수정 → ERP 담당자 협의", color: C.purple, icon: "🔍" },
    { step: "3", title: "로컬에서 수정", desc: "Cursor AI로 코드 수정\n→ npm run dev 로 즉시 확인\n→ 프론트/백엔드 모두 로컬 테스트", color: C.teal, icon: "💻" },
    { step: "4", title: "빌드", desc: "cd client && npm run build\ncd server && npm run build\n→ dist/ 폴더에 빌드 결과물 생성", color: C.green, icon: "🔨" },
    { step: "5", title: "서버 배포", desc: "빌드 결과물을 서버에 복사\n→ 서버에서 프로세스 재시작\n(상세: 다음 페이지)", color: C.orange, icon: "🚀" },
    { step: "6", title: "현장 확인", desc: "PDA에서 접속하여 최종 확인\n→ 현업 담당자에게 완료 통보", color: C.red, icon: "✅" },
  ];

  flow.forEach((f, i) => {
    const x = 0.3 + i * 2.1;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.4, w: 1.95, h: 3.5, fill: { color: C.white }, rectRadius: 0.12, line: { color: f.color, width: 1.5 } });
    s.addShape(pptx.shapes.OVAL, { x: x + 0.65, y: 1.5, w: 0.6, h: 0.6, fill: { color: f.color } });
    s.addText(f.step, { x: x + 0.65, y: 1.5, w: 0.6, h: 0.6, fontSize: 18, color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(f.icon, { x, y: 2.2, w: 1.95, h: 0.4, fontSize: 18, align: "center" });
    s.addText(f.title, { x: x + 0.05, y: 2.6, w: 1.85, h: 0.35, fontSize: 10.5, color: f.color, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(f.desc, { x: x + 0.08, y: 3.0, w: 1.8, h: 1.7, fontSize: 8, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
    if (i < 5) s.addText("▶", { x: x + 1.95, y: 2.4, w: 0.2, h: 0.4, fontSize: 12, color: C.gray });
  });

  // 수정 빈도별 가이드
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.2, w: 12.7, h: 1.7, fill: { color: C.light }, rectRadius: 0.1 });
  s.addText("📋  수정 유형별 관련 파일 가이드", { x: 0.5, y: 5.25, w: 6, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const modGuide = [
    ["수정 유형", "관련 파일", "빌드 필요", "서버 재시작"],
    ["화면 텍스트/디자인 변경", "client/src/pages/*.tsx, *.css", "프론트 빌드", "프론트만 재시작"],
    ["API 로직 변경", "server/src/routes/*.ts", "백엔드 빌드", "백엔드만 재시작"],
    ["새 SP/SF 연동 추가", "server/src/routes/*.ts + 프론트", "양쪽 모두", "양쪽 모두 재시작"],
    ["Nginx/DNS 변경", "deploy/nginx-pda.conf", "불필요", "Nginx만 재시작"],
  ];
  s.addTable(modGuide, {
    x: 0.5, y: 5.65, w: 12.3, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [2.5, 4.0, 2.0, 2.5],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white,
  });
}

// ============================================================
// 12. 빌드 및 서버 배포
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "10. 빌드 및 서버 배포", "Build & Deploy to Server"); footer(s); pn(s, 12);

  // 로컬 빌드
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.2, h: 2.8, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1.5 } });
  s.addText("🔨  Step 1: 로컬에서 빌드", { x: 0.6, y: 1.35, w: 5, h: 0.4, fontSize: 14, color: C.green, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.5, 1.8, 5.8, 2.1,
    "# 프론트엔드 빌드\ncd C:\\da_pda\\client\nnpm run build\n# → client/dist/ 폴더 생성\n\n" +
    "# 백엔드 빌드\ncd C:\\da_pda\\server\nnpm run build\n# → server/dist/ 폴더 생성",
    "로컬 PC에서 실행"
  );

  // 서버 복사
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 2.8, fill: { color: "EFF6FF" }, rectRadius: 0.12, line: { color: C.secondary, width: 1.5 } });
  s.addText("📤  Step 2: 서버에 복사", { x: 7.1, y: 1.35, w: 5, h: 0.4, fontSize: 14, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "로컬 빌드 결과물을 서버(C:\\da_pda)에 복사합니다.\n\n" +
    "방법 1) 원격 데스크톱(RDP)으로 서버 접속 → 폴더 드래그 복사\n" +
    "방법 2) Git push → 서버에서 git pull\n" +
    "방법 3) USB 또는 공유 폴더 이용\n\n" +
    "복사 대상:\n" +
    "• client/dist/ → 서버 C:\\da_pda\\client\\dist\\\n" +
    "• server/dist/ → 서버 C:\\da_pda\\server\\dist\\",
    { x: 7.1, y: 1.85, w: 5.8, h: 2.1, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );

  // 서버 재시작
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.3, w: 12.7, h: 2.6, fill: { color: "FFF7ED" }, rectRadius: 0.12, line: { color: C.orange, width: 1.5 } });
  s.addText("🔄  Step 3: 서버에서 프로세스 재시작", { x: 0.6, y: 4.35, w: 6, h: 0.4, fontSize: 14, color: C.orange, bold: true, fontFace: "맑은 고딕" });

  codeBox(s, 0.5, 4.85, 5.8, 1.9,
    "# ① 백엔드 재시작\n" +
    "cd C:\\da_pda\\server\n" +
    "START-SERVER.bat           # 개발 모드\n" +
    "START-SERVER-PROD.bat      # 운영 모드 (빌드본)\n\n" +
    "# ② 프론트엔드 재시작\n" +
    "cd C:\\da_pda\\client\n" +
    "START-SERVER.bat           # 3000 포트",
    "서버에서 CMD 창을 열어 실행"
  );

  s.addText(
    "💡 재시작 순서\n\n" +
    "① 기존 CMD 창을 모두 닫기\n" +
    "② 백엔드 먼저 시작 (6000 포트)\n" +
    "③ 프론트엔드 시작 (3000 포트)\n" +
    "④ Nginx는 이미 실행 중이면\n   별도 재시작 불필요\n\n" +
    "⑤ 브라우저에서 접속 확인\n   http://pda.dongasteel.co.kr",
    { x: 6.8, y: 4.85, w: 5.8, h: 1.9, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );
}

// ============================================================
// 13. 서버 운영 — 프론트엔드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "11. 서버 운영 — 프론트엔드 (Port 3000)", "Server: Frontend"); footer(s); pn(s, 13);

  codeBox(s, 0.3, 1.3, 6.2, 2.5,
    "# client/START-SERVER.bat 내용:\n\n" +
    "# [1] 3000 포트 기존 프로세스 종료\n" +
    "for /f \"tokens=5\" %%a in (\n" +
    "  'netstat -ano | findstr :3000 | findstr LISTENING'\n" +
    ") do taskkill /PID %%a /F\n\n" +
    "# [2] 프론트엔드 시작\n" +
    "set PORT=3000\n" +
    "set BACKEND_URL=http://localhost:6000\n" +
    "node start-preview.cjs",
    "client/START-SERVER.bat"
  );

  codeBox(s, 6.8, 1.3, 6.2, 2.5,
    "// start-preview.cjs 주요 기능:\n\n" +
    "// 1) dist/ 폴더의 정적 파일 서빙\n" +
    "app.use(express.static(distPath));\n\n" +
    "// 2) /api → localhost:6000 프록시\n" +
    "app.use('/api', createProxyMiddleware({\n" +
    "  target: BACKEND_URL,\n" +
    "}));\n\n" +
    "// 3) /download → APK 다운로드\n" +
    "app.get('/download', ...);",
    "start-preview.cjs 핵심 구조"
  );

  // 프론트엔드 서버 점검 사항
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.0, w: 12.7, h: 2.8, fill: { color: C.light }, rectRadius: 0.12 });
  s.addText("📋  프론트엔드 서버 점검 사항", { x: 0.5, y: 4.05, w: 6, h: 0.4, fontSize: 14, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const feChecks = [
    ["점검 항목", "확인 방법", "정상 상태"],
    ["서버 실행 중", "CMD 창에서 \"Frontend: http://0.0.0.0:3000\" 확인", "로그 출력 됨"],
    ["페이지 접속", "http://서버IP:3000 브라우저 접속", "로그인 화면 표시"],
    ["API 프록시", "http://서버IP:3000/api/health", "{\"status\":\"ok\"} 응답"],
    ["APK 다운로드", "http://서버IP:3000/download", "APK 파일 다운로드 시작"],
    ["로그 확인", "client/server-log.txt 파일 확인", "오류 없음"],
  ];
  s.addTable(feChecks, {
    x: 0.5, y: 4.5, w: 12.3, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [2.0, 5.5, 3.5],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white, altFill: { color: "F5F8FF" },
  });

  tip(s, 0.3, 6.85, 12.7, 0.2, "", "info");
  s.addText("CMD 창이 닫히면 프론트 서버도 중지됩니다. 서버 재부팅 시 반드시 START-SERVER.bat 을 다시 실행해야 합니다.", { x: 0.5, y: 6.55, w: 12, h: 0.3, fontSize: 10, color: C.secondary, fontFace: "맑은 고딕" });
}

// ============================================================
// 14. 서버 운영 — 백엔드
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "12. 서버 운영 — 백엔드 (Port 6000)", "Server: Backend"); footer(s); pn(s, 14);

  codeBox(s, 0.3, 1.3, 6.2, 2.0,
    "# server/START-SERVER.bat (개발 모드)\n" +
    "set PORT=6000\n" +
    "npm run dev    # ts-node-dev (소스 수정시 자동 재시작)\n\n" +
    "# server/START-SERVER-PROD.bat (운영 모드)\n" +
    "set PORT=6000\n" +
    "npm run start  # 빌드본(dist/index.js) 실행",
    "BAT 파일 비교"
  );

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 2.0, fill: { color: "FEF2F2" }, rectRadius: 0.1, line: { color: C.red, width: 1 } });
  s.addText("⚠️  서버 포트 주의사항", { x: 7.0, y: 1.35, w: 5, h: 0.35, fontSize: 13, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 서버에서는 PORT=6000 으로 실행 (BAT에서 설정)\n" +
    "• 프론트엔드(start-preview.cjs)가 /api 요청을\n  localhost:6000으로 프록시합니다.\n" +
    "• 로컬 개발 시에는 기본 PORT=5000 사용\n  (vite proxy가 5000으로 연결)\n\n" +
    "→ 서버와 로컬의 포트가 다릅니다!",
    { x: 7.0, y: 1.8, w: 5.8, h: 1.4, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );

  // 포트 사용 중일 때
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 3.5, w: 6.2, h: 1.5, fill: { color: "FFF7ED" }, rectRadius: 0.1, line: { color: C.orange, width: 1 } });
  s.addText("🔧  포트가 이미 사용 중일 때", { x: 0.5, y: 3.55, w: 5, h: 0.35, fontSize: 12, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  codeBox(s, 0.5, 3.95, 5.8, 0.9,
    "# KILL-PORT.bat 사용\nKILL-PORT.bat 6000    # 6000번 포트 강제 종료\nKILL-PORT.bat 3000    # 3000번 포트 강제 종료",
    "server/KILL-PORT.bat"
  );

  // 백엔드 점검 사항
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.2, w: 12.7, h: 1.7, fill: { color: C.light }, rectRadius: 0.1 });
  s.addText("📋  백엔드 서버 점검 사항", { x: 0.5, y: 5.25, w: 6, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const beChecks = [
    ["점검 항목", "확인 방법", "정상 상태"],
    ["서버 실행 중", "CMD에 \"Server is running on http://0.0.0.0:6000\"", "로그 출력 됨"],
    ["DB 연결", "http://서버IP:6000/api/db/test", "{\"status\":\"success\"}"],
    ["API 응답", "http://서버IP:6000/api/health", "{\"status\":\"ok\"}"],
    ["Oracle 풀", "CMD 로그: \"Oracle DB connection pool created\"", "로그 출력 됨"],
  ];
  s.addTable(beChecks, {
    x: 0.5, y: 5.65, w: 12.3, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray }, colW: [2.0, 5.5, 3.5],
    autoPage: false, color: C.dark, headerRow: true, firstRowFill: { color: C.primary }, firstRowColor: C.white,
  });

  // 우측 하단
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 3.5, w: 6.2, h: 1.5, fill: { color: "F0FDF4" }, rectRadius: 0.1, line: { color: C.green, width: 1 } });
  s.addText("✅  서버 시작 순서 (재부팅 후)", { x: 7.0, y: 3.55, w: 5, h: 0.35, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① server 폴더에서 START-SERVER.bat 실행 (포트 6000)\n" +
    "② \"Server is running\" + \"Oracle DB pool created\" 확인\n" +
    "③ client 폴더에서 START-SERVER.bat 실행 (포트 3000)\n" +
    "④ deploy 폴더에서 START-NGINX.bat 실행 (포트 80)\n" +
    "⑤ http://pda.dongasteel.co.kr 접속하여 최종 확인",
    { x: 7.0, y: 3.95, w: 5.8, h: 1.0, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );
}

// ============================================================
// 15. 서버 운영 — Nginx
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "13. 서버 운영 — Nginx (Port 80)", "Server: Nginx Reverse Proxy"); footer(s); pn(s, 15);

  s.addText("Nginx는 외부 접속(80포트)을 내부 프론트엔드(3000포트)로 전달하는 리버스 프록시입니다.", { x: 0.5, y: 1.2, w: 12, h: 0.3, fontSize: 11, color: C.primary, fontFace: "맑은 고딕" });

  codeBox(s, 0.3, 1.65, 6.2, 2.5,
    "# deploy/nginx-pda.conf\n\n" +
    "server {\n" +
    "    listen 80;\n" +
    "    server_name pda.dongasteel.co.kr;\n\n" +
    "    location / {\n" +
    "        proxy_pass http://127.0.0.1:3000;\n" +
    "        proxy_http_version 1.1;\n" +
    "        proxy_set_header Host $host;\n" +
    "        proxy_set_header X-Real-IP $remote_addr;\n" +
    "    }\n" +
    "}",
    "nginx-pda.conf"
  );

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.65, w: 6.2, h: 2.5, fill: { color: "F0F4FF" }, rectRadius: 0.1, line: { color: C.purple, width: 1 } });
  s.addText("⚙️  Nginx 관리 명령어", { x: 7.0, y: 1.7, w: 5, h: 0.4, fontSize: 13, color: C.purple, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "시작:\n" +
    "  deploy\\START-NGINX.bat 실행\n" +
    "  (또는 nginx.exe -c \"C:\\da_pda\\deploy\\nginx-pda.conf\")\n\n" +
    "중지:\n" +
    "  deploy\\STOP-NGINX.bat 실행\n" +
    "  (또는 nginx.exe -s stop)\n\n" +
    "설정 변경 후 적용:\n" +
    "  nginx.exe -s reload",
    { x: 7.0, y: 2.15, w: 5.8, h: 1.8, fontSize: 10, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );

  // DNS 설정
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.35, w: 6.2, h: 2.5, fill: { color: "EEF2FF" }, rectRadius: 0.12, line: { color: C.indigo, width: 1.5 } });
  s.addText("🌐  DNS 설정", { x: 0.5, y: 4.4, w: 5, h: 0.4, fontSize: 13, color: C.indigo, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "도메인:  pda.dongasteel.co.kr\n" +
    "서버 IP: 61.107.76.23 (외부 IP)\n" +
    "내부 IP: 172.17.1.x (사내 네트워크)\n\n" +
    "DNS A 레코드가 서버 외부 IP를 가리키고 있어야 합니다.\n" +
    "방화벽에서 80번 포트 인바운드가 허용되어야 합니다.\n\n" +
    "DNS 변경이 필요하면 네트워크 관리자에게 요청하세요.",
    { x: 0.5, y: 4.85, w: 5.8, h: 1.8, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );

  // Nginx 설치
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 4.35, w: 6.2, h: 2.5, fill: { color: "FFF7ED" }, rectRadius: 0.12, line: { color: C.orange, width: 1.5 } });
  s.addText("📥  Nginx 설치 (최초 1회)", { x: 7.0, y: 4.4, w: 5, h: 0.4, fontSize: 13, color: C.orange, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "① https://nginx.org/en/download.html 에서\n   Windows 안정 버전 다운로드 (nginx-1.26.x.zip)\n\n" +
    "② C:\\da_pda\\ 에 압축 해제\n   → C:\\da_pda\\nginx-1.26.2\\nginx.exe 생성\n\n" +
    "③ START-NGINX.bat이 자동으로\n   nginx.exe 위치를 탐색합니다.\n\n" +
    "④ 방화벽: Windows 방화벽에서\n   80포트 인바운드 규칙 추가",
    { x: 7.0, y: 4.85, w: 5.8, h: 1.8, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 }
  );
}

// ============================================================
// 16. APK 빌드 및 PDA 설정
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "14. APK 빌드 및 PDA 설정", "APK Build & PDA Configuration"); footer(s); pn(s, 16);

  // APK 빌드
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.2, h: 3.5, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1.5 } });
  s.addText("📱  APK 빌드 방법 (Capacitor)", { x: 0.6, y: 1.35, w: 5, h: 0.45, fontSize: 14, color: C.green, bold: true, fontFace: "맑은 고딕" });

  s.addText(
    "APK는 내부적으로 서버 URL을 웹뷰로 로드하는 래퍼 앱입니다.",
    { x: 0.5, y: 1.8, w: 5.8, h: 0.3, fontSize: 9.5, color: C.gray, fontFace: "맑은 고딕" }
  );

  codeBox(s, 0.5, 2.15, 5.8, 2.5,
    "# capacitor.config.ts\nconst config = {\n  appId: 'com.dongasteel.dapda',\n  appName: 'DA PDA',\n  webDir: 'dist',\n  server: {\n    url: 'http://pda.dongasteel.co.kr:3000',\n    cleartext: true\n  }\n};\n\n" +
    "# 빌드 순서\ncd client\nnpm run build           # 프론트 빌드\nnpx cap sync android    # Capacitor 동기화\n# → Android Studio에서 APK 생성",
    "APK 빌드 핵심"
  );

  // PDA 설정
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 3.5, fill: { color: "EFF6FF" }, rectRadius: 0.12, line: { color: C.secondary, width: 1.5 } });
  s.addText("📲  PDA에 APK 설치 방법", { x: 7.1, y: 1.35, w: 5, h: 0.45, fontSize: 14, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const pdaSteps = [
    "PDA에서 Chrome 열고\nhttp://pda.dongasteel.co.kr/download 접속",
    "APK 파일 다운로드 완료 후 열기",
    "'출처를 알 수 없는 앱 설치 허용'\n(설정 → 보안에서 활성화)",
    "설치 완료 → 홈화면에 DA PDA 아이콘 생성",
    "앱 실행 → 자동으로 웹 서버에 접속",
  ];
  pdaSteps.forEach((st, i) => {
    const y = 1.95 + i * 0.55;
    badge(s, 7.0, y, i + 1, C.secondary);
    s.addText(st, { x: 7.55, y, w: 5.1, h: 0.5, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2, valign: "middle" });
  });

  // APK 파일 위치
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.0, w: 12.7, h: 1.8, fill: { color: C.light }, rectRadius: 0.1 });
  s.addText("📁  APK 파일 관리", { x: 0.5, y: 5.05, w: 5, h: 0.35, fontSize: 13, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• APK 파일 위치: client/apk/da-pda.apk\n" +
    "• 다운로드 URL: http://pda.dongasteel.co.kr/download  (또는 :3000/download)\n" +
    "• APK를 갱신하려면: 새 APK 파일을 client/apk/da-pda.apk로 덮어쓰기 → 프론트 서버 재시작\n" +
    "• 웹뷰 래퍼이므로 서버 코드만 수정하면 APK 재설치 없이 변경 사항이 반영됩니다!\n\n" +
    "※ APK 재빌드가 필요한 경우: 앱 이름 변경, 아이콘 변경, 서버 URL 변경 시에만 해당",
    { x: 0.5, y: 5.45, w: 12, h: 1.2, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );
}

// ============================================================
// 17. 자주 발생하는 오류 및 해결
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "15. 자주 발생하는 오류 및 해결", "Common Errors & Solutions"); footer(s); pn(s, 17);

  const errors = [
    { err: "EADDRINUSE: 포트 사용 중", sol: "① KILL-PORT.bat [포트번호] 실행\n② 또는 CMD: netstat -ano | findstr :포트번호 → taskkill /PID xxxx /F\n③ 기존 CMD 창이 닫히지 않았는지 확인", color: C.red },
    { err: "Oracle DB 연결 실패\n(NJS-500, ORA-12541)", sol: "① Oracle Instant Client 설치 확인 (PATH에 추가됐는지)\n② .env 파일의 DB_CONNECTION_STRING 확인\n③ 서버↔DB 서버 간 네트워크(ping) 확인\n④ DB 서버 리스너 상태 확인 (DBA에게 문의)", color: C.orange },
    { err: "npm run build 실패\n(TypeScript 오류)", sol: "① 오류 메시지 확인 (어떤 파일, 몇 번째 줄)\n② Cursor AI에 오류 메시지 전달하여 수정 요청\n③ node_modules 삭제 후 npm install 재실행", color: C.purple },
    { err: "Nginx 80 포트 사용 중", sol: "① 다른 웹서버(IIS 등)가 80포트를 사용 중인지 확인\n② netstat -ano | findstr :80 으로 PID 확인\n③ IIS를 사용 중이면 중지: iisreset /stop", color: C.teal },
    { err: "/api 요청 502 Bad Gateway", sol: "① 백엔드 서버(6000)가 실행 중인지 확인\n② CMD 창에서 백엔드 로그 확인\n③ 프론트엔드의 BACKEND_URL이 http://localhost:6000 인지 확인", color: C.secondary },
    { err: "PDA에서 접속 안됨", sol: "① 서버 방화벽 80포트 인바운드 허용 확인\n② DNS(pda.dongasteel.co.kr) → 서버IP 확인\n③ Nginx, 프론트, 백엔드 3개 모두 실행 중인지 확인\n④ PDA의 LTE/Wi-Fi 연결 상태 확인", color: C.indigo },
  ];

  errors.forEach((e, i) => {
    const y = 1.25 + i * 0.98;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y, w: 12.7, h: 0.88, fill: { color: i % 2 === 0 ? "FAFAFA" : C.white }, rectRadius: 0.06, line: { color: e.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: y + 0.06, w: 0.07, h: 0.75, fill: { color: e.color }, rectRadius: 0.02 });
    s.addText(e.err, { x: 0.65, y, w: 3.0, h: 0.88, fontSize: 9.5, color: e.color, bold: true, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.2 });
    s.addText(e.sol, { x: 3.8, y, w: 9.0, h: 0.88, fontSize: 8.5, color: C.dark, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.2 });
  });
}

// ============================================================
// 18. 운영 점검 체크리스트
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "16. 운영 점검 체크리스트", "Operations Checklist"); footer(s); pn(s, 18);

  s.addText("서버 재부팅 또는 장애 발생 시 아래 체크리스트를 순서대로 확인하세요.", { x: 0.5, y: 1.2, w: 12, h: 0.3, fontSize: 11, color: C.primary, fontFace: "맑은 고딕" });

  // 서버 시작 체크리스트
  const checks = [
    ["순서", "항목", "명령어 / 확인 방법", "정상 결과"],
    ["1", "백엔드 시작", "server\\START-SERVER.bat (또는 PROD.bat)", "\"Server running on :6000\""],
    ["2", "DB 연결 확인", "http://서버IP:6000/api/db/test", "{\"status\":\"success\"}"],
    ["3", "프론트엔드 시작", "client\\START-SERVER.bat", "\"Frontend: http://0.0.0.0:3000\""],
    ["4", "프론트 접속 확인", "http://서버IP:3000", "로그인 화면 표시"],
    ["5", "Nginx 시작", "deploy\\START-NGINX.bat", "\"Nginx 가 실행 중입니다\""],
    ["6", "외부 접속 확인", "http://pda.dongasteel.co.kr", "로그인 화면 표시"],
    ["7", "API 프록시 확인", "http://pda.dongasteel.co.kr/api/health", "{\"status\":\"ok\"}"],
    ["8", "PDA 실제 테스트", "PDA에서 접속 → 로그인 → 바코드 스캔", "정상 동작"],
  ];
  s.addTable(checks, {
    x: 0.3, y: 1.65, w: 12.7, fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.7, 1.8, 4.5, 3.2],
    autoPage: false, color: C.dark, headerRow: true,
    firstRowFill: { color: C.primary }, firstRowColor: C.white, altFill: { color: "F5F8FF" },
  });

  // 일상 점검
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.2, w: 6.2, h: 1.7, fill: { color: "F0FDF4" }, rectRadius: 0.1, line: { color: C.green, width: 1 } });
  s.addText("📅  일상 점검 사항", { x: 0.5, y: 5.25, w: 5, h: 0.35, fontSize: 12, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• CMD 창 3개 (백엔드, 프론트, Nginx) 실행 중인지 확인\n" +
    "• 서버 디스크 용량 확인 (로그 파일 누적)\n" +
    "• Oracle DB 서버 상태 확인 (ERP 담당자)\n" +
    "• PDA에서 실제 스캔 테스트 1회 수행",
    { x: 0.5, y: 5.65, w: 5.8, h: 1.1, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );

  // 긴급 대응
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 5.2, w: 6.2, h: 1.7, fill: { color: "FEF2F2" }, rectRadius: 0.1, line: { color: C.red, width: 1 } });
  s.addText("🚨  긴급 대응", { x: 7.0, y: 5.25, w: 5, h: 0.35, fontSize: 12, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 접속 불가 시: 서버 원격접속 → 3개 프로세스 확인 → 재시작\n" +
    "• DB 오류 시: server-log.txt 확인 → ERP DBA에게 공유\n" +
    "• 코드 오류 시: 오류 로그 캡처 → Cursor AI에 전달하여 수정\n" +
    "• 네트워크 오류 시: 방화벽/DNS 확인 → 네트워크 관리자 협조",
    { x: 7.0, y: 5.65, w: 5.8, h: 1.1, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );
}

// ============================================================
const outputPath = "c:\\Users\\HDPARK\\Desktop\\da_pda\\DongaSteel_PDA_SystemManual.pptx";
pptx.write("nodebuffer").then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("시스템 매뉴얼 PPT 생성 완료:", outputPath);
  console.log("파일 크기:", (buffer.length / 1024).toFixed(1), "KB");
  console.log("총 슬라이드:", TOTAL, "페이지");
}).catch(err => {
  console.error("PPT 생성 실패:", err);
});
