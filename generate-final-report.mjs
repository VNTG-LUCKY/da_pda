import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "세아정보기술 AI TF";
pptx.company = "동아스틸";
pptx.subject = "동아스틸 PDA 시스템 구축 결과보고서";
pptx.title = "동아스틸 PDA 시스템 구축 결과보고서";

const C = {
  dark: "0D1B2A", primary: "1B3A5C", secondary: "2E86AB", accent: "F18F01",
  white: "FFFFFF", light: "F5F5F5", gray: "666666", lightGray: "E8E8E8",
  green: "2D936C", red: "E63946", blue: "457B9D", teal: "0D9488",
  orange: "EA580C", purple: "7C3AED",
};
const TOTAL = 14;

function ft(s) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.15, w: 13.33, h: 0.35, fill: { color: C.primary } });
  s.addText("동아스틸 PDA 시스템 구축 결과보고서", { x: 0.5, y: 7.15, w: 10, h: 0.35, fontSize: 8, color: C.white, fontFace: "맑은 고딕" });
}
function pn(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7.0, w: 1.5, h: 0.3, fontSize: 9, color: C.gray, align: "right" });
}
function hdr(s, t, sub) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 1.1, fill: { color: C.primary } });
  s.addText(t, { x: 0.6, y: 0.15, w: 11, h: 0.55, fontSize: 26, color: C.white, bold: true, fontFace: "맑은 고딕" });
  if (sub) s.addText(sub, { x: 0.6, y: 0.65, w: 11, h: 0.35, fontSize: 13, color: "A8D0E6", fontFace: "맑은 고딕" });
}

// ============================================================
// 1. 표지
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.accent } });
  s.addText("동아스틸", { x: 0.8, y: 1.0, w: 6, h: 0.6, fontSize: 20, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText("PDA 시스템 구축\n결과보고서", { x: 0.8, y: 1.8, w: 8, h: 2.2, fontSize: 42, color: C.white, bold: true, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 3.5, h: 0.04, fill: { color: C.accent } });
  s.addText("모바일 PDA로 실현하는\n스마트 물류 관리", { x: 0.8, y: 4.5, w: 7, h: 1.0, fontSize: 18, color: "A8D0E6", fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 });
  s.addText("2025. 03  |  세아정보기술 AI TF", { x: 0.8, y: 6.0, w: 5, h: 0.5, fontSize: 14, color: C.gray, fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.5, w: 4.0, h: 4.5, fill: { color: C.primary }, rectRadius: 0.15 });
  s.addText("📱", { x: 9.5, y: 2.0, w: 2, h: 2, fontSize: 80, align: "center" });
  s.addText("DA PDA\nSmart Logistics", { x: 8.8, y: 4.0, w: 3.5, h: 1.2, fontSize: 16, color: "A8D0E6", align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
}

// ============================================================
// 2. 목차
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "목 차", "Contents"); ft(s); pn(s, 2);
  const toc = [
    { n: "01", t: "프로젝트 개요", d: "추진 배경 및 목표" },
    { n: "02", t: "시스템 전체 구성", d: "PDA ↔ 서버 ↔ ERP 연결 구조" },
    { n: "03", t: "주요 기능 소개", d: "스켈프 투입 / 적재위치관리 / 상차등록" },
    { n: "04", t: "스켈프 투입 (현재 적용)", d: "현재 운영 중인 기능 상세 안내" },
    { n: "05", t: "적재위치관리", d: "적재 위치 바코드 등록 기능" },
    { n: "06", t: "상차등록", d: "출하 피킹 확인 및 등록 기능" },
    { n: "07", t: "현장 사용 편의 기능", d: "다크모드, 효과음, 글꼴 조절 등" },
    { n: "08", t: "도입 효과", d: "업무 개선 효과 및 기대 효과" },
    { n: "09", t: "현재 적용 현황", d: "스켈프 투입 적용, TAG 현황" },
    { n: "10", t: "향후 개선 및 추진 계획", d: "TAG 교체, 상차등록/적재위치 적용 일정" },
  ];
  toc.forEach((t, i) => {
    const y = 1.4 + i * 0.55;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y, w: 0.65, h: 0.45, fill: { color: C.primary }, rectRadius: 0.06 });
    s.addText(t.n, { x: 1.5, y, w: 0.65, h: 0.45, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(t.t, { x: 2.5, y, w: 4, h: 0.45, fontSize: 16, color: C.dark, bold: true, fontFace: "맑은 고딕" });
    s.addText(t.d, { x: 6.8, y, w: 5, h: 0.45, fontSize: 13, color: C.gray, fontFace: "맑은 고딕" });
    if (i < toc.length - 1) s.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y: y + 0.48, w: 9.5, h: 0.008, fill: { color: C.lightGray } });
  });
}

// ============================================================
// 3. 프로젝트 개요
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "01. 프로젝트 개요", "추진 배경 및 목표"); ft(s); pn(s, 3);

  // 추진 배경
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.3, h: 3.0, fill: { color: "F0F4F8" }, rectRadius: 0.12, line: { color: C.secondary, width: 1.5 } });
  s.addText("📋  추진 배경", { x: 0.6, y: 1.35, w: 5, h: 0.5, fontSize: 18, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  const bgs = [
    "현장 물류 업무(스켈프, 적재, 상차)에서\n수기 기록과 구두 전달에 의존",
    "실시간 데이터 확인이 어려워\n재고 파악 및 출하 관리에 시간 소요",
    "기존 시스템 노후화로\n현장 요구사항 반영이 어려운 상황",
  ];
  bgs.forEach((b, i) => {
    const y = 2.0 + i * 0.85;
    s.addText("✕", { x: 0.6, y, w: 0.4, h: 0.7, fontSize: 16, color: C.red, bold: true, valign: "middle" });
    s.addText(b, { x: 1.1, y, w: 5.2, h: 0.7, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3, valign: "middle" });
  });

  // 목표
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.3, w: 6.2, h: 3.0, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1.5 } });
  s.addText("🎯  프로젝트 목표", { x: 7.1, y: 1.35, w: 5, h: 0.5, fontSize: 18, color: C.green, bold: true, fontFace: "맑은 고딕" });
  const goals = [
    "PDA 바코드 스캔으로\n현장 물류 데이터를 실시간 ERP 반영",
    "스켈프 투입·적재위치·상차등록\n3대 핵심 업무를 모바일로 전환",
    "현장 어디서나 사용 가능한\nLTE 기반 모바일 시스템 구축",
  ];
  goals.forEach((g, i) => {
    const y = 2.0 + i * 0.85;
    s.addText("✔", { x: 7.1, y, w: 0.4, h: 0.7, fontSize: 16, color: C.green, bold: true, valign: "middle" });
    s.addText(g, { x: 7.6, y, w: 5.1, h: 0.7, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3, valign: "middle" });
  });

  // 프로젝트 정보
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.55, w: 12.7, h: 2.3, fill: { color: C.white }, rectRadius: 0.12, line: { color: C.primary, width: 1.5 } });
  s.addText("📌  프로젝트 기본 정보", { x: 0.6, y: 4.6, w: 5, h: 0.5, fontSize: 17, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  const info = [
    ["프로젝트명", "동아스틸 PDA 물류 관리 시스템"],
    ["개발 기간", "2025년 1분기"],
    ["적용 대상", "동아스틸 공장 현장 (스켈프 / 적재 / 상차 업무)"],
    ["접속 방법", "PDA 기기 또는 스마트폰에서 인터넷 접속 (별도 프로그램 설치 불필요)"],
  ];
  info.forEach((row, i) => {
    const y = 5.2 + i * 0.38;
    s.addText(row[0], { x: 0.8, y, w: 2.0, h: 0.35, fontSize: 13, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
    s.addText(row[1], { x: 3.0, y, w: 9.5, h: 0.35, fontSize: 13, color: C.dark, fontFace: "맑은 고딕" });
  });
}

// ============================================================
// 4. 시스템 전체 구성
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "02. 시스템 전체 구성", "PDA와 ERP가 연결되는 구조"); ft(s); pn(s, 4);

  s.addText("PDA에서 바코드를 스캔하면, 인터넷을 통해 즉시 ERP에 반영됩니다.", {
    x: 0.5, y: 1.25, w: 12, h: 0.4, fontSize: 15, color: C.primary, bold: true, fontFace: "맑은 고딕" });

  // 구성도 — 큰 블록 4개
  const blocks = [
    { label: "① PDA 기기\n(바코드 스캔)", x: 0.5, y: 2.0, w: 2.8, h: 1.5, color: C.teal, icon: "📱" },
    { label: "② 인터넷 전송\n(LTE 통신)", x: 4.0, y: 2.0, w: 2.8, h: 1.5, color: C.secondary, icon: "🌐" },
    { label: "③ PDA 서버\n(데이터 중계)", x: 7.5, y: 2.0, w: 2.8, h: 1.5, color: C.purple, icon: "🖥️" },
    { label: "④ ERP 시스템\n(최종 저장)", x: 10.3, y: 2.0, w: 2.7, h: 1.5, color: C.accent, icon: "🗄️" },
  ];
  blocks.forEach((b, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: b.color }, rectRadius: 0.12 });
    s.addText(b.icon, { x: b.x, y: b.y + 0.1, w: b.w, h: 0.5, fontSize: 26, align: "center" });
    s.addText(b.label, { x: b.x, y: b.y + 0.6, w: b.w, h: 0.8, fontSize: 13, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
    if (i < 3) s.addText("▶", { x: b.x + b.w, y: b.y + 0.4, w: 0.7, h: 0.5, fontSize: 22, color: C.gray, align: "center" });
  });

  // 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 3.8, w: 12.7, h: 3.0, fill: { color: "F8FAFC" }, rectRadius: 0.12, line: { color: C.lightGray, width: 1 } });
  s.addText("💡  이런 점이 좋아졌습니다!", { x: 0.6, y: 3.85, w: 5, h: 0.5, fontSize: 17, color: C.accent, bold: true, fontFace: "맑은 고딕" });

  const benefits = [
    { title: "별도 프로그램 설치 불필요", desc: "인터넷 브라우저만 있으면 바로 사용 가능\nPDA, 스마트폰, 태블릿 모두 지원", color: C.secondary },
    { title: "LTE 통신으로 어디서나 사용", desc: "Wi-Fi가 없는 야적장, 창고에서도\nLTE 신호만 있으면 즉시 사용 가능", color: C.green },
    { title: "스캔 즉시 ERP 반영", desc: "바코드 스캔과 동시에 ERP에 데이터가 저장\n수기 입력 과정이 완전히 제거됨", color: C.accent },
    { title: "업데이트가 즉시 반영", desc: "사용자가 아무것도 할 필요 없이\n서버 업데이트만으로 최신 기능 자동 적용", color: C.purple },
  ];
  benefits.forEach((b, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 4.5, w: 2.9, h: 2.0, fill: { color: C.white }, rectRadius: 0.1, line: { color: b.color, width: 1.5 } });
    s.addText(b.title, { x: x + 0.15, y: 4.55, w: 2.6, h: 0.45, fontSize: 13, color: b.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(b.desc, { x: x + 0.15, y: 5.05, w: 2.6, h: 1.3, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 });
  });
}

// ============================================================
// 5. 주요 기능 소개
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "03. 주요 기능 소개", "PDA로 처리하는 3대 핵심 업무"); ft(s); pn(s, 5);

  const funcs = [
    {
      title: "스켈프 투입",
      status: "✅ 현재 적용 중",
      statusColor: C.green,
      desc: "스켈프 공정에 투입되는 코일의\n바코드를 스캔하여 투입 실적을\nERP에 실시간 등록합니다.",
      steps: "공정/작업장 선택 → 바코드 스캔 → 자동 저장",
      color: C.green,
      icon: "🔧",
      bg: "F0FDF4",
    },
    {
      title: "적재위치관리",
      status: "⏳ TAG 교체 후 적용",
      statusColor: C.accent,
      desc: "자재의 적재 위치를 바코드 스캔으로\n등록합니다. 어떤 자재가 어디에\n있는지 ERP에서 바로 확인 가능합니다.",
      steps: "적재대 선택 → 자재 바코드 스캔 → 위치 저장",
      color: C.accent,
      icon: "📦",
      bg: "FFFBEB",
    },
    {
      title: "상차등록",
      status: "⏳ TAG 교체 후 적용",
      statusColor: C.accent,
      desc: "출하 지시에 따라 상차할 품목의\n바코드를 스캔하여 피킹 확인 및\n출하 등록을 수행합니다.",
      steps: "지시번호 조회 → 바코드 스캔 → 출하 저장",
      color: C.blue,
      icon: "🚛",
      bg: "EFF6FF",
    },
  ];

  funcs.forEach((f, i) => {
    const x = 0.3 + i * 4.25;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.3, w: 4.05, h: 5.5, fill: { color: f.bg }, rectRadius: 0.15, line: { color: f.color, width: 2 } });
    s.addText(f.icon, { x, y: 1.5, w: 4.05, h: 0.7, fontSize: 36, align: "center" });
    s.addText(f.title, { x: x + 0.2, y: 2.3, w: 3.65, h: 0.5, fontSize: 20, color: f.color, bold: true, align: "center", fontFace: "맑은 고딕" });

    // 상태 뱃지
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.5, y: 2.9, w: 3.05, h: 0.45, fill: { color: f.statusColor }, rectRadius: 0.06 });
    s.addText(f.status, { x: x + 0.5, y: 2.9, w: 3.05, h: 0.45, fontSize: 13, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

    s.addText(f.desc, { x: x + 0.3, y: 3.55, w: 3.45, h: 1.5, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.2, y: 5.2, w: 3.65, h: 0.6, fill: { color: C.white }, rectRadius: 0.06, line: { color: f.color, width: 1 } });
    s.addText("📋 " + f.steps, { x: x + 0.3, y: 5.2, w: 3.45, h: 0.6, fontSize: 10.5, color: f.color, fontFace: "맑은 고딕", valign: "middle", lineSpacingMultiple: 1.2 });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.2, y: 6.0, w: 3.65, h: 0.6, fill: { color: f.color }, rectRadius: 0.06 });
    s.addText("ERP에 실시간 저장", { x: x + 0.2, y: 6.0, w: 3.65, h: 0.6, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  });
}

// ============================================================
// 6. 스켈프 투입 (현재 적용)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "04. 스켈프 투입 (현재 운영 중)", "바코드 스캔으로 투입 실적을 자동 등록"); ft(s); pn(s, 6);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 12.7, h: 0.55, fill: { color: C.green }, rectRadius: 0.08 });
  s.addText("✅  현재 동아스틸 공장에서 실제 운영 중인 기능입니다.", {
    x: 0.3, y: 1.3, w: 12.7, h: 0.55, fontSize: 15, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

  // 사용 절차
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.1, w: 7.5, h: 4.7, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1.5 } });
  s.addText("📋  사용 절차", { x: 0.6, y: 2.15, w: 5, h: 0.5, fontSize: 17, color: C.green, bold: true, fontFace: "맑은 고딕" });

  const steps = [
    { n: "1", t: "일자 확인", d: "오늘 날짜가 자동으로 선택되어 있습니다." },
    { n: "2", t: "공정 · 작업장 · 근무조 선택", d: "드롭다운 메뉴에서 해당 항목을 선택합니다." },
    { n: "3", t: "기존 데이터 불러오기", d: "[조회] 버튼을 터치하면 이미 등록된 데이터를 불러옵니다.\n(이어서 작업할 때 사용)" },
    { n: "4", t: "바코드 스캔", d: "PDA 스캐너로 코일 바코드를 스캔합니다.\n→ 순번이 자동으로 부여되고 목록에 추가됩니다." },
    { n: "5", t: "저장", d: "[저장] 버튼을 터치하면 ERP에 바로 저장됩니다." },
  ];
  steps.forEach((st, i) => {
    const y = 2.8 + i * 0.78;
    s.addShape(pptx.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: C.green } });
    s.addText(st.n, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 15, color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(st.t, { x: 1.15, y, w: 3.5, h: 0.35, fontSize: 14, color: C.green, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.15, y: y + 0.32, w: 6.4, h: 0.4, fontSize: 11, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2 });
  });

  // 우측: 특징
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 2.1, w: 5.0, h: 4.7, fill: { color: "EFF6FF" }, rectRadius: 0.12, line: { color: C.blue, width: 1.5 } });
  s.addText("💡  주요 특징", { x: 8.3, y: 2.15, w: 4.5, h: 0.5, fontSize: 17, color: C.blue, bold: true, fontFace: "맑은 고딕" });

  const features = [
    "같은 바코드를 두 번 스캔하면\n자동으로 중복 알림 → 오류 방지",
    "스캔 성공 시 '삐' 소리,\n실패 시 '삐삐' 소리로 즉시 확인",
    "잘못 스캔한 항목은\n터치하여 선택 후 [삭제] 가능",
    "[조회] 기능으로 이전에 스캔한\n데이터를 불러와 이어서 작업 가능",
    "다크 모드(어두운 화면) 지원으로\n야간 작업 시 눈 피로 감소",
  ];
  features.forEach((f, i) => {
    const y = 2.8 + i * 0.88;
    s.addText("✔", { x: 8.3, y, w: 0.4, h: 0.75, fontSize: 15, color: C.green, bold: true, valign: "middle" });
    s.addText(f, { x: 8.8, y, w: 4.0, h: 0.75, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35, valign: "middle" });
  });
}

// ============================================================
// 7. 적재위치관리
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "05. 적재위치관리", "자재가 어디에 있는지 바코드로 등록"); ft(s); pn(s, 7);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 12.7, h: 0.55, fill: { color: C.accent }, rectRadius: 0.08 });
  s.addText("⏳  프로그램 완성 — TAG 교체 후 현장 적용 예정", {
    x: 0.3, y: 1.3, w: 12.7, h: 0.55, fontSize: 15, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.1, w: 7.5, h: 4.7, fill: { color: "FFFBEB" }, rectRadius: 0.12, line: { color: C.accent, width: 1.5 } });
  s.addText("📋  사용 절차", { x: 0.6, y: 2.15, w: 5, h: 0.5, fontSize: 17, color: C.accent, bold: true, fontFace: "맑은 고딕" });

  const locSteps = [
    { n: "1", t: "적재대 선택", d: "적재대 QR코드를 스캔하거나\n드롭다운 메뉴에서 적재대 구분/번호를 선택합니다." },
    { n: "2", t: "자재 바코드 스캔", d: "해당 적재대에 놓인 자재의 바코드를 스캔합니다.\n→ 자재 정보(배치번호, 품목, 본수 등)가 자동 입력됩니다." },
    { n: "3", t: "본수 확인", d: "바코드에서 읽은 본수가 맞으면 그대로 진행,\n다르면 [본수변경] 모드에서 직접 수정 가능합니다." },
    { n: "4", t: "저장", d: "[저장] 버튼을 터치하면\n\"이 자재가 이 적재대에 있다\"는 정보가 ERP에 저장됩니다." },
  ];
  locSteps.forEach((st, i) => {
    const y = 2.8 + i * 1.0;
    s.addShape(pptx.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: C.accent } });
    s.addText(st.n, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 15, color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(st.t, { x: 1.15, y, w: 3.5, h: 0.35, fontSize: 14, color: C.accent, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.15, y: y + 0.35, w: 6.4, h: 0.55, fontSize: 11.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });

  // 우측
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 2.1, w: 5.0, h: 2.3, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1 } });
  s.addText("✅  기대 효과", { x: 8.3, y: 2.15, w: 4, h: 0.45, fontSize: 16, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• \"이 자재 어디에 있지?\" 질문이 사라짐\n\n" +
    "• ERP에서 적재 위치 실시간 조회 가능\n\n" +
    "• 재고 조사 시간 대폭 단축\n\n" +
    "• 출하 시 자재 찾는 시간 절감",
    { x: 8.3, y: 2.65, w: 4.5, h: 1.5, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 4.6, w: 5.0, h: 2.2, fill: { color: "FEF2F2" }, rectRadius: 0.12, line: { color: C.red, width: 1 } });
  s.addText("⚠️  현재 상황", { x: 8.3, y: 4.65, w: 4, h: 0.45, fontSize: 16, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "기존 TAG(구TAG)의 QR코드에는\n배치번호만 있어 자재 식별 정보가 부족합니다.\n\n" +
    "신규 TAG에는 충분한 정보가 포함되어\nTAG 교체가 완료되면 바로 사용 가능합니다.",
    { x: 8.3, y: 5.15, w: 4.5, h: 1.4, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );
}

// ============================================================
// 8. 상차등록
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "06. 상차등록", "출하 지시에 따른 피킹 확인 및 등록"); ft(s); pn(s, 8);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 12.7, h: 0.55, fill: { color: C.accent }, rectRadius: 0.08 });
  s.addText("⏳  프로그램 완성 — TAG 교체 후 현장 적용 예정", {
    x: 0.3, y: 1.3, w: 12.7, h: 0.55, fontSize: 15, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.1, w: 7.5, h: 4.7, fill: { color: "EFF6FF" }, rectRadius: 0.12, line: { color: C.blue, width: 1.5 } });
  s.addText("📋  사용 절차", { x: 0.6, y: 2.15, w: 5, h: 0.5, fontSize: 17, color: C.blue, bold: true, fontFace: "맑은 고딕" });

  const loadSteps = [
    { n: "1", t: "상차지시번호 입력", d: "7자리 상차지시번호를 입력하면\n자동으로 해당 지시의 출하 품목 목록이 표시됩니다." },
    { n: "2", t: "바코드 스캔 (피킹)", d: "출하할 품목의 바코드를 하나씩 스캔합니다.\n→ 해당 품목과 자동 매칭되어 피킹 확인이 됩니다." },
    { n: "3", t: "완료 확인", d: "모든 품목의 피킹이 완료되면 자동으로 ✔ 체크\n계획 수량과 실제 수량이 일치하는지 한눈에 확인 가능" },
    { n: "4", t: "저장", d: "[임시저장] → 작업 중단 시 (나중에 이어서 가능)\n[최종저장] → 모든 피킹 완료 시 ERP에 확정 저장" },
  ];
  loadSteps.forEach((st, i) => {
    const y = 2.8 + i * 1.0;
    s.addShape(pptx.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: C.blue } });
    s.addText(st.n, { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 15, color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(st.t, { x: 1.15, y, w: 3.5, h: 0.35, fontSize: 14, color: C.blue, bold: true, fontFace: "맑은 고딕" });
    s.addText(st.d, { x: 1.15, y: y + 0.35, w: 6.4, h: 0.55, fontSize: 11.5, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });

  // 우측
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 2.1, w: 5.0, h: 2.3, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 1 } });
  s.addText("✅  기대 효과", { x: 8.3, y: 2.15, w: 4, h: 0.45, fontSize: 16, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 출하 지시 대비 실제 상차 수량 실시간 대조\n\n" +
    "• 오출하(잘못 실어 보내는 것) 방지\n\n" +
    "• 상차 현황을 사무실에서 실시간 확인\n\n" +
    "• 출하 완료 후 별도 보고 과정 불필요",
    { x: 8.3, y: 2.65, w: 4.5, h: 1.5, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 4.6, w: 5.0, h: 2.2, fill: { color: "FEF2F2" }, rectRadius: 0.12, line: { color: C.red, width: 1 } });
  s.addText("⚠️  현재 상황", { x: 8.3, y: 4.65, w: 4, h: 0.45, fontSize: 16, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "프로그램은 완성되었으나\n기존 TAG의 QR코드 정보 부족으로\n현장 테스트가 어려운 상황입니다.\n\n" +
    "신규 TAG 적용이 완료되면\n담당자가 재방문하여 지원 예정입니다.",
    { x: 8.3, y: 5.15, w: 4.5, h: 1.4, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4 }
  );
}

// ============================================================
// 9. 현장 사용 편의 기능
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "07. 현장 사용 편의 기능", "현장 작업자를 위한 맞춤 기능"); ft(s); pn(s, 9);

  const convs = [
    { name: "다크 모드 (어두운 화면)", desc: "야간 작업 시 눈의 피로를 줄여주는\n어두운 배경 화면으로 전환", icon: "🌙", color: "818CF8" },
    { name: "글꼴 크기 조절", desc: "글씨가 잘 안보일 때\n소 / 중 / 대 3단계로 크기 조절", icon: "🔤", color: C.gray },
    { name: "효과음 알림", desc: "바코드 스캔 성공 시 '삐',\n실패 시 '삐삐' 소리로 즉시 확인", icon: "🔊", color: C.blue },
    { name: "진동 알림", desc: "시끄러운 현장에서도\n스캔 결과를 진동으로 확인 가능", icon: "📳", color: C.accent },
    { name: "화면 꺼짐 방지", desc: "스캔 대기 중 PDA 화면이\n자동으로 꺼지지 않도록 설정", icon: "🖥️", color: C.green },
    { name: "메뉴 순서 변경", desc: "자주 쓰는 기능을\n맨 위로 올려서 빠르게 접근", icon: "↕️", color: C.teal },
    { name: "스캔 이력 확인", desc: "오늘 몇 건 스캔했는지,\n성공/오류 통계를 한눈에 확인", icon: "📊", color: "6366F1" },
    { name: "저장 이력 확인", desc: "ERP에 저장 성공한 이력을\n날짜별로 확인 가능", icon: "💾", color: C.green },
  ];

  convs.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 6.5;
    const y = 1.4 + row * 1.35;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 6.3, h: 1.15, fill: { color: row % 2 === 0 ? "F8FAFC" : C.white }, rectRadius: 0.1, line: { color: c.color, width: 1 } });
    s.addText(c.icon, { x: x + 0.15, y, w: 0.7, h: 1.15, fontSize: 24, valign: "middle", align: "center" });
    s.addText(c.name, { x: x + 0.9, y: y + 0.05, w: 5.0, h: 0.4, fontSize: 14, color: c.color, bold: true, fontFace: "맑은 고딕" });
    s.addText(c.desc, { x: x + 0.9, y: y + 0.45, w: 5.0, h: 0.6, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 6.85, w: 12.7, h: 0.2, fill: { color: C.green }, rectRadius: 0.04 });
  s.addText("모든 설정은 한 번만 설정하면 자동 저장되며, 매번 다시 설정할 필요가 없습니다.", {
    x: 0.5, y: 6.5, w: 12, h: 0.35, fontSize: 13, color: C.green, bold: true, fontFace: "맑은 고딕" });
}

// ============================================================
// 10. 도입 효과
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "08. 도입 효과", "PDA 시스템 도입으로 달라지는 것들"); ft(s); pn(s, 10);

  // Before vs After
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 6.0, h: 3.0, fill: { color: "FEF2F2" }, rectRadius: 0.12, line: { color: C.red, width: 2 } });
  s.addText("❌  기존 방식 (Before)", { x: 0.6, y: 1.35, w: 5, h: 0.5, fontSize: 17, color: C.red, bold: true, fontFace: "맑은 고딕" });
  const befores = [
    "수기로 기록 후 사무실에서 ERP 입력",
    "자재 위치를 사람의 기억에 의존",
    "출하 시 수량 확인을 수작업으로 대조",
    "실시간 재고 파악이 어려움",
    "데이터 입력 오류 발생 가능",
  ];
  befores.forEach((b, i) => {
    s.addText(`✕  ${b}`, { x: 0.8, y: 2.0 + i * 0.42, w: 5.2, h: 0.38, fontSize: 13, color: C.dark, fontFace: "맑은 고딕" });
  });

  // 화살표
  s.addText("▶", { x: 6.3, y: 2.3, w: 0.7, h: 0.8, fontSize: 28, color: C.accent, align: "center", valign: "middle" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.3, w: 6.0, h: 3.0, fill: { color: "F0FDF4" }, rectRadius: 0.12, line: { color: C.green, width: 2 } });
  s.addText("✅  PDA 도입 후 (After)", { x: 7.3, y: 1.35, w: 5, h: 0.5, fontSize: 17, color: C.green, bold: true, fontFace: "맑은 고딕" });
  const afters = [
    "바코드 스캔 즉시 ERP에 자동 저장",
    "적재 위치를 ERP에서 실시간 조회",
    "출하 지시 대비 자동 수량 대조",
    "현장 데이터가 즉시 ERP에 반영",
    "바코드 기반으로 입력 오류 원천 차단",
  ];
  afters.forEach((a, i) => {
    s.addText(`✔  ${a}`, { x: 7.3, y: 2.0 + i * 0.42, w: 5.2, h: 0.38, fontSize: 13, color: C.dark, fontFace: "맑은 고딕" });
  });

  // 기대 효과 수치
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.6, w: 12.7, h: 2.2, fill: { color: C.white }, rectRadius: 0.12, line: { color: C.secondary, width: 1.5 } });
  s.addText("📈  기대 효과 요약", { x: 0.6, y: 4.65, w: 5, h: 0.5, fontSize: 17, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  const effects = [
    { title: "수기 입력 제거", value: "0건", desc: "바코드 스캔이\n수작업을 대체", color: C.green },
    { title: "데이터 반영", value: "실시간", desc: "스캔 즉시\nERP에 저장", color: C.secondary },
    { title: "자재 찾는 시간", value: "대폭 단축", desc: "적재위치를\nERP에서 바로 확인", color: C.accent },
    { title: "오출하 위험", value: "최소화", desc: "지시 대비 수량\n자동 대조 확인", color: C.red },
  ];
  effects.forEach((e, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 5.25, w: 2.95, h: 1.35, fill: { color: "F8FAFC" }, rectRadius: 0.1, line: { color: e.color, width: 1 } });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.5, y: 5.35, w: 1.95, h: 0.4, fill: { color: e.color }, rectRadius: 0.05 });
    s.addText(e.value, { x: x + 0.5, y: 5.35, w: 1.95, h: 0.4, fontSize: 14, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(e.title, { x, y: 5.8, w: 2.95, h: 0.3, fontSize: 12, color: e.color, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(e.desc, { x, y: 6.1, w: 2.95, h: 0.45, fontSize: 10.5, color: C.dark, align: "center", fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 });
  });
}

// ============================================================
// 11. 현재 적용 현황
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "09. 현재 적용 현황", "각 기능별 적용 상태"); ft(s); pn(s, 11);

  // 적용 현황 테이블
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 12.7, h: 2.5, fill: { color: C.white }, rectRadius: 0.12, line: { color: C.primary, width: 1.5 } });
  s.addText("📊  기능별 적용 현황", { x: 0.6, y: 1.35, w: 5, h: 0.5, fontSize: 17, color: C.primary, bold: true, fontFace: "맑은 고딕" });

  const statusTable = [
    ["기능", "프로그램 개발", "현장 적용", "비고"],
    ["스켈프 투입", "✅ 완료", "✅ 운영 중", "현재 정상 사용 중"],
    ["적재위치관리", "✅ 완료", "⏳ TAG 교체 후", "신규 TAG 필요 (구TAG 정보 부족)"],
    ["상차등록", "✅ 완료", "⏳ TAG 교체 후", "신규 TAG 필요 (구TAG 정보 부족)"],
  ];
  s.addTable(statusTable, {
    x: 0.5, y: 1.95, w: 12.3, fontSize: 14, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.5, 2.5, 2.5, 4.3],
    autoPage: false, color: C.dark, headerRow: true,
    firstRowFill: { color: C.primary }, firstRowColor: C.white, altFill: { color: "F5F8FF" },
  });

  // TAG 문제 설명
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.1, w: 12.7, h: 2.8, fill: { color: "FFFBEB" }, rectRadius: 0.12, line: { color: C.accent, width: 2 } });
  s.addText("📌  TAG 관련 현황 설명", { x: 0.6, y: 4.15, w: 5, h: 0.5, fontSize: 17, color: C.accent, bold: true, fontFace: "맑은 고딕" });

  // 구TAG vs 신TAG 비교
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.8, w: 5.8, h: 1.8, fill: { color: "FEF2F2" }, rectRadius: 0.1, line: { color: C.red, width: 1 } });
  s.addText("❌  기존 TAG (구TAG)", { x: 0.7, y: 4.85, w: 5, h: 0.4, fontSize: 14, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "QR코드에 배치번호만 포함되어 있어\n품목코드, 수주번호, 본수, 길이 등의 정보가 없음\n\n" +
    "→ 이 정보만으로는 상차등록/적재위치관리에서\n   어떤 품목인지 정확히 식별할 수 없음",
    { x: 0.7, y: 5.3, w: 5.4, h: 1.15, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );

  s.addText("▶", { x: 6.3, y: 5.3, w: 0.7, h: 0.8, fontSize: 24, color: C.accent, align: "center", valign: "middle" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.8, w: 5.8, h: 1.8, fill: { color: "F0FDF4" }, rectRadius: 0.1, line: { color: C.green, width: 1 } });
  s.addText("✅  신규 TAG (어제부터 적용)", { x: 7.2, y: 4.85, w: 5, h: 0.4, fontSize: 14, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "QR코드에 배치번호 + 품목코드 + 수주번호\n+ 수주행번 + 본수 + 길이 포함\n\n" +
    "→ 충분한 정보가 있어 PDA 스캔으로\n   정확한 자재 식별 및 업무 처리 가능",
    { x: 7.2, y: 5.3, w: 5.4, h: 1.15, fontSize: 12, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.35 }
  );
}

// ============================================================
// 12. 향후 개선 및 추진 계획
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "10. 향후 개선 및 추진 계획", "TAG 교체 후 전체 기능 적용 로드맵"); ft(s); pn(s, 12);

  // TAG 교체 방안
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 1.3, w: 12.7, h: 2.5, fill: { color: "EFF6FF" }, rectRadius: 0.12, line: { color: C.secondary, width: 1.5 } });
  s.addText("🔄  TAG 교체 방안", { x: 0.6, y: 1.35, w: 5, h: 0.5, fontSize: 17, color: C.secondary, bold: true, fontFace: "맑은 고딕" });

  s.addText(
    "현재 신규 TAG는 어제부터 적용되어, 새로 생산되는 제품에는 상세 QR코드가 부착됩니다.\n" +
    "그러나 기존 재고에는 구TAG가 남아 있어 아래 2가지 방안으로 교체를 추진합니다.",
    { x: 0.6, y: 1.9, w: 12, h: 0.5, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3 }
  );

  // 방안 1
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.6, w: 5.8, h: 0.95, fill: { color: C.white }, rectRadius: 0.08, line: { color: C.secondary, width: 1.5 } });
  s.addShape(pptx.shapes.OVAL, { x: 0.7, y: 2.7, w: 0.45, h: 0.45, fill: { color: C.secondary } });
  s.addText("1", { x: 0.7, y: 2.7, w: 0.45, h: 0.45, fontSize: 16, color: C.white, bold: true, align: "center", valign: "middle" });
  s.addText("재고조사 시 일괄 교체", { x: 1.3, y: 2.6, w: 4.5, h: 0.4, fontSize: 15, color: C.secondary, bold: true, fontFace: "맑은 고딕" });
  s.addText("정기 재고조사 때 기존 재고의 TAG를 한꺼번에 교체", { x: 1.3, y: 3.0, w: 4.8, h: 0.45, fontSize: 12, color: C.dark, fontFace: "맑은 고딕" });

  // 방안 2
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 2.6, w: 6.0, h: 0.95, fill: { color: C.white }, rectRadius: 0.08, line: { color: C.accent, width: 1.5 } });
  s.addShape(pptx.shapes.OVAL, { x: 7.0, y: 2.7, w: 0.45, h: 0.45, fill: { color: C.accent } });
  s.addText("2", { x: 7.0, y: 2.7, w: 0.45, h: 0.45, fontSize: 16, color: C.white, bold: true, align: "center", valign: "middle" });
  s.addText("상차 시 순차 교체", { x: 7.6, y: 2.6, w: 4.5, h: 0.4, fontSize: 15, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText("출하(상차) 작업 시 해당 제품의 TAG를 신규로 교체", { x: 7.6, y: 3.0, w: 5.0, h: 0.45, fontSize: 12, color: C.dark, fontFace: "맑은 고딕" });

  // 추진 일정
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 4.1, w: 12.7, h: 2.8, fill: { color: "F8FAFC" }, rectRadius: 0.12, line: { color: C.primary, width: 1.5 } });
  s.addText("📅  향후 추진 계획", { x: 0.6, y: 4.15, w: 5, h: 0.5, fontSize: 17, color: C.primary, bold: true, fontFace: "맑은 고딕" });

  const plans = [
    { when: "현재", what: "스켈프 투입 정상 운영 중", status: "✅ 완료", color: C.green },
    { when: "진행 중", what: "신규 TAG 적용 시작 (새 생산분부터)", status: "🔄 진행 중", color: C.secondary },
    { when: "추진 예정", what: "기존 재고 TAG 교체 (방안 1 또는 2)", status: "📋 계획", color: C.accent },
    { when: "TAG 교체 후", what: "적재위치관리 현장 적용 및 교육", status: "⏳ 대기", color: C.purple },
    { when: "TAG 교체 후", what: "상차등록 현장 테스트 및 적용\n(담당자 재방문하여 현장 지원 예정)", status: "⏳ 대기", color: C.blue },
  ];
  plans.forEach((p, i) => {
    const y = 4.75 + i * 0.4;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 1.5, h: 0.35, fill: { color: p.color }, rectRadius: 0.04 });
    s.addText(p.when, { x: 0.5, y, w: 1.5, h: 0.35, fontSize: 10, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
    s.addText(p.what, { x: 2.2, y, w: 7.5, h: 0.35, fontSize: 13, color: C.dark, fontFace: "맑은 고딕" });
    s.addText(p.status, { x: 10.0, y, w: 2.5, h: 0.35, fontSize: 11, color: p.color, bold: true, fontFace: "맑은 고딕", align: "right" });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 6.85, w: 12.3, h: 0.2, fill: { color: C.accent }, rectRadius: 0.04 });
  s.addText("장기적으로 QR코드에 많은 정보를 담는 것이 업무 효율화에 유리하므로, TAG 변경은 꼭 필요한 과정입니다.", {
    x: 0.5, y: 6.5, w: 12, h: 0.35, fontSize: 13, color: C.accent, bold: true, fontFace: "맑은 고딕" });
}

// ============================================================
// 13. TAG 변경 상세
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.white };
  hdr(s, "TAG 변경 상세 안내", "QR코드에 담기는 정보가 달라졌습니다"); ft(s); pn(s, 13);

  s.addText("왜 TAG를 바꿔야 하나요?", { x: 0.5, y: 1.3, w: 12, h: 0.5, fontSize: 20, color: C.primary, bold: true, fontFace: "맑은 고딕" });
  s.addText("기존 TAG의 QR코드에는 배치번호 하나만 들어 있어, 그 정보만으로는 \"어떤 품목인지, 몇 본인지, 길이가 얼마인지\" 알 수 없었습니다.", {
    x: 0.5, y: 1.8, w: 12, h: 0.45, fontSize: 14, color: C.dark, fontFace: "맑은 고딕" });

  // 구TAG
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.5, w: 6.0, h: 2.5, fill: { color: "FEF2F2" }, rectRadius: 0.15, line: { color: C.red, width: 2 } });
  s.addText("❌  기존 TAG (구TAG)", { x: 0.6, y: 2.55, w: 5, h: 0.5, fontSize: 17, color: C.red, bold: true, fontFace: "맑은 고딕" });
  s.addText("QR코드에 담긴 정보:", { x: 0.8, y: 3.1, w: 5, h: 0.35, fontSize: 13, color: C.gray, fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 3.5, w: 5.0, h: 0.5, fill: { color: C.red }, rectRadius: 0.06 });
  s.addText("배치번호", { x: 0.8, y: 3.5, w: 5.0, h: 0.5, fontSize: 16, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addText("→ 정보가 부족하여 PDA에서 자재 식별 불가", { x: 0.8, y: 4.1, w: 5, h: 0.35, fontSize: 13, color: C.red, bold: true, fontFace: "맑은 고딕" });

  s.addText("▶", { x: 6.3, y: 3.3, w: 0.7, h: 0.8, fontSize: 28, color: C.accent, align: "center", valign: "middle" });

  // 신TAG
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 2.5, w: 6.0, h: 2.5, fill: { color: "F0FDF4" }, rectRadius: 0.15, line: { color: C.green, width: 2 } });
  s.addText("✅  신규 TAG (어제부터 적용)", { x: 7.3, y: 2.55, w: 5, h: 0.5, fontSize: 17, color: C.green, bold: true, fontFace: "맑은 고딕" });
  s.addText("QR코드에 담긴 정보:", { x: 7.5, y: 3.1, w: 5, h: 0.35, fontSize: 13, color: C.gray, fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 3.5, w: 5.0, h: 0.5, fill: { color: C.green }, rectRadius: 0.06 });
  s.addText("배치번호 + 품목코드 + 수주번호 + 행번 + 본수 + 길이", { x: 7.5, y: 3.5, w: 5.0, h: 0.5, fontSize: 11, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addText("→ 충분한 정보로 PDA 스캔 즉시 자재 식별 가능!", { x: 7.5, y: 4.1, w: 5, h: 0.35, fontSize: 13, color: C.green, bold: true, fontFace: "맑은 고딕" });

  // 하단: 정리
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 5.3, w: 12.7, h: 1.5, fill: { color: "FFFBEB" }, rectRadius: 0.12, line: { color: C.accent, width: 1.5 } });
  s.addText("📌  정리", { x: 0.6, y: 5.35, w: 3, h: 0.4, fontSize: 17, color: C.accent, bold: true, fontFace: "맑은 고딕" });
  s.addText(
    "• 신규 TAG가 적용된 제품 → PDA 바로 사용 가능 (스켈프/적재위치/상차 모두)\n\n" +
    "• 기존 재고(구TAG) → TAG 교체 전까지는 적재위치관리, 상차등록 사용 불가\n\n" +
    "• TAG 교체가 완료되면 담당자가 재방문하여 상차등록 / 적재위치관리 현장 지원 예정",
    { x: 0.6, y: 5.8, w: 12, h: 0.9, fontSize: 13, color: C.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.45 }
  );
}

// ============================================================
// 14. 감사
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { fill: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent } });
  s.addText("감사합니다", { x: 0, y: 2.0, w: 13.33, h: 1.0, fontSize: 44, color: C.white, bold: true, align: "center", fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 3.2, w: 2.3, h: 0.04, fill: { color: C.accent } });
  s.addText("동아스틸 PDA 시스템 구축 결과보고서", { x: 0, y: 3.5, w: 13.33, h: 0.5, fontSize: 18, color: "A8D0E6", align: "center", fontFace: "맑은 고딕" });
  s.addText("바코드 스캔으로 실현하는 스마트 물류 관리", { x: 0, y: 4.2, w: 13.33, h: 0.5, fontSize: 14, color: C.gray, align: "center", fontFace: "맑은 고딕" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 5.3, w: 6.33, h: 0.6, fill: { color: C.primary }, rectRadius: 0.08 });
  s.addText("세아정보기술 AI TF  |  2025. 03", { x: 3.5, y: 5.3, w: 6.33, h: 0.6, fontSize: 14, color: C.white, align: "center", valign: "middle", fontFace: "맑은 고딕" });
  pn(s, 14);
}

// ============================================================
const out = "c:\\Users\\HDPARK\\Desktop\\da_pda\\DongaSteel_PDA_FinalReport.pptx";
pptx.write("nodebuffer").then((buf) => {
  fs.writeFileSync(out, buf);
  console.log("최종 결과보고서 생성 완료:", out);
  console.log("파일 크기:", (buf.length / 1024).toFixed(1), "KB");
  console.log("총 슬라이드:", TOTAL, "페이지");
}).catch(e => console.error("PPT 생성 실패:", e));
