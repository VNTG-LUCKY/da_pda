import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "AI TF";
pptx.company = "동아스틸";
pptx.subject = "AI 활용 PDA 프로젝트 History";
pptx.title = "AI 활용 PDA 프로젝트 History";

const C = {
  dark: "0F172A",
  primary: "1E3A5F",
  secondary: "2563EB",
  accent: "F59E0B",
  white: "FFFFFF",
  light: "F1F5F9",
  gray: "64748B",
  lightGray: "E2E8F0",
  green: "16A34A",
  red: "DC2626",
  purple: "7C3AED",
  orange: "EA580C",
  teal: "0D9488",
  indigo: "4F46E5",
  sky: "0EA5E9",
};

const TOTAL = 9;

function footer(s) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.15, w: 13.33, h: 0.35, fill: { color: C.primary } });
  s.addText("AI 활용 PDA 프로젝트 History  |  AI TF", { x: 0.5, y: 7.15, w: 10, h: 0.35, fontSize: 8, color: C.white, fontFace: "맑은 고딕" });
}
function pageNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7.18, w: 1.5, h: 0.3, fontSize: 8, color: "94A3B8", align: "right", fontFace: "맑은 고딕" });
}
function hdr(s, title, sub) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 1.05, fill: { color: C.primary } });
  s.addText(title, { x: 0.6, y: 0.12, w: 11, h: 0.52, fontSize: 22, color: C.white, bold: true, fontFace: "맑은 고딕" });
  if (sub) s.addText(sub, { x: 0.6, y: 0.6, w: 11, h: 0.35, fontSize: 11, color: "93C5FD", fontFace: "맑은 고딕" });
}

// ============================================================
// 1. 표지
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent } });

  s.addText("AI TF", { x: 0.8, y: 1.0, w: 5, h: 0.4, fontSize: 14, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText("AI 활용 PDA 프로젝트\nHistory", {
    x: 0.8, y: 1.6, w: 8, h: 2.0, fontSize: 38, color: C.white, bold: true, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25,
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 3.8, w: 3, h: 0.04, fill: { color: C.accent } });
  s.addText("Cursor AI 를 활용한 실전 개발 프로세스와 성과", {
    x: 0.8, y: 4.1, w: 8, h: 0.5, fontSize: 15, color: "93C5FD", fontFace: "맑은 고딕",
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 5.2, w: 6, h: 0.55, fill: { color: C.primary }, rectRadius: 0.08 });
  s.addText("동아스틸 ERP 업무 내 PDA 시스템 프로젝트", {
    x: 0.8, y: 5.2, w: 6, h: 0.55, fontSize: 12, color: C.white, fontFace: "맑은 고딕", valign: "middle",
  });

  s.addText("2025. 03  |  AI TF", { x: 0.8, y: 6.2, w: 5, h: 0.4, fontSize: 12, color: C.gray, fontFace: "맑은 고딕" });

  // 우측 아이콘 영역
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.8, y: 1.5, w: 3.8, h: 4.2, fill: { color: C.primary }, rectRadius: 0.2 });
  const icons = ["🤖", "📱", "⚡", "🚀"];
  icons.forEach((ic, i) => {
    s.addText(ic, { x: 9.4 + (i % 2) * 1.4, y: 2.0 + Math.floor(i / 2) * 1.4, w: 1.2, h: 1.2, fontSize: 40, align: "center", valign: "middle" });
  });
  s.addText("Cursor AI × PDA", { x: 8.8, y: 4.6, w: 3.8, h: 0.5, fontSize: 13, color: "93C5FD", align: "center", fontFace: "맑은 고딕" });
}

// ============================================================
// 2. 초기 목표
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "01. 초기 목표", "Initial Goals & Background");
  footer(s); pageNum(s, 2);

  // 배경
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.3, h: 5.5, fill: { color: "F0F4FF" }, rectRadius: 0.15, line: { color: C.secondary, width: 1.5 } });
  s.addText("🎯  초기 목표", { x: 0.6, y: 1.35, w: 5, h: 0.5, fontSize: 16, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const goals = [
    { title: "AI 업무 활용 가능성 검토", desc: "AI를 실제 업무에 적용할 수 있는지\n적응 단계로서의 검토 진행", icon: "🔍", color: C.secondary },
    { title: "기존 PDA 시스템 내재화", desc: "순천공장에서 사용 중인 PDA 시스템의\n내재화 가능성을 목표로 설정\n→ 대체 가능성 확인", icon: "🏭", color: C.teal },
    { title: "기술 전환 필요", desc: "기존 Eclipse + JavaScript 환경에서\n최신 기술 스택으로의 전환 필요성 인식", icon: "🔄", color: C.purple },
    { title: "Third-party 운영 비용 절감", desc: "외부 업체 의존 비용을 줄이고\n자체 개발·유지보수 역량 확보", icon: "💰", color: C.green },
  ];

  goals.forEach((g, i) => {
    const y = 2.05 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 5.9, h: 0.95, fill: { color: C.white }, rectRadius: 0.08, line: { color: g.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: y + 0.08, w: 0.08, h: 0.78, fill: { color: g.color }, rectRadius: 0.03 });
    s.addText(g.icon, { x: 0.85, y, w: 0.55, h: 0.95, fontSize: 20, valign: "middle" });
    s.addText(g.title, { x: 1.5, y, w: 4.5, h: 0.35, fontSize: 12, color: g.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(g.desc, { x: 1.5, y: y + 0.32, w: 4.7, h: 0.6, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });

  // 우측: 기존 환경 문제점
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 5.5, fill: { color: "FEF2F2" }, rectRadius: 0.15, line: { color: C.red, width: 1.5 } });
  s.addText("⚠️  기존 환경의 문제점", { x: 7.1, y: 1.35, w: 5, h: 0.5, fontSize: 16, color: C.red, bold: true, fontFace: "맑은 고딕" });

  const problems = [
    { t: "레거시 기술 스택", d: "Eclipse + JavaScript 기반\n유지보수 어려움, 개발자 확보 난이도 높음" },
    { t: "외부 의존성", d: "Third-party 솔루션 운영\n비용 부담 및 커스터마이징 제한" },
    { t: "현장 대응 한계", d: "기능 추가/수정에 긴 리드타임\n현업 요구사항에 빠른 대응 불가" },
    { t: "기술 내재화 부족", d: "외주 개발 의존으로\n자체 기술 역량 축적 미흡" },
  ];
  problems.forEach((p, i) => {
    const y = 2.05 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y, w: 5.8, h: 0.95, fill: { color: C.white }, rectRadius: 0.08 });
    s.addText("✕", { x: 7.15, y, w: 0.4, h: 0.95, fontSize: 16, color: C.red, bold: true, valign: "middle", align: "center" });
    s.addText(p.t, { x: 7.6, y: y + 0.05, w: 4.8, h: 0.3, fontSize: 12, color: C.red, bold: true, fontFace: "맑은 고딕" });
    s.addText(p.d, { x: 7.6, y: y + 0.35, w: 4.8, h: 0.55, fontSize: 9.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });
}

// ============================================================
// 3. 목표 변경 — 좋은 기회
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "02. 좋은 기회가 생겨 목표 변경", "Goal Transition — New Opportunity");
  footer(s); pageNum(s, 3);

  // Before → After
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 5.0, h: 2.8, fill: { color: "F1F5F9" }, rectRadius: 0.15, line: { color: C.gray, width: 1 } });
  s.addText("Before — 초기 목표", { x: 0.6, y: 1.35, w: 4, h: 0.45, fontSize: 14, color: C.gray, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• AI 업무 활용 가능성 검토 단계\n" +
    "• 기존 PDA 내재화 가능성 확인\n" +
    "• 순천공장 PDA 대체 가능성 타진\n" +
    "• AI 연습 및 적응 단계",
    { x: 0.6, y: 1.9, w: 4.5, h: 1.8, fontSize: 11, color: C.gray, fontFace: "맑은 고딕", lineSpacingMultiple: 1.5 }
  );

  // 화살표
  s.addText("▶", { x: 5.5, y: 2.0, w: 0.8, h: 1.0, fontSize: 30, color: C.accent, align: "center", valign: "middle" });
  s.addText("기회\n발생!", { x: 5.4, y: 3.0, w: 1.0, h: 0.7, fontSize: 10, color: C.accent, bold: true, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.5, y: 1.3, w: 6.5, h: 2.8, fill: { color: "EFF6FF" }, rectRadius: 0.15, line: { color: C.secondary, width: 2 } });
  s.addText("After — 실전 프로젝트", { x: 6.8, y: 1.35, w: 5, h: 0.45, fontSize: 14, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 동아스틸 PDA 개발 프로젝트 제안\n" +
    "• 동아스틸 ERP 업무 내 PDA 시스템 개발 진행\n" +
    "• 기술 전환: React + TypeScript 기반 개발\n" +
    "• Cursor AI를 활용한 실전 개발 프로세스 실시\n" +
    "• AI 연습이 아닌 실전으로 바로 참여!",
    { x: 6.8, y: 1.9, w: 5.8, h: 1.8, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.5 }
  );

  // 핵심 성과
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.4, w: 12.7, h: 2.5, fill: { color: C.white }, rectRadius: 0.15, line: { color: C.accent, width: 2 } });
  s.addText("🚀  목표 변경의 핵심 포인트", { x: 0.6, y: 4.45, w: 6, h: 0.5, fontSize: 15, color: C.accent, bold: true, fontFace: "맑은 고딕" });

  const points = [
    { t: "실전 프로젝트 수행", d: "연습 단계를 넘어 실제 고객사(동아스틸) 프로젝트로 전환", color: C.secondary, icon: "🎯" },
    { t: "최신 기술 스택 적용", d: "React + TypeScript + Node.js + Vite로 완전한 기술 전환", color: C.purple, icon: "⚡" },
    { t: "센터 내 신규 매출 증대", d: "AI 활용 역량이 실제 사업 성과(매출)로 연결", color: C.green, icon: "💰" },
    { t: "AI 실전 적용 선례", d: "Cursor AI를 활용한 실전 개발 프로세스의 성공 사례 확보", color: C.orange, icon: "🤖" },
  ];
  points.forEach((p, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 5.1, w: 2.95, h: 1.6, fill: { color: "FAFAFA" }, rectRadius: 0.1, line: { color: p.color, width: 1 } });
    s.addText(p.icon, { x, y: 5.15, w: 2.95, h: 0.45, fontSize: 20, align: "center" });
    s.addText(p.t, { x: x + 0.1, y: 5.55, w: 2.75, h: 0.3, fontSize: 10.5, color: p.color, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(p.d, { x: x + 0.1, y: 5.85, w: 2.75, h: 0.7, fontSize: 8.5, color: C.dark, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });
}

// ============================================================
// 4. AI TF History — 기술 전환 여정
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "03. AI TF History — 기술 전환 여정", "Technology Evolution Journey");
  footer(s); pageNum(s, 4);

  const phases = [
    {
      phase: "Phase 1",
      title: "Kotlin 개발 시도",
      status: "장벽 발생",
      statusColor: C.red,
      color: "DC2626",
      bg: "FEF2F2",
      items: ["Android 네이티브 앱 개발 시도", "개발 환경 통일 문제 발생", "느린 에뮬레이터 속도", "팀원 간 환경 차이로 협업 어려움"],
      icon: "🚧",
      result: "중단",
    },
    {
      phase: "Phase 2",
      title: "Flutter 전환 시도",
      status: "기회 발생",
      statusColor: C.accent,
      color: "EA580C",
      bg: "FFF7ED",
      items: ["크로스 플랫폼 프레임워크 검토", "동아스틸 신규 프로젝트 제안 접수", "Flutter 학습 곡선 고려", "새로운 방향 모색의 계기"],
      icon: "🔄",
      result: "전환",
    },
    {
      phase: "Phase 3",
      title: "React Native 검토",
      status: "한계 확인",
      statusColor: C.orange,
      color: "D97706",
      bg: "FFFBEB",
      items: ["TypeScript + React Native 시도", "앱 유지보수의 한계 확인", "현장 대응 미비 (앱스토어 배포)", "업데이트 배포 절차 복잡"],
      icon: "⚠️",
      result: "보류",
    },
    {
      phase: "Phase 4",
      title: "Web-App 최종 선택",
      status: "✅ 최종 결정",
      statusColor: C.green,
      color: "16A34A",
      bg: "F0FDF4",
      items: ["TypeScript + React + Node.js", "웹 형태로 유지보수 극대화", "사용자/관리자 편의 증대", "Cursor AI 활용 최적 환경"],
      icon: "🏆",
      result: "채택",
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.3 + i * 3.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.3, w: 3.0, h: 5.3, fill: { color: p.bg }, rectRadius: 0.15, line: { color: p.color, width: 1.5 } });

    // Phase badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.1, y: 1.4, w: 1.1, h: 0.35, fill: { color: p.color }, rectRadius: 0.05 });
    s.addText(p.phase, { x: x + 0.1, y: 1.4, w: 1.1, h: 0.35, fontSize: 9, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

    // Status badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 1.3, y: 1.4, w: 1.5, h: 0.35, fill: { color: C.white }, rectRadius: 0.05, line: { color: p.statusColor, width: 1 } });
    s.addText(p.status, { x: x + 1.3, y: 1.4, w: 1.5, h: 0.35, fontSize: 8, color: p.statusColor, bold: true, align: "center", fontFace: "맑은 고딕" });

    s.addText(p.icon, { x, y: 1.9, w: 3.0, h: 0.6, fontSize: 28, align: "center" });
    s.addText(p.title, { x: x + 0.15, y: 2.55, w: 2.7, h: 0.4, fontSize: 13, color: p.color, bold: true, align: "center", fontFace: "맑은 고딕" });

    p.items.forEach((it, j) => {
      s.addText(`•  ${it}`, { x: x + 0.2, y: 3.15 + j * 0.42, w: 2.6, h: 0.38, fontSize: 9, color: C.dark, fontFace: "맑은 고딕" });
    });

    // 화살표 (마지막 제외)
    if (i < 3) {
      s.addText("→", { x: x + 3.0, y: 2.5, w: 0.3, h: 0.5, fontSize: 18, color: C.gray, valign: "middle" });
    }
  });

  // 하단 결론
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 6.7, w: 12.7, h: 0.35, fill: { color: C.green }, rectRadius: 0.08 });
  s.addText("Kotlin → Flutter → React Native → Web-App (TypeScript + React + Node.js)  ✅  최종 채택", {
    x: 0.3, y: 6.7, w: 12.7, h: 0.35, fontSize: 11, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });
}

// ============================================================
// 5. AI 주도 개발 프로세스 — Cursor AI 활용 방법
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "04. AI 주도 개발 프로세스 — Cursor AI 활용", "AI-Driven Development Process");
  footer(s); pageNum(s, 5);

  // 프로세스 흐름
  const process = [
    { step: "1", title: "요구사항\n전달", desc: "현업 요구사항을\n자연어로 Cursor에 입력\n(한국어 프롬프트)", color: C.secondary, icon: "💬" },
    { step: "2", title: "AI 코드\n생성", desc: "Cursor AI가 요구사항 기반\nReact/TypeScript 코드\n자동 생성", color: C.purple, icon: "🤖" },
    { step: "3", title: "리뷰 &\n수정", desc: "생성된 코드 검토 후\n추가 지시로 수정·보완\n반복 대화형 개발", color: C.teal, icon: "🔍" },
    { step: "4", title: "테스트 &\n배포", desc: "즉시 브라우저 확인\n현장 테스트 → 피드백\n당일 배포 가능", color: C.green, icon: "🚀" },
  ];

  process.forEach((p, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.3, w: 2.8, h: 3.0, fill: { color: C.white }, rectRadius: 0.15, line: { color: p.color, width: 2 } });
    s.addShape(pptx.shapes.OVAL, { x: x + 0.95, y: 1.4, w: 0.9, h: 0.9, fill: { color: p.color } });
    s.addText(p.step, { x: x + 0.95, y: 1.4, w: 0.9, h: 0.9, fontSize: 22, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
    s.addText(p.icon, { x, y: 2.35, w: 2.8, h: 0.45, fontSize: 22, align: "center" });
    s.addText(p.title, { x: x + 0.1, y: 2.75, w: 2.6, h: 0.5, fontSize: 12, color: p.color, bold: true, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.15 });
    s.addText(p.desc, { x: x + 0.1, y: 3.3, w: 2.6, h: 0.85, fontSize: 9, color: C.dark, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
    if (i < 3) {
      s.addText("▶", { x: x + 2.85, y: 2.3, w: 0.35, h: 0.5, fontSize: 16, color: C.accent, valign: "middle" });
    }
  });

  // Cursor AI 구체적 활용 방법
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.55, w: 12.7, h: 2.5, fill: { color: "F5F3FF" }, rectRadius: 0.15, line: { color: C.purple, width: 1.5 } });
  s.addText("🤖  Cursor AI 구체적 활용 내역", { x: 0.6, y: 4.6, w: 6, h: 0.45, fontSize: 14, color: C.purple, bold: true, fontFace: "맑은 고딕" });

  const usages = [
    { area: "프론트엔드 전체 코드", detail: "React + TypeScript 컴포넌트, 페이지 라우팅, CSS 스타일링을 대화형으로 생성", x: 0.5 },
    { area: "백엔드 API 설계·구현", detail: "Node.js + Express REST API, Oracle DB 연동 라우트 자동 생성", x: 0.5 },
    { area: "Oracle SP 연동 로직", detail: "SP_PDA_LOAD_SCAN, SP_PDA_PICKING_SEL 등 SP 호출 코드 자동화", x: 6.8 },
    { area: "UI/UX 최적화", detail: "PDA 기기 특화 UI, 다크모드, 반응형 레이아웃, 바코드 스캐너 연동", x: 6.8 },
    { area: "디버깅 · 리팩토링", detail: "오류 분석 및 수정안 즉시 제안, 코드 품질 개선", x: 0.5 },
    { area: "문서·보고서 자동 생성", detail: "PPT 결과보고서, 사용자 매뉴얼 등 PptxGenJS 스크립트 자동 작성", x: 6.8 },
  ];
  usages.forEach((u, i) => {
    const y = 5.15 + Math.floor(i / 2) * 0.55;
    const x = i % 2 === 0 ? 0.5 : 6.8;
    s.addText(`▸ ${u.area}`, { x, y, w: 2.5, h: 0.45, fontSize: 10, color: C.purple, bold: true, fontFace: "맑은 고딕", valign: "middle" });
    s.addText(u.detail, { x: x + 2.5, y, w: 3.5, h: 0.45, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", valign: "middle" });
  });
}

// ============================================================
// 6. AI 주도 개발 — 실제 개발 흐름
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "04. AI 주도 개발 — 실제 개발 흐름 상세", "Detailed AI Development Workflow");
  footer(s); pageNum(s, 6);

  // 좌측: 개발 흐름 타임라인
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.5, h: 5.5, fill: { color: "F0F9FF" }, rectRadius: 0.15, line: { color: C.sky, width: 1.5 } });
  s.addText("📋  개발 진행 흐름", { x: 0.6, y: 1.35, w: 5, h: 0.45, fontSize: 15, color: C.sky, bold: true, fontFace: "맑은 고딕" });

  const timeline = [
    { t: "프로젝트 구조 설계", d: "Cursor에 \"React+TypeScript PDA 시스템 구조 생성\" 지시\n→ Vite 프로젝트, 라우팅, 폴더 구조 자동 생성" },
    { t: "화면 단위 개발", d: "\"로그인 화면 만들어줘\" → \"적재위치관리 화면 만들어줘\"\n→ 각 페이지를 자연어 요청으로 순차 개발" },
    { t: "Oracle SP 연동", d: "SP 명세서를 Cursor에 전달 → 백엔드 API 자동 생성\n→ 프론트엔드 fetch 호출 코드도 동시에 생성" },
    { t: "현장 피드백 반영", d: "\"바코드 스캔 시 소리 나게 해줘\" \"다크모드 추가해줘\"\n→ 현업 요청을 즉시 AI에 전달하여 당일 반영" },
    { t: "테스트 · 디버깅", d: "오류 발생 시 에러 메시지를 Cursor에 붙여넣기\n→ 원인 분석 + 수정 코드 즉시 제안" },
    { t: "문서화 · 보고서", d: "\"PPT 결과보고서 만들어줘\" → PptxGenJS 코드 자동 생성\n→ 사용자 매뉴얼도 AI가 코드로 작성" },
  ];
  timeline.forEach((tl, i) => {
    const y = 1.95 + i * 0.85;
    s.addShape(pptx.shapes.OVAL, { x: 0.55, y: y + 0.05, w: 0.35, h: 0.35, fill: { color: C.sky } });
    s.addText(String(i + 1), { x: 0.55, y: y + 0.05, w: 0.35, h: 0.35, fontSize: 10, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
    if (i < 5) s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: y + 0.42, w: 0.03, h: 0.45, fill: { color: "BAE6FD" } });
    s.addText(tl.t, { x: 1.1, y, w: 5.2, h: 0.3, fontSize: 11, color: C.sky, bold: true, fontFace: "맑은 고딕" });
    s.addText(tl.d, { x: 1.1, y: y + 0.3, w: 5.5, h: 0.5, fontSize: 8.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 우측: 생산성 수치 + 프로젝트 산출물
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.3, w: 6.0, h: 2.8, fill: { color: "F0FDF4" }, rectRadius: 0.15, line: { color: C.green, width: 1.5 } });
  s.addText("📈  AI 활용 생산성 효과", { x: 7.3, y: 1.35, w: 5, h: 0.45, fontSize: 14, color: C.green, bold: true, fontFace: "맑은 고딕" });

  const metrics = [
    { label: "개발 속도", value: "3~5배 ↑", desc: "반복 코드·보일러플레이트 자동 생성" },
    { label: "디버깅 시간", value: "70% ↓", desc: "오류 원인 분석 + 수정안 즉시 제안" },
    { label: "문서화 비용", value: "80% ↓", desc: "보고서·매뉴얼 코드 자동 작성" },
    { label: "현장 대응", value: "당일 반영", desc: "현업 요청 → AI 개발 → 즉시 배포" },
  ];
  metrics.forEach((m, i) => {
    const y = 1.95 + i * 0.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.2, y, w: 1.3, h: 0.38, fill: { color: C.green }, rectRadius: 0.05 });
    s.addText(m.value, { x: 7.2, y, w: 1.3, h: 0.38, fontSize: 10, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(m.label, { x: 8.7, y, w: 1.3, h: 0.2, fontSize: 9.5, color: C.green, bold: true, fontFace: "맑은 고딕" });
    s.addText(m.desc, { x: 8.7, y: y + 0.18, w: 4.0, h: 0.2, fontSize: 8, color: C.gray, fontFace: "맑은 고딕" });
  });

  // 프로젝트 산출물
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.3, w: 6.0, h: 2.5, fill: { color: "EEF2FF" }, rectRadius: 0.15, line: { color: C.indigo, width: 1.5 } });
  s.addText("📦  프로젝트 산출물 (AI 생성)", { x: 7.3, y: 4.35, w: 5, h: 0.4, fontSize: 13, color: C.indigo, bold: true, fontFace: "맑은 고딕" });

  const outputs = [
    "프론트엔드 9개 TSX 컴포넌트 (로그인, 메인, 기능3종, 컴포넌트4종)",
    "백엔드 8개 TS 모듈 (라우트4종, 설정, DB연동)",
    "CSS 스타일시트 8개 (반응형, 다크모드 대응)",
    "Oracle SP 연동 로직 (적재위치/스켈프/상차/이메일)",
    "결과보고서 PPT 생성 스크립트 (22페이지)",
    "사용자 매뉴얼 PPT 생성 스크립트 (19페이지)",
  ];
  outputs.forEach((o, i) => {
    s.addText(`✔  ${o}`, { x: 7.3, y: 4.85 + i * 0.32, w: 5.5, h: 0.3, fontSize: 9, color: C.dark, fontFace: "맑은 고딕" });
  });
}

// ============================================================
// 7. AI 적용의 과제
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "05. AI 적용의 과제", "Challenges in AI-Driven Development");
  footer(s); pageNum(s, 7);

  s.addText("Cursor AI를 실전 프로젝트에 적용하면서 확인된 과제와 선행 조건입니다.", {
    x: 0.5, y: 1.2, w: 12, h: 0.35, fontSize: 12, color: C.primary, fontFace: "맑은 고딕",
  });

  const challenges = [
    {
      num: "1",
      title: "ERP 시스템 이해도 — 담당자 협업 필수",
      desc: "동아스틸 ERP와의 연동 작업(프로시저, 함수 등)에 있어\nERP 시스템에 대한 깊은 이해도는 AI가 대체할 수 없는 영역입니다.\nERP 담당자의 역할이 매우 크고 중요하며, 긴밀한 협업이 필수적입니다.",
      point: "AI는 코드를 생성하지만, 업무 로직과 SP 명세는 ERP 담당자의 도메인 지식에 의존",
      color: C.secondary,
      icon: "🤝",
      bg: "EFF6FF",
    },
    {
      num: "2",
      title: "프론트엔드 디자인 — 기본 문법 지식 필요",
      desc: "UI 디자인 구성에 있어 미묘한 차이가 존재하며,\nAI가 생성한 CSS/HTML을 세밀하게 조정하려면\n어느 정도의 CSS, HTML 문법 지식이 필요합니다.",
      point: "AI가 90%를 생성하더라도, 나머지 10%의 미세 조정은 개발자의 기본기가 좌우",
      color: C.purple,
      icon: "🎨",
      bg: "F5F3FF",
    },
    {
      num: "3",
      title: "서버 인프라 구성 — AI가 직접 관여 불가",
      desc: "PDA 서버의 백엔드·프론트엔드 배포 환경을 구성함에 있어\nCursor AI가 서버에 직접 접근할 수 없기 때문에\nAsk 모드로 전환하여 안내받은 내용을 일일이 따라 수행해야 합니다.",
      point: "서버 설치, 방화벽, DNS 구성, IP 설정 등 인프라 작업은 수동으로 직접 구성 필수",
      color: C.orange,
      icon: "🖥️",
      bg: "FFF7ED",
    },
    {
      num: "4",
      title: "프롬프트 역량 — AI 활용 숙련도",
      desc: "AI를 잘 활용하고, 효과적인 프롬프트를 작성하며,\nCursor의 다양한 기능(Agent/Ask/Edit 모드, @참조 등)을\n충분히 숙지해야 원하는 결과물을 정확히 구현할 수 있습니다.",
      point: "AI는 도구일 뿐, 도구를 다루는 사람의 역량이 결과물의 품질을 결정",
      color: C.teal,
      icon: "🧠",
      bg: "F0FDFA",
    },
  ];

  challenges.forEach((ch, i) => {
    const y = 1.7 + i * 1.35;
    // 카드 배경
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y, w: 12.7, h: 1.2,
      fill: { color: ch.bg }, rectRadius: 0.12,
      line: { color: ch.color, width: 1.5 },
    });
    // 좌측 넘버 뱃지
    s.addShape(pptx.shapes.OVAL, { x: 0.5, y: y + 0.1, w: 0.55, h: 0.55, fill: { color: ch.color } });
    s.addText(ch.num, { x: 0.5, y: y + 0.1, w: 0.55, h: 0.55, fontSize: 18, color: C.white, bold: true, align: "center", valign: "middle", fontFace: "맑은 고딕" });
    // 아이콘
    s.addText(ch.icon, { x: 1.2, y: y + 0.05, w: 0.5, h: 0.55, fontSize: 22, valign: "middle" });
    // 제목
    s.addText(ch.title, { x: 1.8, y: y + 0.05, w: 5.5, h: 0.35, fontSize: 13, color: ch.color, bold: true, fontFace: "맑은 고딕" });
    // 설명
    s.addText(ch.desc, { x: 1.8, y: y + 0.38, w: 5.5, h: 0.75, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
    // 우측 핵심 포인트 박스
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.5, y: y + 0.15, w: 5.3, h: 0.9,
      fill: { color: C.white }, rectRadius: 0.08,
      line: { color: ch.color, width: 1 },
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.6, y: y + 0.25, w: 0.07, h: 0.7, fill: { color: ch.color }, rectRadius: 0.03 });
    s.addText("💡 핵심", { x: 7.8, y: y + 0.18, w: 1.5, h: 0.25, fontSize: 8, color: ch.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(ch.point, { x: 7.8, y: y + 0.42, w: 4.8, h: 0.55, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 하단 요약
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 6.65, w: 12.7, h: 0.4, fill: { color: C.primary }, rectRadius: 0.08 });
  s.addText("AI는 강력한 도구이지만, 도메인 지식 · 기본 개발 역량 · 인프라 경험 · 프롬프트 숙련도가 뒷받침되어야 최대의 효과를 발휘합니다.", {
    x: 0.3, y: 6.65, w: 12.7, h: 0.4, fontSize: 10.5, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });
}

// ============================================================
// 8. 결론
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "06. 결론", "Conclusion");
  footer(s); pageNum(s, 8);

  // 두 가지 결론
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.3, h: 5.5, fill: { color: "EFF6FF" }, rectRadius: 0.15, line: { color: C.secondary, width: 2 } });
  s.addText("🔑  새로운 기회와 도전", { x: 0.6, y: 1.4, w: 5.5, h: 0.5, fontSize: 16, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  s.addText("AI 주도 개발 프로세스", { x: 0.6, y: 1.9, w: 5.5, h: 0.35, fontSize: 13, color: C.dark, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "Cursor AI 연구 및 적용을 통한 개발 효율화",
    { x: 0.6, y: 2.25, w: 5.8, h: 0.3, fontSize: 11, color: C.gray, fontFace: "맑은 고딕" }
  );

  const concl1 = [
    { t: "AI 실전 적용 검증 완료", d: "Cursor AI를 활용하여 실제 고객사 PDA 시스템을\n설계부터 배포까지 전 과정 수행", color: C.secondary },
    { t: "기술 전환 성공", d: "Eclipse + JS → React + TypeScript + Node.js\n최신 웹 기술 스택으로 완전 전환", color: C.purple },
    { t: "개발 생산성 극대화", d: "AI 코드 생성, 디버깅, 문서화를 통해\n소규모 팀으로 대규모 프로젝트 수행 입증", color: C.teal },
    { t: "기술 내재화 달성", d: "외주 의존에서 벗어나\n자체 개발·유지보수 역량 확보", color: C.green },
  ];
  concl1.forEach((c, i) => {
    const y = 2.75 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 5.9, h: 0.78, fill: { color: C.white }, rectRadius: 0.08, line: { color: c.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: y + 0.08, w: 0.08, h: 0.6, fill: { color: c.color }, rectRadius: 0.03 });
    s.addText(c.t, { x: 0.9, y: y + 0.02, w: 5.2, h: 0.3, fontSize: 11, color: c.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(c.d, { x: 0.9, y: y + 0.32, w: 5.2, h: 0.42, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 우측: 신규 매출 증대
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 5.5, fill: { color: "F0FDF4" }, rectRadius: 0.15, line: { color: C.green, width: 2 } });
  s.addText("💰  신규 매출 증대", { x: 7.1, y: 1.4, w: 5.5, h: 0.5, fontSize: 16, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText("성공적인 프로젝트 수행을 통한 기술 내재화 및 사업 확장", {
    x: 7.1, y: 1.9, w: 5.5, h: 0.35, fontSize: 11, color: C.gray, fontFace: "맑은 고딕",
  });

  const concl2 = [
    { t: "프로젝트 매출 기여", d: "AI TF 역량이 실제 매출로 연결\n센터 내 신규 사업 모델 확보", color: C.green },
    { t: "레퍼런스 확보", d: "동아스틸 PDA 프로젝트 성공 사례로\n유사 프로젝트 수주 기반 마련", color: C.secondary },
    { t: "확장 가능성", d: "동일 기술 스택으로 타 고객사·타 업무\nPDA/MES 시스템 확대 적용 가능", color: C.purple },
    { t: "조직 역량 강화", d: "AI 활용 개발 노하우 축적\n팀원 역량 향상 및 차세대 프로젝트 대비", color: C.orange },
  ];
  concl2.forEach((c, i) => {
    const y = 2.5 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y, w: 5.8, h: 0.78, fill: { color: C.white }, rectRadius: 0.08, line: { color: c.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: y + 0.08, w: 0.08, h: 0.6, fill: { color: c.color }, rectRadius: 0.03 });
    s.addText(c.t, { x: 7.4, y: y + 0.02, w: 5.2, h: 0.3, fontSize: 11, color: c.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(c.d, { x: 7.4, y: y + 0.32, w: 5.2, h: 0.42, fontSize: 9, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.25 });
  });

  // 하단 강조
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 6.65, w: 12.7, h: 0.4, fill: { color: C.accent }, rectRadius: 0.08 });
  s.addText("AI 연습 → 실전 적용 → 매출 기여 → 기술 내재화 — AI TF의 성공적인 첫 걸음 🚀", {
    x: 0.3, y: 6.65, w: 12.7, h: 0.4, fontSize: 12, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });
}

// ============================================================
// 9. 감사
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent } });

  s.addText("감사합니다", { x: 0, y: 2.0, w: 13.33, h: 1.0, fontSize: 42, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 3.2, w: 2.3, h: 0.04, fill: { color: C.accent } });
  s.addText("AI 활용 PDA 프로젝트 History", { x: 0, y: 3.5, w: 13.33, h: 0.5, fontSize: 16, color: "93C5FD", align: "center", fontFace: "맑은 고딕" });
  s.addText("Cursor AI × 동아스틸 PDA 시스템", { x: 0, y: 4.1, w: 13.33, h: 0.4, fontSize: 13, color: C.gray, align: "center", fontFace: "맑은 고딕" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 5.2, w: 6.33, h: 0.55, fill: { color: C.primary }, rectRadius: 0.08 });
  s.addText("AI TF  |  2025. 03", { x: 3.5, y: 5.2, w: 6.33, h: 0.55, fontSize: 13, color: C.white, align: "center", valign: "middle", fontFace: "맑은 고딕" });
  pageNum(s, 9);
}

// ============================================================
const outputPath = "c:\\Users\\HDPARK\\Desktop\\da_pda\\DongaSteel_PDA_AI_History.pptx";
pptx.write("nodebuffer").then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("AI History PPT 생성 완료:", outputPath);
  console.log("파일 크기:", (buffer.length / 1024).toFixed(1), "KB");
  console.log("총 슬라이드:", TOTAL, "페이지");
}).catch(err => {
  console.error("PPT 생성 실패:", err);
});
