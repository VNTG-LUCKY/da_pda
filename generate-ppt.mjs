import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();

// -- 공통 설정 --
pptx.layout = "LAYOUT_WIDE"; // 16:9
pptx.author = "동아스틸 IT팀";
pptx.company = "동아스틸";
pptx.subject = "DA PDA 시스템 결과보고서";
pptx.title = "동아스틸 PDA 시스템 구축 결과보고서";

const COLOR = {
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
  lte: "00B4D8",
  ap: "E76F51",
};

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 9, color: COLOR.gray, align: "right",
  });
}

function addFooter(slide) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 7.15, w: 13.33, h: 0.35,
    fill: { color: COLOR.primary },
  });
  slide.addText("동아스틸 PDA 시스템 구축 결과보고서  |  Confidential", {
    x: 0.5, y: 7.15, w: 12, h: 0.35,
    fontSize: 8, color: COLOR.white, align: "left",
  });
}

function addSectionTitle(slide, title, subtitle) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.1,
    fill: { color: COLOR.primary },
  });
  slide.addText(title, {
    x: 0.6, y: 0.15, w: 10, h: 0.55,
    fontSize: 26, color: COLOR.white, bold: true, fontFace: "맑은 고딕",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 0.65, w: 10, h: 0.35,
      fontSize: 13, color: "A8D0E6", fontFace: "맑은 고딕",
    });
  }
}

const TOTAL_SLIDES = 22;

// ============================================================
// 1. 표지
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.darkBlue };

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { type: "solid", color: COLOR.darkBlue },
  });

  // 상단 장식선
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: COLOR.accent },
  });

  slide.addText("동아스틸", {
    x: 0.8, y: 1.0, w: 6, h: 0.6,
    fontSize: 18, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });

  slide.addText("PDA 시스템 구축\n결과보고서", {
    x: 0.8, y: 1.8, w: 8, h: 2.2,
    fontSize: 42, color: COLOR.white, bold: true, fontFace: "맑은 고딕",
    lineSpacingMultiple: 1.3,
  });

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 4.2, w: 3.5, h: 0.04,
    fill: { color: COLOR.accent },
  });

  slide.addText("LTE 기반 모바일 PDA 시스템으로\n스마트 물류 혁신 실현", {
    x: 0.8, y: 4.5, w: 7, h: 1.0,
    fontSize: 16, color: "A8D0E6", fontFace: "맑은 고딕",
    lineSpacingMultiple: 1.4,
  });

  slide.addText("2025. 03", {
    x: 0.8, y: 5.8, w: 3, h: 0.4,
    fontSize: 14, color: COLOR.gray, fontFace: "맑은 고딕",
  });
  slide.addText("동아스틸 IT팀", {
    x: 0.8, y: 6.2, w: 3, h: 0.4,
    fontSize: 14, color: COLOR.gray, fontFace: "맑은 고딕",
  });

  // 오른쪽 장식 박스
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 8.5, y: 1.5, w: 4.0, h: 4.5,
    fill: { color: COLOR.primary }, rectRadius: 0.15,
  });
  slide.addText("📱", {
    x: 9.5, y: 2.0, w: 2, h: 2,
    fontSize: 80, align: "center",
  });
  slide.addText("DA PDA\nSmart Logistics", {
    x: 8.8, y: 4.0, w: 3.5, h: 1.2,
    fontSize: 16, color: "A8D0E6", align: "center", fontFace: "맑은 고딕",
    lineSpacingMultiple: 1.3,
  });
}

// ============================================================
// 2. 목차
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "목 차", "Contents");
  addFooter(slide);
  addSlideNumber(slide, 2, TOTAL_SLIDES);

  const tocItems = [
    { num: "01", title: "프로젝트 개요", desc: "추진 배경 및 목표" },
    { num: "02", title: "시스템 구성도", desc: "전체 아키텍처 및 네트워크 구성" },
    { num: "03", title: "기술 스택", desc: "프론트엔드 / 백엔드 / 데이터베이스" },
    { num: "04", title: "주요 기능", desc: "적재위치관리 / 스켈프 투입 / 상차등록" },
    { num: "05", title: "화면 구성", desc: "로그인, 메인, 기능별 화면 + 입력 필드 상세" },
    { num: "06", title: "메뉴 및 옵션 기능", desc: "메인 메뉴, 화면별 옵션, 공유 컴포넌트" },
    { num: "07", title: "AP 대비 LTE 개선점", desc: "네트워크 방식 비교 분석" },
    { num: "08", title: "기대효과", desc: "정량적 / 정성적 효과" },
    { num: "09", title: "향후 계획", desc: "확장 및 고도화 방안" },
  ];

  tocItems.forEach((item, i) => {
    const y = 1.5 + i * 0.65;
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.5, y: y, w: 0.7, h: 0.5,
      fill: { color: COLOR.primary }, rectRadius: 0.08,
    });
    slide.addText(item.num, {
      x: 1.5, y: y, w: 0.7, h: 0.5,
      fontSize: 14, color: COLOR.white, bold: true, align: "center",
      fontFace: "맑은 고딕",
    });
    slide.addText(item.title, {
      x: 2.5, y: y, w: 4, h: 0.5,
      fontSize: 16, color: COLOR.dark, bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(item.desc, {
      x: 6.5, y: y, w: 5, h: 0.5,
      fontSize: 12, color: COLOR.gray, fontFace: "맑은 고딕",
    });
    if (i < tocItems.length - 1) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 1.5, y: y + 0.55, w: 9.5, h: 0.01,
        fill: { color: COLOR.lightGray },
      });
    }
  });
}

// ============================================================
// 3. 프로젝트 개요
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "01. 프로젝트 개요", "Project Overview");
  addFooter(slide);
  addSlideNumber(slide, 3, TOTAL_SLIDES);

  // 추진배경 박스
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.4, w: 6, h: 2.6,
    fill: { color: "F0F4F8" }, rectRadius: 0.1,
    line: { color: COLOR.secondary, width: 1 },
  });
  slide.addText("추진 배경", {
    x: 0.8, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "• 기존 수기/엑셀 기반 재고 관리의 비효율성\n" +
    "• 실시간 데이터 연동 부재로 인한 재고 오차 발생\n" +
    "• 기존 AP(Wi-Fi) 방식 PDA의 통신 불안정\n" +
    "• 넓은 야적장/창고에서 Wi-Fi 사각지대 문제\n" +
    "• 스마트 물류 시스템 구축 필요성 증대",
    {
      x: 0.8, y: 2.0, w: 5.5, h: 1.8,
      fontSize: 12, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // 프로젝트 목표 박스
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.4, w: 6, h: 2.6,
    fill: { color: "FFF3E0" }, rectRadius: 0.1,
    line: { color: COLOR.accent, width: 1 },
  });
  slide.addText("프로젝트 목표", {
    x: 7.1, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "• LTE 기반 모바일 PDA 시스템 구축\n" +
    "• Oracle ERP 연동 실시간 재고/물류 관리\n" +
    "• 바코드 스캔 기반 정확한 데이터 수집\n" +
    "• 적재위치 / 스켈프 투입 / 상차 업무 전산화\n" +
    "• 현장 작업자 편의성 극대화",
    {
      x: 7.1, y: 2.0, w: 5.5, h: 1.8,
      fontSize: 12, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // 프로젝트 범위
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 4.3, w: 12.3, h: 2.6,
    fill: { color: "E8F5E9" }, rectRadius: 0.1,
    line: { color: COLOR.green, width: 1 },
  });
  slide.addText("프로젝트 범위 및 추진 기간", {
    x: 0.8, y: 4.4, w: 5, h: 0.45,
    fontSize: 16, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
  });

  const scopeData = [
    ["구분", "내용"],
    ["시스템명", "DA PDA (동아스틸 PDA 시스템)"],
    ["대상 업무", "적재위치관리, 스켈프 투입, 상차등록"],
    ["사용 대상", "현장 작업자 (창고/야적장/생산라인)"],
    ["접속 방식", "LTE 모바일 + 웹앱 (APK 배포)"],
    ["접속 주소", "http://pda.dongasteel.co.kr"],
  ];

  slide.addTable(scopeData, {
    x: 0.8, y: 4.9, w: 11.5,
    fontSize: 11, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: COLOR.lightGray },
    colW: [2.2, 9.3],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    autoPage: false,
    color: COLOR.dark,
    headerRow: true,
    firstRowFill: { color: COLOR.green },
    firstRowColor: COLOR.white,
    altFill: { color: "F5FAF5" },
  });
}

// ============================================================
// 4. 시스템 구성도
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "02. 시스템 구성도", "System Architecture");
  addFooter(slide);
  addSlideNumber(slide, 4, TOTAL_SLIDES);

  // PDA/모바일 박스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.6, w: 2.5, h: 2.2,
    fill: { color: "E3F2FD" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("📱 PDA / 모바일", {
    x: 0.3, y: 1.7, w: 2.5, h: 0.4,
    fontSize: 13, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• 바코드 스캔\n• 데이터 조회/입력\n• APK 앱 또는 브라우저\n• LTE 통신",
    {
      x: 0.4, y: 2.15, w: 2.3, h: 1.5,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // 화살표 1
  slide.addText("→  LTE  →", {
    x: 2.9, y: 2.4, w: 1.5, h: 0.4,
    fontSize: 11, color: COLOR.lte, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  // 프론트엔드 서버
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.5, y: 1.6, w: 2.8, h: 2.2,
    fill: { color: "FFF8E1" }, rectRadius: 0.15,
    line: { color: COLOR.accent, width: 1.5 },
  });
  slide.addText("🖥️ 프론트엔드 서버", {
    x: 4.5, y: 1.7, w: 2.8, h: 0.4,
    fontSize: 13, color: COLOR.accent, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• React + TypeScript\n• Vite 빌드\n• Port: 3000\n• API 프록시 → 6000",
    {
      x: 4.6, y: 2.15, w: 2.6, h: 1.5,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // 화살표 2
  slide.addText("→  /api  →", {
    x: 7.4, y: 2.4, w: 1.5, h: 0.4,
    fontSize: 11, color: COLOR.green, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  // 백엔드 서버
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.9, y: 1.6, w: 2.8, h: 2.2,
    fill: { color: "E8F5E9" }, rectRadius: 0.15,
    line: { color: COLOR.green, width: 1.5 },
  });
  slide.addText("⚙️ 백엔드 서버", {
    x: 8.9, y: 1.7, w: 2.8, h: 0.4,
    fontSize: 13, color: COLOR.green, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• Node.js + Express\n• TypeScript\n• Port: 6000 (운영)\n• RESTful API",
    {
      x: 9.0, y: 2.15, w: 2.6, h: 1.5,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // 화살표 3 → DB
  slide.addText("↓  oracledb  ↓", {
    x: 9.3, y: 3.9, w: 2.0, h: 0.4,
    fontSize: 11, color: COLOR.red, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  // Oracle DB
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.4, y: 4.5, w: 3.8, h: 2.0,
    fill: { color: "FCE4EC" }, rectRadius: 0.15,
    line: { color: COLOR.red, width: 1.5 },
  });
  slide.addText("🗄️ Oracle Database", {
    x: 8.4, y: 4.6, w: 3.8, h: 0.4,
    fontSize: 13, color: COLOR.red, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• DAERP (172.17.1.56:1521)\n" +
    "• Stored Procedures\n" +
    "  - SP_PDA_LOAD_SCAN\n" +
    "  - SP_PDA_PICKING_SEL / SAVE\n" +
    "  - SP_PDA_PR09080_RET / IN",
    {
      x: 8.5, y: 5.05, w: 3.6, h: 1.3,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.4,
    }
  );

  // Nginx (선택)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 4.5, w: 3.5, h: 1.8,
    fill: { color: "F3E5F5" }, rectRadius: 0.15,
    line: { color: "7B1FA2", width: 1.5 },
  });
  slide.addText("🌐 Nginx (리버스 프록시)", {
    x: 0.3, y: 4.6, w: 3.5, h: 0.4,
    fontSize: 12, color: "7B1FA2", bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• Port 80 → 3000 프록시\n• pda.dongasteel.co.kr\n• SSL 대응 가능",
    {
      x: 0.4, y: 5.1, w: 3.3, h: 1.1,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );

  // Email 서비스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.5, y: 4.5, w: 3.5, h: 1.8,
    fill: { color: "E0F7FA" }, rectRadius: 0.15,
    line: { color: COLOR.lte, width: 1.5 },
  });
  slide.addText("📧 이메일 서비스", {
    x: 4.5, y: 4.6, w: 3.5, h: 0.4,
    fontSize: 12, color: COLOR.lte, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText(
    "• Nodemailer\n• 작업 결과 자동 발송\n• 수신자: DB에서 관리",
    {
      x: 4.6, y: 5.1, w: 3.3, h: 1.1,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );
}

// ============================================================
// 5. 기술 스택
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "03. 기술 스택", "Technology Stack");
  addFooter(slide);
  addSlideNumber(slide, 5, TOTAL_SLIDES);

  // Frontend
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.4, w: 4, h: 3.8,
    fill: { color: "E3F2FD" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("Frontend", {
    x: 0.4, y: 1.5, w: 4, h: 0.5,
    fontSize: 18, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  const feRows = [
    ["기술", "버전", "용도"],
    ["React", "18.2", "UI 프레임워크"],
    ["TypeScript", "5.2", "타입 안전성"],
    ["Vite", "5.0", "빌드 도구"],
    ["React Router", "6.20", "페이지 라우팅"],
    ["Axios", "1.6", "HTTP 통신"],
    ["Capacitor", "8.1", "APK 변환"],
  ];
  slide.addTable(feRows, {
    x: 0.6, y: 2.1, w: 3.6,
    fontSize: 10, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: "BBDEFB" },
    colW: [1.1, 0.7, 1.8],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    autoPage: false,
    color: COLOR.dark,
    headerRow: true,
    firstRowFill: { color: COLOR.secondary },
    firstRowColor: COLOR.white,
    altFill: { color: "F0F7FF" },
  });

  // Backend
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.7, y: 1.4, w: 4, h: 3.8,
    fill: { color: "E8F5E9" }, rectRadius: 0.15,
    line: { color: COLOR.green, width: 1.5 },
  });
  slide.addText("Backend", {
    x: 4.7, y: 1.5, w: 4, h: 0.5,
    fontSize: 18, color: COLOR.green, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  const beRows = [
    ["기술", "버전", "용도"],
    ["Node.js", "-", "런타임"],
    ["Express", "4.18", "HTTP API 서버"],
    ["TypeScript", "5.3", "타입 안전성"],
    ["oracledb", "6.0", "Oracle DB 연동"],
    ["Nodemailer", "8.0", "이메일 발송"],
    ["dotenv", "16.3", "환경변수 관리"],
  ];
  slide.addTable(beRows, {
    x: 4.9, y: 2.1, w: 3.6,
    fontSize: 10, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: "C8E6C9" },
    colW: [1.1, 0.7, 1.8],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    autoPage: false,
    color: COLOR.dark,
    headerRow: true,
    firstRowFill: { color: COLOR.green },
    firstRowColor: COLOR.white,
    altFill: { color: "F0FAF0" },
  });

  // Infra / DB
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 9.0, y: 1.4, w: 4, h: 3.8,
    fill: { color: "FFF3E0" }, rectRadius: 0.15,
    line: { color: COLOR.accent, width: 1.5 },
  });
  slide.addText("Infra / Database", {
    x: 9.0, y: 1.5, w: 4, h: 0.5,
    fontSize: 18, color: COLOR.accent, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  const infraRows = [
    ["구성", "상세"],
    ["Database", "Oracle (DAERP)"],
    ["Web Server", "Nginx (리버스 프록시)"],
    ["배포 서버", "61.107.76.23"],
    ["도메인", "pda.dongasteel.co.kr"],
    ["통신", "LTE / Wi-Fi"],
    ["APK", "Capacitor + Android"],
  ];
  slide.addTable(infraRows, {
    x: 9.2, y: 2.1, w: 3.6,
    fontSize: 10, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: "FFE0B2" },
    colW: [1.3, 2.3],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    autoPage: false,
    color: COLOR.dark,
    headerRow: true,
    firstRowFill: { color: COLOR.accent },
    firstRowColor: COLOR.white,
    altFill: { color: "FFF8F0" },
  });

  // 핵심 특징
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 5.5, w: 12.5, h: 1.4,
    fill: { color: "F5F5F5" }, rectRadius: 0.1,
    line: { color: COLOR.lightGray, width: 1 },
  });
  slide.addText("핵심 기술 특징", {
    x: 0.6, y: 5.55, w: 3, h: 0.35,
    fontSize: 13, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "✔ 웹앱 기반으로 별도 설치 불필요 (APK도 제공)    ✔ Oracle Stored Procedure 직접 호출로 ERP 실시간 연동    ✔ 바코드 스캐너 하드웨어 연동 (inputmode='none')    ✔ 사운드/진동 피드백으로 현장 UX 최적화",
    {
      x: 0.6, y: 5.95, w: 12.2, h: 0.8,
      fontSize: 11, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );
}

// ============================================================
// 6. 주요 기능 - 적재위치관리
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "04. 주요 기능 ① 적재위치관리", "Location Management");
  addFooter(slide);
  addSlideNumber(slide, 6, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
  });
  slide.addText("기능 설명", {
    x: 0.7, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "적재대에 보관된 코일/자재의 위치를 바코드 스캔으로\n실시간 등록·관리하는 기능",
    {
      x: 0.7, y: 1.95, w: 5.8, h: 0.7,
      fontSize: 12, color: COLOR.gray, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.4,
    }
  );

  slide.addText("주요 기능", {
    x: 0.7, y: 2.8, w: 3, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "① 적재대구분 선택 (SF_GET_PDA_WK)\n" +
    "② 적재대번호 선택 (SF_GET_PDA_WK_DTL)\n" +
    "③ 바코드 스캔으로 자재 정보 자동 입력\n" +
    "④ BATCH, 재질, 수량, 길이, 주문번호 표시\n" +
    "⑤ Oracle SP 호출로 실시간 저장\n" +
    "⑥ 이메일 자동 발송 (작업 결과 공유)\n" +
    "⑦ 스캔 이력 대시보드 (성공/오류 통계)",
    {
      x: 0.7, y: 3.25, w: 5.8, h: 2.8,
      fontSize: 12, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.6,
    }
  );

  // 프로세스 흐름
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.4, w: 6, h: 5.5,
    fill: { color: "FFF8E1" }, rectRadius: 0.15,
  });
  slide.addText("업무 프로세스", {
    x: 7.2, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });

  const steps = [
    { label: "적재대 구분/번호 선택", color: COLOR.secondary },
    { label: "바코드 스캔 (자재)", color: COLOR.blue },
    { label: "스캔 데이터 목록 확인", color: COLOR.green },
    { label: "저장 (SP_PDA_LOAD_SCAN)", color: COLOR.accent },
    { label: "결과 이메일 발송", color: COLOR.red },
  ];

  steps.forEach((step, i) => {
    const y = 2.2 + i * 0.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fill: { color: step.color }, rectRadius: 0.1,
    });
    slide.addText(`Step ${i + 1}. ${step.label}`, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fontSize: 12, color: COLOR.white, bold: true, align: "center",
      fontFace: "맑은 고딕",
    });
    if (i < steps.length - 1) {
      slide.addText("▼", {
        x: 9.5, y: y + 0.55, w: 1, h: 0.35,
        fontSize: 14, color: step.color, align: "center",
      });
    }
  });

  // API 정보
  slide.addText("API: /api/location/save-scan-data (POST)", {
    x: 7.2, y: 6.3, w: 5.5, h: 0.3,
    fontSize: 10, color: COLOR.gray, fontFace: "Consolas",
  });
}

// ============================================================
// 7. 주요 기능 - 스켈프 투입
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "04. 주요 기능 ② 스켈프 투입", "Slitting Input");
  addFooter(slide);
  addSlideNumber(slide, 7, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
  });
  slide.addText("기능 설명", {
    x: 0.7, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "스켈프 공정에 투입되는 코일의 BATCH 번호를 스캔하여\n투입 실적을 등록하는 기능",
    {
      x: 0.7, y: 1.95, w: 5.8, h: 0.7,
      fontSize: 12, color: COLOR.gray, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.4,
    }
  );

  slide.addText("주요 기능", {
    x: 0.7, y: 2.8, w: 3, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "① 작업일자, 근무조(주/야) 선택\n" +
    "② 공정 선택 (SF_GET_PRO_LIST)\n" +
    "③ 작업장(설비) 선택 (SF_GET_WC_LIST)\n" +
    "④ 기존 투입 데이터 불러오기 (SP_PDA_PR09080_RET)\n" +
    "⑤ 바코드 스캔으로 BATCH 추가\n" +
    "⑥ 투입 순서 자동 부여\n" +
    "⑦ Oracle SP로 실적 저장 (SP_PDA_PR09080_IN)",
    {
      x: 0.7, y: 3.25, w: 5.8, h: 2.8,
      fontSize: 12, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.6,
    }
  );

  // 프로세스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.4, w: 6, h: 5.5,
    fill: { color: "E8F5E9" }, rectRadius: 0.15,
  });
  slide.addText("업무 프로세스", {
    x: 7.2, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
  });

  const steps = [
    { label: "일자 / 근무조 / 공정 / 설비 선택", color: COLOR.secondary },
    { label: "기존 데이터 불러오기", color: COLOR.blue },
    { label: "바코드 스캔 (BATCH)", color: COLOR.green },
    { label: "투입 목록 확인 및 수정", color: COLOR.accent },
    { label: "저장 (SP_PDA_PR09080_IN)", color: COLOR.red },
  ];

  steps.forEach((step, i) => {
    const y = 2.2 + i * 0.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fill: { color: step.color }, rectRadius: 0.1,
    });
    slide.addText(`Step ${i + 1}. ${step.label}`, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fontSize: 12, color: COLOR.white, bold: true, align: "center",
      fontFace: "맑은 고딕",
    });
    if (i < steps.length - 1) {
      slide.addText("▼", {
        x: 9.5, y: y + 0.55, w: 1, h: 0.35,
        fontSize: 14, color: step.color, align: "center",
      });
    }
  });

  slide.addText("API: /api/slitting/save-slitting-data (POST)", {
    x: 7.2, y: 6.3, w: 5.5, h: 0.3,
    fontSize: 10, color: COLOR.gray, fontFace: "Consolas",
  });
}

// ============================================================
// 8. 주요 기능 - 상차등록
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "04. 주요 기능 ③ 상차등록", "Loading Registration");
  addFooter(slide);
  addSlideNumber(slide, 8, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
  });
  slide.addText("기능 설명", {
    x: 0.7, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "상차지시서 기반으로 출하 물품을 바코드 스캔하여\n피킹(Picking) 확인 및 상차 실적을 등록하는 기능",
    {
      x: 0.7, y: 1.95, w: 5.8, h: 0.7,
      fontSize: 12, color: COLOR.gray, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.4,
    }
  );

  slide.addText("주요 기능", {
    x: 0.7, y: 2.8, w: 3, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "① 상차지시번호 입력 및 조회 (SP_PDA_PICKING_SEL)\n" +
    "② 피킹 목록 자동 로드 (품목, 수량, 차량번호)\n" +
    "③ 바코드 스캔으로 출하 물품 확인\n" +
    "④ 수량 변경 및 차량번호 입력\n" +
    "⑤ 임시저장 / 최종저장 분리\n" +
    "⑥ Oracle SP로 상차 실적 저장\n" +
    "⑦ 스캔 성공/실패 사운드·진동 피드백",
    {
      x: 0.7, y: 3.25, w: 5.8, h: 2.8,
      fontSize: 12, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.6,
    }
  );

  // 프로세스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.4, w: 6, h: 5.5,
    fill: { color: "FCE4EC" }, rectRadius: 0.15,
  });
  slide.addText("업무 프로세스", {
    x: 7.2, y: 1.5, w: 3, h: 0.4,
    fontSize: 16, color: COLOR.red, bold: true, fontFace: "맑은 고딕",
  });

  const steps = [
    { label: "상차지시번호 입력 → 조회", color: COLOR.secondary },
    { label: "피킹 목록 확인", color: COLOR.blue },
    { label: "바코드 스캔 (출하 물품)", color: COLOR.green },
    { label: "수량/차량번호 확인·수정", color: COLOR.accent },
    { label: "임시저장 또는 최종저장", color: COLOR.red },
  ];

  steps.forEach((step, i) => {
    const y = 2.2 + i * 0.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fill: { color: step.color }, rectRadius: 0.1,
    });
    slide.addText(`Step ${i + 1}. ${step.label}`, {
      x: 7.4, y: y, w: 5.2, h: 0.55,
      fontSize: 12, color: COLOR.white, bold: true, align: "center",
      fontFace: "맑은 고딕",
    });
    if (i < steps.length - 1) {
      slide.addText("▼", {
        x: 9.5, y: y + 0.55, w: 1, h: 0.35,
        fontSize: 14, color: step.color, align: "center",
      });
    }
  });

  slide.addText("API: /api/loading/picking-save (POST)", {
    x: 7.2, y: 6.3, w: 5.5, h: 0.3,
    fontSize: 10, color: COLOR.gray, fontFace: "Consolas",
  });
}

// ============================================================
// 9. 화면 구성 - 로그인/메인
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "05. 화면 구성", "Screen Layout - Login & Main");
  addFooter(slide);
  addSlideNumber(slide, 9, TOTAL_SLIDES);

  // 로그인 화면
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.5, w: 6.2, h: 5.3,
    fill: { color: "F5F5F5" }, rectRadius: 0.15,
    line: { color: COLOR.lightGray, width: 1 },
  });
  slide.addText("로그인 화면", {
    x: 0.4, y: 1.55, w: 6.2, h: 0.5,
    fontSize: 16, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  // 모의 로그인 UI
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: 2.3, w: 4, h: 3.8,
    fill: { color: COLOR.white }, rectRadius: 0.2,
    shadow: { type: "outer", blur: 6, offset: 2, color: "CCCCCC" },
  });
  slide.addText("DA PDA", {
    x: 1.5, y: 2.5, w: 4, h: 0.5,
    fontSize: 20, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText("동아스틸 PDA 시스템", {
    x: 1.5, y: 2.95, w: 4, h: 0.3,
    fontSize: 10, color: COLOR.gray, align: "center", fontFace: "맑은 고딕",
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.0, y: 3.5, w: 3, h: 0.4,
    fill: { color: COLOR.light }, rectRadius: 0.05,
    line: { color: COLOR.lightGray, width: 0.5 },
  });
  slide.addText("사용자 ID", {
    x: 2.1, y: 3.5, w: 2.8, h: 0.4,
    fontSize: 10, color: "AAAAAA", fontFace: "맑은 고딕",
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.0, y: 4.1, w: 3, h: 0.4,
    fill: { color: COLOR.light }, rectRadius: 0.05,
    line: { color: COLOR.lightGray, width: 0.5 },
  });
  slide.addText("비밀번호", {
    x: 2.1, y: 4.1, w: 2.8, h: 0.4,
    fontSize: 10, color: "AAAAAA", fontFace: "맑은 고딕",
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.0, y: 4.7, w: 3, h: 0.4,
    fill: { color: COLOR.primary }, rectRadius: 0.05,
  });
  slide.addText("로그인", {
    x: 2.0, y: 4.7, w: 3, h: 0.4,
    fontSize: 12, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.0, y: 5.25, w: 3, h: 0.4,
    fill: { color: COLOR.red }, rectRadius: 0.05,
  });
  slide.addText("프로그램 종료", {
    x: 2.0, y: 5.25, w: 3, h: 0.4,
    fontSize: 12, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  // 메인 화면
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.5, w: 6.2, h: 5.3,
    fill: { color: "F5F5F5" }, rectRadius: 0.15,
    line: { color: COLOR.lightGray, width: 1 },
  });
  slide.addText("메인 화면", {
    x: 6.9, y: 1.55, w: 6.2, h: 0.5,
    fontSize: 16, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.0, y: 2.3, w: 4, h: 4.0,
    fill: { color: COLOR.white }, rectRadius: 0.2,
    shadow: { type: "outer", blur: 6, offset: 2, color: "CCCCCC" },
  });
  slide.addText("DA PDA  메인", {
    x: 8.0, y: 2.4, w: 4, h: 0.4,
    fontSize: 14, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  const menuItems = [
    { name: "적재위치관리", color: COLOR.secondary, icon: "📦" },
    { name: "스켈프 투입", color: COLOR.green, icon: "🔧" },
    { name: "상차등록", color: COLOR.accent, icon: "🚛" },
  ];

  menuItems.forEach((item, i) => {
    const y = 3.0 + i * 1.0;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.3, y: y, w: 3.4, h: 0.7,
      fill: { color: item.color }, rectRadius: 0.1,
      shadow: { type: "outer", blur: 3, offset: 1, color: "DDDDDD" },
    });
    slide.addText(`${item.icon}  ${item.name}`, {
      x: 8.3, y: y, w: 3.4, h: 0.7,
      fontSize: 14, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });
  });

  slide.addText("다크모드 / 화면잠금 / 글꼴크기 / 서버상태", {
    x: 8.0, y: 6.0, w: 4, h: 0.25,
    fontSize: 8, color: COLOR.gray, align: "center", fontFace: "맑은 고딕",
  });
}

// ============================================================
// 10. 화면 구성 - 기능별 화면
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "05. 화면 구성 (계속)", "Screen Layout - Feature Screens");
  addFooter(slide);
  addSlideNumber(slide, 10, TOTAL_SLIDES);

  const screens = [
    {
      title: "적재위치관리",
      color: COLOR.secondary,
      features: [
        "적재대구분 드롭다운",
        "적재대번호 드롭다운",
        "바코드 스캔 입력",
        "스캔 데이터 테이블",
        "저장 / 초기화 버튼",
        "스캔 이력 대시보드",
      ],
    },
    {
      title: "스켈프 투입",
      color: COLOR.green,
      features: [
        "작업일자 선택",
        "근무조 (주/야) 선택",
        "공정 / 작업장 선택",
        "불러오기 버튼",
        "BATCH 스캔 입력",
        "투입 목록 테이블",
      ],
    },
    {
      title: "상차등록",
      color: COLOR.accent,
      features: [
        "상차지시번호 입력",
        "조회 버튼",
        "피킹 목록 테이블",
        "바코드 스캔 확인",
        "차량번호 / 수량 수정",
        "임시저장 / 최종저장",
      ],
    },
  ];

  screens.forEach((screen, i) => {
    const x = 0.3 + i * 4.3;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.4, w: 4.0, h: 5.5,
      fill: { color: COLOR.white }, rectRadius: 0.15,
      line: { color: screen.color, width: 2 },
      shadow: { type: "outer", blur: 4, offset: 2, color: "DDDDDD" },
    });

    // 헤더
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x, y: 1.4, w: 4.0, h: 0.6,
      fill: { color: screen.color },
      rectRadius: 0.15,
    });
    slide.addText(screen.title, {
      x: x, y: 1.4, w: 4.0, h: 0.6,
      fontSize: 16, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });

    // 기능 목록
    screen.features.forEach((feat, j) => {
      const y = 2.3 + j * 0.7;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.3, y: y, w: 3.4, h: 0.5,
        fill: { color: j % 2 === 0 ? "F8F9FA" : COLOR.white }, rectRadius: 0.08,
        line: { color: COLOR.lightGray, width: 0.5 },
      });
      slide.addText(`✔  ${feat}`, {
        x: x + 0.5, y: y, w: 3.0, h: 0.5,
        fontSize: 11, color: COLOR.dark, fontFace: "맑은 고딕",
      });
    });
  });
}

// ============================================================
// 11. 적재위치관리 화면 상세
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "05. 적재위치관리 화면 상세", "Location Management - Screen Detail");
  addFooter(slide);
  addSlideNumber(slide, 11, TOTAL_SLIDES);

  // 왼쪽: 입력 필드 상세
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "FFF8E1" }, rectRadius: 0.15,
    line: { color: "F59E0B", width: 1.5 },
  });
  slide.addText("입력 필드 상세", {
    x: 0.6, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: "F59E0B", bold: true, fontFace: "맑은 고딕",
  });

  const locationFields = [
    { label: "적재대스캔", desc: "QR코드 \"구분코드-번호코드\" 형식 스캔 시 적재대구분·번호 자동 선택. 엔터 키로 처리.", type: "text + Enter" },
    { label: "적재대구분", desc: "Oracle SF_GET_PDA_WK 연동 드롭다운. 구분 변경 시 적재대번호 자동 초기화.", type: "select (Oracle)" },
    { label: "적재대번호", desc: "Oracle SF_GET_PDA_WK_DTL 연동 드롭다운. 적재대구분에 종속. 선택 시 바코드 입력란 자동 포커스.", type: "select (종속)" },
    { label: "바코드", desc: "inputmode='none' 기본 → 하드웨어 스캐너 전용. 📷 버튼 터치 시 소프트 키보드 전환 가능.", type: "text + 📷" },
    { label: "CNT / 본수합계", desc: "스캔된 행 수(CNT)와 본수(수량) 합계를 자동 계산하여 표시. 수정 불가(readonly).", type: "readonly" },
    { label: "정상 / 본수변경", desc: "라디오 버튼 2개. '본수변경' 선택 시 수동 본수 입력란 활성화 → 바코드 본수 오버라이드.", type: "radio + text" },
  ];

  locationFields.forEach((f, i) => {
    const y = 2.1 + i * 0.85;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: y, w: 5.9, h: 0.75,
      fill: { color: i % 2 === 0 ? "FFFDE7" : COLOR.white }, rectRadius: 0.06,
    });
    slide.addText(f.label, {
      x: 0.7, y: y, w: 1.5, h: 0.35,
      fontSize: 11, color: "F59E0B", bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(`[${f.type}]`, {
      x: 2.2, y: y, w: 2.0, h: 0.35,
      fontSize: 8, color: COLOR.gray, fontFace: "맑은 고딕",
    });
    slide.addText(f.desc, {
      x: 0.7, y: y + 0.32, w: 5.5, h: 0.4,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2,
    });
  });

  // 오른쪽: 테이블·버튼·바코드 형식
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("데이터 테이블 컬럼", {
    x: 7.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });

  const locCols = [
    ["컬럼명", "설명"],
    ["일자", "스캔 시점 자동 기록 (YYYY-MM-DD)"],
    ["시간", "스캔 시점 자동 기록 (HH:MM:SS)"],
    ["배치번호", "바코드 1번째 파트"],
    ["자재코드", "바코드 2번째 파트"],
    ["길이", "바코드 6번째 파트 (선택)"],
    ["본수", "바코드 3번째 파트 (또는 수동 입력)"],
    ["수주번호", "바코드 4번째 파트"],
    ["행번", "바코드 5번째 파트"],
    ["적재대구분/번호", "선택된 드롭다운 라벨 표시"],
  ];
  slide.addTable(locCols, {
    x: 7.0, y: 2.0, w: 5.8,
    fontSize: 9, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: COLOR.lightGray },
    colW: [1.6, 4.2],
    rowH: [0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28],
    autoPage: false, color: COLOR.dark,
    headerRow: true, firstRowFill: { color: COLOR.secondary }, firstRowColor: COLOR.white,
    altFill: { color: "F0F7FF" },
  });

  slide.addText("바코드 형식", {
    x: 7.1, y: 4.95, w: 5, h: 0.35,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText("배치번호-자재코드-본수-수주번호-행번[-길이]\n(5파트 또는 6파트, '-' 구분)", {
    x: 7.1, y: 5.3, w: 5.7, h: 0.55,
    fontSize: 10, color: COLOR.dark, fontFace: "Consolas", lineSpacingMultiple: 1.3,
  });

  slide.addText("하단 버튼", {
    x: 7.1, y: 5.9, w: 5, h: 0.3,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "• 저장: SP_PDA_LOAD_SCAN 호출, 건별 O_OUT_YN/O_OUT_MSG 반환\n" +
    "• 삭제: 선택된 행 제거 (저장 전 PDA 로컬)\n" +
    "• 입력: 바코드 수동 처리 (엔터 대용)",
    {
      x: 7.1, y: 6.2, w: 5.7, h: 0.6,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3,
    }
  );
}

// ============================================================
// 12. 스켈프 투입 화면 상세
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "05. 스켈프 투입 화면 상세", "Slitting Input - Screen Detail");
  addFooter(slide);
  addSlideNumber(slide, 12, TOTAL_SLIDES);

  // 왼쪽: 입력 필드 상세
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "F0FDF4" }, rectRadius: 0.15,
    line: { color: "22C55E", width: 1.5 },
  });
  slide.addText("입력 필드 상세", {
    x: 0.6, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: "22C55E", bold: true, fontFace: "맑은 고딕",
  });

  const slittingFields = [
    { label: "일자 + 조회", desc: "date picker 기본값은 오늘 날짜. '조회' 버튼 클릭 시 SP_PDA_PR09080_RET 호출 → 기존 투입 데이터를 테이블에 로드.", type: "date + button" },
    { label: "공정", desc: "Oracle SF_GET_PRO_LIST 연동 드롭다운. 공정 변경 시 작업장 자동 초기화·재조회.", type: "select (Oracle)" },
    { label: "작업장", desc: "Oracle SF_GET_WC_LIST 연동 드롭다운. 선택한 공정에 종속. 공정 미선택 시 비활성.", type: "select (종속)" },
    { label: "근무조", desc: "Oracle 연동 드롭다운 (주간/야간 등). 조회·저장 시 필수 파라미터.", type: "select (Oracle)" },
    { label: "바코드", desc: "\"배치번호-품목코드\" 형식 스캔 (예: HR06582801-DS100006). 공정+작업장+근무조 모두 선택 시 자동 포커스.", type: "text + 📷" },
    { label: "자동 포커스", desc: "공정·작업장·근무조 3개 모두 선택 완료 시 바코드 입력란으로 자동 포커스 이동 (현장 편의).", type: "자동" },
  ];

  slittingFields.forEach((f, i) => {
    const y = 2.1 + i * 0.85;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: y, w: 5.9, h: 0.75,
      fill: { color: i % 2 === 0 ? "F0FDF4" : COLOR.white }, rectRadius: 0.06,
    });
    slide.addText(f.label, {
      x: 0.7, y: y, w: 1.6, h: 0.35,
      fontSize: 11, color: "22C55E", bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(`[${f.type}]`, {
      x: 2.3, y: y, w: 2.0, h: 0.35,
      fontSize: 8, color: COLOR.gray, fontFace: "맑은 고딕",
    });
    slide.addText(f.desc, {
      x: 0.7, y: y + 0.32, w: 5.5, h: 0.4,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.2,
    });
  });

  // 오른쪽: 테이블·조회·저장
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("데이터 테이블 컬럼", {
    x: 7.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });

  const slitCols = [
    ["컬럼명", "설명"],
    ["순번", "투입 순서 자동 부여 (1, 2, 3…)"],
    ["배치번호", "바코드 '-' 기준 첫 번째 파트"],
    ["품목코드", "바코드 '-' 기준 나머지 파트"],
    ["스캔일자", "스캔 시점 자동 기록 (YYYY-MM-DD)"],
    ["스캔시간", "스캔 시점 자동 기록 (HH:MM:SS)"],
  ];
  slide.addTable(slitCols, {
    x: 7.0, y: 2.0, w: 5.8,
    fontSize: 10, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: COLOR.lightGray },
    colW: [1.6, 4.2],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    autoPage: false, color: COLOR.dark,
    headerRow: true, firstRowFill: { color: COLOR.secondary }, firstRowColor: COLOR.white,
    altFill: { color: "F0F7FF" },
  });

  slide.addText("조회 기능 (불러오기)", {
    x: 7.1, y: 4.0, w: 5, h: 0.35,
    fontSize: 12, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "• '조회' 버튼 → SP_PDA_PR09080_RET 호출\n" +
    "• 파라미터: 사업장(1), 일자, 근무조, 작업장\n" +
    "• 이미 등록된 투입 데이터를 테이블에 표시\n" +
    "• 추가 스캔 → 기존 목록에 이어서 추가 가능",
    {
      x: 7.1, y: 4.4, w: 5.7, h: 1.1,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4,
    }
  );

  slide.addText("하단 버튼 및 검증", {
    x: 7.1, y: 5.6, w: 5, h: 0.3,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "• 저장: SP_PDA_PR09080_IN 호출, 전체 행 일괄 저장\n" +
    "• 삭제: 선택된 행 제거 (저장 전 PDA 로컬)\n" +
    "• 중복 배치번호 입력 시 오류 표시 + 효과음",
    {
      x: 7.1, y: 5.9, w: 5.7, h: 0.8,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3,
    }
  );
}

// ============================================================
// 13. 상차등록 화면 상세
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "05. 상차등록 화면 상세", "Loading Registration - Screen Detail");
  addFooter(slide);
  addSlideNumber(slide, 13, TOTAL_SLIDES);

  // 왼쪽: 입력 필드 상세
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "EFF6FF" }, rectRadius: 0.15,
    line: { color: "3B82F6", width: 1.5 },
  });
  slide.addText("입력 필드 상세", {
    x: 0.6, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: "3B82F6", bold: true, fontFace: "맑은 고딕",
  });

  const loadingFields = [
    { label: "일자", desc: "date picker 기본값 오늘. 저장 시 P_SCAN_DATE 파라미터로 전달.", type: "date" },
    { label: "지시 (7자리)", desc: "지시번호 숫자 7자리 입력. 7자 도달 시 자동조회 또는 엔터 키로 SP_PDA_PICKING_SEL 호출 → 피킹 목록 테이블 자동 로드.", type: "text (auto)" },
    { label: "차량 / 네임", desc: "SP 조회 결과에서 CAR_NO 자동 표시. 네임(기사명)은 수동 입력 가능.", type: "text" },
    { label: "계획 / 피킹", desc: "계획: 품목코드+길이 그룹별 지시수 합계 (자동). 피킹: 배치가 있는 행의 배치수 합계 (자동). 모두 readonly.", type: "readonly" },
    { label: "바코드 (6파트)", desc: "\"배치-품목코드-수량-수주번호-수주행번-길이\" 형식. 품목코드+길이 매칭 행에 자동 배치 채움.", type: "text + 📷" },
    { label: "정상 / 수량변경", desc: "라디오 2개. '수량변경' 선택 시 수동 수량 입력 → 바코드의 수량을 오버라이드하여 피킹수에 반영.", type: "radio + text" },
    { label: "라인", desc: "배치가 채워진 행 수 자동 계산 (readonly). 스캔 진행 상황 파악용.", type: "readonly" },
  ];

  loadingFields.forEach((f, i) => {
    const y = 2.05 + i * 0.75;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: y, w: 5.9, h: 0.67,
      fill: { color: i % 2 === 0 ? "EFF6FF" : COLOR.white }, rectRadius: 0.06,
    });
    slide.addText(f.label, {
      x: 0.7, y: y, w: 1.8, h: 0.3,
      fontSize: 10, color: "3B82F6", bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(`[${f.type}]`, {
      x: 2.5, y: y, w: 1.8, h: 0.3,
      fontSize: 8, color: COLOR.gray, fontFace: "맑은 고딕",
    });
    slide.addText(f.desc, {
      x: 0.7, y: y + 0.28, w: 5.5, h: 0.36,
      fontSize: 8.5, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.15,
    });
  });

  // 오른쪽: 테이블·자동완료·저장 모드
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("데이터 테이블 컬럼", {
    x: 7.1, y: 1.5, w: 5, h: 0.35,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });

  const loadCols = [
    ["컬럼명", "설명"],
    ["완료 ✔", "품목코드+길이 그룹의 피킹수 합계 = 지시수 시 자동 체크"],
    ["순번", "행 순서 자동 부여 (삽입·삭제 시 재계산)"],
    ["품목코드", "SP 조회 결과 ITEM_CODE (저장용)"],
    ["품목", "SP 조회 결과 ITEM_NAME (표시용)"],
    ["길이", "SP 조회 결과 LEN (품목 매칭 키)"],
    ["지시수", "SP 조회 결과 QTY (해당 품목+길이 계획량)"],
    ["배치", "바코드 스캔 시 자동 입력 (BATCH_NO)"],
    ["피킹수", "바코드 3번째 파트 또는 수량변경 값"],
    ["다발수", "SP 조회 결과 BD_QTY"],
  ];
  slide.addTable(loadCols, {
    x: 7.0, y: 1.95, w: 5.8,
    fontSize: 8.5, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.5, color: COLOR.lightGray },
    colW: [1.3, 4.5],
    rowH: [0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26],
    autoPage: false, color: COLOR.dark,
    headerRow: true, firstRowFill: { color: COLOR.secondary }, firstRowColor: COLOR.white,
    altFill: { color: "F0F7FF" },
  });

  slide.addText("자동 완료 체크 로직", {
    x: 7.1, y: 4.7, w: 5, h: 0.3,
    fontSize: 11, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "동일 품목코드+길이 그룹의 피킹수(배치가 있는 행) 합계가\n해당 그룹의 지시수와 같으면 ✔ 자동 체크 → 초과 스캔 차단",
    {
      x: 7.1, y: 5.0, w: 5.7, h: 0.55,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.3,
    }
  );

  slide.addText("하단 버튼 (3종)", {
    x: 7.1, y: 5.6, w: 5, h: 0.3,
    fontSize: 11, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });

  const loadBtns = [
    { name: "최종 저장", desc: "endYn='Y' → 수정 불가. 계획=피킹 일치 필수. 확인 다이얼로그.", color: COLOR.red },
    { name: "임시 저장", desc: "endYn='N' → 이후 추가 스캔·수정 가능. 수량 불일치 허용.", color: COLOR.accent },
    { name: "삭제", desc: "선택 행 제거. 형제 행 있으면 행 자체 삭제, 없으면 배치만 초기화.", color: COLOR.gray },
  ];
  loadBtns.forEach((b, i) => {
    const y = 5.95 + i * 0.35;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1, y: y, w: 1.2, h: 0.28,
      fill: { color: b.color }, rectRadius: 0.04,
    });
    slide.addText(b.name, {
      x: 7.1, y: y, w: 1.2, h: 0.28,
      fontSize: 8, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });
    slide.addText(b.desc, {
      x: 8.4, y: y, w: 4.4, h: 0.28,
      fontSize: 8.5, color: COLOR.dark, fontFace: "맑은 고딕", valign: "middle",
    });
  });
}

// ============================================================
// 14. 메인 화면 상세 - 메뉴 카드 + 드래그앤드롭 + 옵션 메뉴
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "06. 메인 화면 상세", "Main Menu - Cards & Options");
  addFooter(slide);
  addSlideNumber(slide, 14, TOTAL_SLIDES);

  // === 왼쪽: 메뉴 카드 구성 ===
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("메뉴 카드 구성", {
    x: 0.6, y: 1.5, w: 5, h: 0.45,
    fontSize: 16, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText("헤더 영역", {
    x: 0.6, y: 2.05, w: 3, h: 0.35,
    fontSize: 12, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });

  // 모의 헤더바
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.45, w: 5.7, h: 0.65,
    fill: { color: COLOR.primary }, rectRadius: 0.08,
  });
  slide.addText("로그아웃", {
    x: 0.8, y: 2.5, w: 1.2, h: 0.55,
    fontSize: 9, color: COLOR.white, fontFace: "맑은 고딕", valign: "middle",
  });
  slide.addText("동아스틸 PDA", {
    x: 2.2, y: 2.5, w: 2.5, h: 0.35,
    fontSize: 12, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
  });
  slide.addText("물류 관리 시스템", {
    x: 2.2, y: 2.8, w: 2.5, h: 0.25,
    fontSize: 8, color: "A8D0E6", align: "center", fontFace: "맑은 고딕",
  });
  slide.addText("☰", {
    x: 5.3, y: 2.5, w: 0.8, h: 0.55,
    fontSize: 16, color: COLOR.white, align: "center", fontFace: "맑은 고딕", valign: "middle",
  });

  // 메뉴 카드들
  slide.addText("메뉴 카드 (3개, 드래그 순서 변경 가능)", {
    x: 0.6, y: 3.25, w: 5, h: 0.35,
    fontSize: 12, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });

  const cards = [
    { name: "적재위치관리", sub: "적재위치 관리", color: "F59E0B", bg: "FFF8E1" },
    { name: "스켈프 투입", sub: "스켈프 투입 처리", color: "22C55E", bg: "F0FDF4" },
    { name: "상차등록", sub: "상차 등록 처리", color: "3B82F6", bg: "EFF6FF" },
  ];
  cards.forEach((c, i) => {
    const y = 3.7 + i * 0.75;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 4.5, h: 0.6,
      fill: { color: c.bg }, rectRadius: 0.1,
      line: { color: c.color, width: 1.5 },
    });
    slide.addText(c.name, {
      x: 1.1, y: y, w: 2.2, h: 0.35,
      fontSize: 12, color: c.color, bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(c.sub, {
      x: 1.1, y: y + 0.3, w: 2.2, h: 0.25,
      fontSize: 8, color: COLOR.gray, fontFace: "맑은 고딕",
    });
    slide.addText("⋮⋮", {
      x: 4.5, y: y, w: 0.6, h: 0.6,
      fontSize: 14, color: COLOR.gray, align: "center", valign: "middle",
    });
  });

  // 드래그 설명
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.0, w: 5.7, h: 0.7,
    fill: { color: "E8F5E9" }, rectRadius: 0.08,
  });
  slide.addText("⋮⋮ 드래그 핸들을 터치하여 카드 순서 변경 가능\n      (localStorage에 순서 저장 → 재접속 시 유지)", {
    x: 0.8, y: 6.0, w: 5.3, h: 0.7,
    fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕", lineSpacingMultiple: 1.4,
  });

  // === 오른쪽: 로그인 화면 기능 + 메인 기능 요약 ===
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 2.5,
    fill: { color: "FFF3E0" }, rectRadius: 0.15,
    line: { color: COLOR.accent, width: 1.5 },
  });
  slide.addText("로그인 화면 기능", {
    x: 7.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 14, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });
  const loginFeatures = [
    "아이디 / 비밀번호 입력 → 인증",
    "마지막 로그인 ID 자동 기억 (localStorage)",
    "프로그램 종료 시 캐시 삭제 + 앱 종료",
    "종료 후 '다시 시작' 버튼으로 재접속",
  ];
  loginFeatures.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 7.1, y: 2.0 + i * 0.4, w: 5.7, h: 0.35,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // 메인 화면 특징
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 4.1, w: 6.2, h: 2.7,
    fill: { color: "E3F2FD" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("메인 화면 특징", {
    x: 7.1, y: 4.2, w: 5, h: 0.4,
    fontSize: 14, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  const mainFeatures = [
    "3개 업무 기능을 카드 형태로 직관적 배치",
    "카드 드래그&드롭으로 순서 커스터마이징",
    "☰ 햄버거 메뉴로 7가지 옵션 설정 접근",
    "로그아웃 버튼으로 안전한 세션 종료",
    "옵션 드롭다운 열 때 서버 상태 자동 확인",
  ];
  mainFeatures.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 7.1, y: 4.7 + i * 0.38, w: 5.7, h: 0.35,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });
}

// ============================================================
// 12. 메인 화면 옵션 기능 상세
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "06. 메인 화면 옵션 기능", "Main Menu - Options Detail");
  addFooter(slide);
  addSlideNumber(slide, 15, TOTAL_SLIDES);

  slide.addText("☰ 메인 화면 옵션 메뉴 (7개 항목)", {
    x: 0.5, y: 1.25, w: 8, h: 0.4,
    fontSize: 14, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });

  const options = [
    {
      name: "다크 모드",
      type: "토글 ON/OFF",
      desc: "어두운 환경(야간 작업) 대응. 눈 피로 감소.\n전체 앱에 즉시 적용, localStorage 저장.",
      icon: "🌙",
      color: "818CF8",
      bgColor: "EDE9FE",
    },
    {
      name: "화면 꺼짐 방지",
      type: "토글 ON/OFF",
      desc: "Wake Lock API로 PDA 화면 자동 꺼짐 방지.\n바코드 스캔 대기 중 화면 유지.",
      icon: "🖥️",
      color: "22C55E",
      bgColor: "F0FDF4",
    },
    {
      name: "글꼴 크기",
      type: "소 / 중 / 대",
      desc: "전체 앱 글꼴 크기 3단계 조절.\n현장 작업자 시인성 확보.",
      icon: "🔤",
      color: "64748B",
      bgColor: "F1F5F9",
    },
    {
      name: "서버 상태",
      type: "상태 표시 + 새로고침",
      desc: "백엔드(/api/health) 연결 상태 실시간 확인.\n● 연결됨 / ● 연결 안됨 / 확인 중 표시.",
      icon: "🖧",
      color: "3B82F6",
      bgColor: "EFF6FF",
    },
    {
      name: "바코드 입력 딜레이",
      type: "짧게(50ms) / 보통(100ms) / 길게(200ms)",
      desc: "바코드 스캐너 입력 속도에 맞춰 지연 조절.\n스캐너 기종별 최적값 설정 가능.",
      icon: "📊",
      color: "F59E0B",
      bgColor: "FFF8E1",
    },
    {
      name: "스캔 이력",
      type: "대시보드 모달",
      desc: "전체 스캔 이력 + 오늘 성공/실패 통계.\n페이지별 필터, 성공률 도넛 차트.",
      icon: "📋",
      color: "6366F1",
      bgColor: "EEF2FF",
    },
    {
      name: "저장 이력",
      type: "모달",
      desc: "성공 저장 이력 목록 (오늘/전체).\n페이지별 필터, 날짜/시간/바코드 표시.",
      icon: "💾",
      color: "22C55E",
      bgColor: "F0FDF4",
    },
  ];

  options.forEach((opt, i) => {
    const y = 1.75 + i * 0.75;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: y, w: 12.7, h: 0.65,
      fill: { color: opt.bgColor }, rectRadius: 0.08,
      line: { color: opt.color, width: 1 },
    });
    slide.addText(opt.icon, {
      x: 0.5, y: y, w: 0.5, h: 0.65,
      fontSize: 16, align: "center", valign: "middle",
    });
    slide.addText(opt.name, {
      x: 1.1, y: y, w: 2.0, h: 0.65,
      fontSize: 12, color: opt.color, bold: true, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 3.2, y: y + 0.12, w: 3.2, h: 0.4,
      fill: { color: COLOR.white }, rectRadius: 0.05,
      line: { color: COLOR.lightGray, width: 0.5 },
    });
    slide.addText(opt.type, {
      x: 3.3, y: y + 0.12, w: 3.0, h: 0.4,
      fontSize: 9, color: COLOR.gray, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addText(opt.desc, {
      x: 6.6, y: y, w: 6.2, h: 0.65,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.3, valign: "middle",
    });
  });
}

// ============================================================
// 13. 기능 화면 공통 옵션
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "06. 기능 화면 공통 옵션", "Feature Screens - Common Options");
  addFooter(slide);
  addSlideNumber(slide, 16, TOTAL_SLIDES);

  slide.addText("적재위치관리 / 스켈프 투입 / 상차등록 공통 옵션 메뉴 (9개 항목)", {
    x: 0.5, y: 1.25, w: 12, h: 0.4,
    fontSize: 14, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });

  const featureOptions = [
    { name: "다크 모드", type: "토글", desc: "화면 전체 다크/라이트 테마 전환", icon: "🌙", color: "818CF8" },
    { name: "전달용 (Oracle Ref)", type: "토글", desc: "Oracle SP 호출 파라미터/결과를 화면에 표시 (디버깅·관리용)", icon: "📄", color: "64748B" },
    { name: "이메일 전달", type: "토글", desc: "저장 시 SP 파라미터·결과를 지정 수신자에게 자동 이메일 발송", icon: "📧", color: "3B82F6" },
    { name: "화면 꺼짐 방지", type: "토글", desc: "Wake Lock으로 PDA 화면 자동 꺼짐 방지 (스캔 대기 시)", icon: "🖥️", color: "22C55E" },
    { name: "글꼴 크기", type: "소/중/대", desc: "앱 전체 글꼴 크기 3단계 조절 (현장 시인성 확보)", icon: "🔤", color: "64748B" },
    { name: "스캔 효과음", type: "토글", desc: "바코드 스캔 성공/실패 시 효과음 재생 (AudioContext)", icon: "🔊", color: "3B82F6" },
    { name: "진동 피드백", type: "토글", desc: "바코드 스캔 성공/실패 시 PDA 진동 피드백 (Vibration API)", icon: "📳", color: "F59E0B" },
    { name: "스캔 이력", type: "대시보드", desc: "스캔 성공/오류 통계, 페이지별 필터, 성공률 차트", icon: "📋", color: "6366F1" },
    { name: "저장 이력", type: "모달", desc: "성공 저장 이력 조회 (오늘/전체, 페이지별 필터)", icon: "💾", color: "22C55E" },
  ];

  featureOptions.forEach((opt, i) => {
    const y = 1.75 + i * 0.6;
    const isEven = i % 2 === 0;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: y, w: 12.7, h: 0.52,
      fill: { color: isEven ? "F8F9FA" : COLOR.white }, rectRadius: 0.06,
    });
    slide.addText(opt.icon, {
      x: 0.4, y: y, w: 0.5, h: 0.52,
      fontSize: 14, align: "center", valign: "middle",
    });
    slide.addText(opt.name, {
      x: 1.0, y: y, w: 1.8, h: 0.52,
      fontSize: 11, color: opt.color, bold: true, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 2.9, y: y + 0.1, w: 1.1, h: 0.32,
      fill: { color: opt.color }, rectRadius: 0.04,
    });
    slide.addText(opt.type, {
      x: 2.9, y: y + 0.1, w: 1.1, h: 0.32,
      fontSize: 8, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });
    slide.addText(opt.desc, {
      x: 4.2, y: y, w: 8.6, h: 0.52,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕", valign: "middle",
    });
  });

  // 메인 vs 기능 화면 차이 비교
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 7.2 - 0.75, w: 12.7, h: 0.65,
    fill: { color: "E3F2FD" }, rectRadius: 0.08,
    line: { color: COLOR.secondary, width: 1 },
  });
  slide.addText(
    "메인 화면 전용: 서버 상태 확인, 바코드 입력 딜레이  |  기능 화면 전용: 전달용(Oracle Ref), 이메일 전달, 스캔 효과음, 진동 피드백",
    {
      x: 0.5, y: 7.2 - 0.75, w: 12.3, h: 0.65,
      fontSize: 10, color: COLOR.primary, bold: true, align: "center", fontFace: "맑은 고딕",
      valign: "middle",
    }
  );
}

// ============================================================
// 14. 공유 컴포넌트 - ScanDashboard & SaveHistoryModal
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "06. 공유 컴포넌트", "Shared Components - Dashboard & History");
  addFooter(slide);
  addSlideNumber(slide, 17, TOTAL_SLIDES);

  // === ScanDashboard ===
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "EEF2FF" }, rectRadius: 0.15,
    line: { color: "6366F1", width: 2 },
  });
  slide.addText("📋 스캔 이력 대시보드 (ScanDashboard)", {
    x: 0.5, y: 1.5, w: 6, h: 0.5,
    fontSize: 15, color: "6366F1", bold: true, fontFace: "맑은 고딕",
  });

  // 대시보드 구성 요소
  slide.addText("오늘의 스캔 통계", {
    x: 0.6, y: 2.1, w: 3, h: 0.35,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });

  // 통계 카드 모의
  const statCards = [
    { label: "전체", value: "47", color: COLOR.secondary },
    { label: "성공", value: "44", color: COLOR.green },
    { label: "오류", value: "3", color: COLOR.red },
  ];
  statCards.forEach((s, i) => {
    const x = 0.7 + i * 1.8;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.5, w: 1.5, h: 0.9,
      fill: { color: COLOR.white }, rectRadius: 0.08,
      line: { color: s.color, width: 1 },
    });
    slide.addText(s.value, {
      x: x, y: 2.5, w: 1.5, h: 0.55,
      fontSize: 20, color: s.color, bold: true, align: "center", fontFace: "맑은 고딕",
    });
    slide.addText(s.label, {
      x: x, y: 3.0, w: 1.5, h: 0.3,
      fontSize: 9, color: COLOR.gray, align: "center", fontFace: "맑은 고딕",
    });
  });

  // 성공률
  slide.addShape(pptx.shapes.OVAL, {
    x: 5.0, y: 2.5, w: 1.2, h: 1.0,
    fill: { color: COLOR.white },
    line: { color: COLOR.green, width: 3 },
  });
  slide.addText("93%", {
    x: 5.0, y: 2.7, w: 1.2, h: 0.6,
    fontSize: 14, color: COLOR.green, bold: true, align: "center", fontFace: "맑은 고딕",
  });

  slide.addText("주요 기능", {
    x: 0.6, y: 3.6, w: 3, h: 0.35,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  const dashFeatures = [
    "오늘의 스캔 통계 (전체/성공/오류 건수)",
    "성공률 도넛 차트 (90%↑ 초록, 70%↑ 노랑)",
    "페이지별 필터 (상차/적재/스켈프/전체)",
    "결과 필터 (전체/성공/오류)",
    "스캔 이력 목록 (최근 100건, 시간순)",
    "이력 전체 삭제 기능 (확인 다이얼로그)",
    "최대 500건 localStorage 보관",
  ];
  dashFeatures.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 0.6, y: 4.05 + i * 0.38, w: 5.8, h: 0.35,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // === SaveHistoryModal ===
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 5.5,
    fill: { color: "F0FDF4" }, rectRadius: 0.15,
    line: { color: "22C55E", width: 2 },
  });
  slide.addText("💾 저장 이력 모달 (SaveHistoryModal)", {
    x: 7.0, y: 1.5, w: 6, h: 0.5,
    fontSize: 15, color: "22C55E", bold: true, fontFace: "맑은 고딕",
  });

  // 모의 UI
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.2, y: 2.2, w: 5.5, h: 0.45,
    fill: { color: COLOR.white }, rectRadius: 0.06,
    line: { color: COLOR.lightGray, width: 0.5 },
  });
  slide.addText("오늘  |  전체", {
    x: 7.4, y: 2.25, w: 2, h: 0.35,
    fontSize: 10, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText("상차  적재  스켈프  전체", {
    x: 9.5, y: 2.25, w: 3, h: 0.35,
    fontSize: 9, color: COLOR.gray, fontFace: "맑은 고딕", align: "right",
  });

  // 모의 이력 행
  const historyRows = [
    { time: "14:23:15", page: "상차", barcode: "B2024031500123", color: "3B82F6" },
    { time: "14:20:42", page: "적재", barcode: "C2024031500456", color: "F59E0B" },
    { time: "14:18:09", page: "스켈프", barcode: "S2024031500789", color: "22C55E" },
  ];
  historyRows.forEach((r, i) => {
    const y = 2.8 + i * 0.55;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.2, y: y, w: 5.5, h: 0.45,
      fill: { color: i % 2 === 0 ? "F8FAF8" : COLOR.white }, rectRadius: 0.04,
    });
    slide.addText(r.time, {
      x: 7.3, y: y, w: 1.0, h: 0.45,
      fontSize: 9, color: COLOR.gray, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.4, y: y + 0.08, w: 0.9, h: 0.28,
      fill: { color: r.color }, rectRadius: 0.04,
    });
    slide.addText(r.page, {
      x: 8.4, y: y + 0.08, w: 0.9, h: 0.28,
      fontSize: 8, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });
    slide.addText(r.barcode, {
      x: 9.5, y: y, w: 3.0, h: 0.45,
      fontSize: 9, color: COLOR.dark, fontFace: "Consolas", valign: "middle",
    });
  });

  slide.addText("주요 기능", {
    x: 7.0, y: 4.5, w: 3, h: 0.35,
    fontSize: 12, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });
  const saveFeatures = [
    "성공 저장 이력만 필터링하여 표시",
    "오늘 / 전체 날짜 필터",
    "페이지별 필터 (상차/적재/스켈프)",
    "저장 시각, 페이지, 바코드 표시",
    "색상 태그로 페이지 구분 (파랑/주황/초록)",
    "메인 + 모든 기능 화면에서 접근 가능",
  ];
  saveFeatures.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 7.0, y: 4.95 + i * 0.35, w: 5.8, h: 0.32,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });
}

// ============================================================
// 15. AP 대비 LTE 개선점
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "07. 일반 AP(Wi-Fi) 대비 LTE 개선점", "AP vs LTE Comparison");
  addFooter(slide);
  addSlideNumber(slide, 18, TOTAL_SLIDES);

  // 비교 테이블
  const compData = [
    ["비교 항목", "기존 AP(Wi-Fi) 방식", "LTE 방식 (개선)", "개선 효과"],
    ["통신 커버리지", "AP 반경 30~50m 제한\n사각지대 다수 발생", "전국 LTE망 활용\n커버리지 제한 없음", "야적장/야외 100%\n통신 가능"],
    ["통신 안정성", "간섭, 핸드오버 끊김\n동시접속 시 속도 저하", "전용 LTE 채널\n안정적 통신 유지", "끊김 없는\n실시간 데이터 전송"],
    ["초기 인프라 비용", "AP 장비 구매 + 설치\nLAN 배선 공사 필요", "LTE 유심만 장착\n추가 인프라 불필요", "초기 구축비\n80% 이상 절감"],
    ["유지보수", "AP 장비 고장/교체\n정기적 관리 필요", "통신사 망 관리\n자체 유지보수 최소화", "유지보수 비용\n대폭 절감"],
    ["확장성", "AP 추가 설치 필요\n배선 공사 동반", "유심 추가만으로\n즉시 확장 가능", "설비 증설 시\n즉시 대응"],
    ["보안", "Wi-Fi 해킹 위험\n공용 네트워크 우려", "LTE 전용망\n높은 보안 수준", "데이터 보안\n강화"],
    ["이동성", "AP 범위 내에서만 사용\n건물 간 이동 시 끊김", "자유로운 이동\n건물/야적장 무관", "작업 동선\n제약 해소"],
  ];

  slide.addTable(compData, {
    x: 0.3, y: 1.3, w: 12.7,
    fontSize: 10, fontFace: "맑은 고딕",
    border: { type: "solid", pt: 0.8, color: COLOR.lightGray },
    colW: [2.0, 3.3, 3.3, 2.5],
    rowH: [0.4, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65],
    autoPage: false,
    color: COLOR.dark,
    headerRow: true,
    firstRowFill: { color: COLOR.primary },
    firstRowColor: COLOR.white,
    altFill: { color: "F5F8FF" },
  });

  // 핵심 결론
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 6.7, w: 12.7, h: 0.4,
    fill: { color: COLOR.lte }, rectRadius: 0.08,
  });
  slide.addText(
    "결론: LTE 방식은 Wi-Fi AP 대비 통신 안정성, 커버리지, 비용, 확장성 모든 면에서 우수하며, 특히 넓은 야적장과 야외 작업 환경에 최적",
    {
      x: 0.5, y: 6.7, w: 12.3, h: 0.4,
      fontSize: 11, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    }
  );
}

// ============================================================
// 16. AP 대비 LTE 개선점 (시각적 보충)
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "07. LTE 전환 효과 상세", "LTE Migration Benefits Detail");
  addFooter(slide);
  addSlideNumber(slide, 19, TOTAL_SLIDES);

  // AP 문제점
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.2, h: 5.3,
    fill: { color: "FFF0F0" }, rectRadius: 0.15,
    line: { color: COLOR.ap, width: 2 },
  });
  slide.addText("기존 AP(Wi-Fi) 방식의 문제점", {
    x: 0.5, y: 1.5, w: 5.8, h: 0.5,
    fontSize: 16, color: COLOR.ap, bold: true, fontFace: "맑은 고딕",
  });

  const apProblems = [
    { icon: "❌", text: "야적장/야외 Wi-Fi 사각지대 → 데이터 미전송" },
    { icon: "❌", text: "AP 간 핸드오버 시 연결 끊김 빈번" },
    { icon: "❌", text: "AP 장비 고장 시 해당 구역 전체 마비" },
    { icon: "❌", text: "비/눈 등 기상 조건에 AP 성능 저하" },
    { icon: "❌", text: "AP 추가 시 배선 공사 필요 (높은 비용)" },
    { icon: "❌", text: "동시 접속 디바이스 증가 시 속도 급감" },
    { icon: "❌", text: "Wi-Fi 보안 취약점 (공유키 유출 위험)" },
  ];

  apProblems.forEach((p, i) => {
    slide.addText(`${p.icon}  ${p.text}`, {
      x: 0.7, y: 2.2 + i * 0.55, w: 5.6, h: 0.5,
      fontSize: 11, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // LTE 개선점
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.2, h: 5.3,
    fill: { color: "F0FAFF" }, rectRadius: 0.15,
    line: { color: COLOR.lte, width: 2 },
  });
  slide.addText("LTE 방식의 개선 효과", {
    x: 7.0, y: 1.5, w: 5.8, h: 0.5,
    fontSize: 16, color: COLOR.lte, bold: true, fontFace: "맑은 고딕",
  });

  const lteImprovements = [
    { icon: "✅", text: "전국 어디서나 통신 가능 (사각지대 제로)" },
    { icon: "✅", text: "끊김 없는 안정적 데이터 전송" },
    { icon: "✅", text: "단말기 하나로 독립 운영 (AP 의존 제거)" },
    { icon: "✅", text: "기상 조건에 영향 없는 통신 품질" },
    { icon: "✅", text: "유심 교체만으로 즉시 확장 가능" },
    { icon: "✅", text: "대역폭 보장, 동시접속 영향 최소" },
    { icon: "✅", text: "통신사 보안 인프라 활용 (보안 강화)" },
  ];

  lteImprovements.forEach((p, i) => {
    slide.addText(`${p.icon}  ${p.text}`, {
      x: 7.2, y: 2.2 + i * 0.55, w: 5.6, h: 0.5,
      fontSize: 11, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // 비용 비교
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 6.15, w: 12.7, h: 0.8,
    fill: { color: "E8F5E9" }, rectRadius: 0.08,
  });
  slide.addText(
    "💰 비용 비교:  AP 방식 (AP 장비 5대 기준) 약 500~800만원 + 연간 유지비 100만원  vs  LTE 방식 유심비 월 1~2만원/대, 초기비용 거의 없음",
    {
      x: 0.5, y: 6.2, w: 12.3, h: 0.7,
      fontSize: 11, color: COLOR.dark, bold: true, align: "center", fontFace: "맑은 고딕",
    }
  );
}

// ============================================================
// 13. 기대효과
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "08. 기대효과", "Expected Benefits");
  addFooter(slide);
  addSlideNumber(slide, 20, TOTAL_SLIDES);

  // 정량적 효과
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "E3F2FD" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 2 },
  });
  slide.addText("정량적 기대효과", {
    x: 0.6, y: 1.5, w: 5, h: 0.5,
    fontSize: 18, color: COLOR.primary, bold: true, fontFace: "맑은 고딕",
  });

  const quantEffects = [
    { metric: "재고 정확도", before: "85~90%", after: "99% 이상", icon: "📊" },
    { metric: "데이터 입력 시간", before: "건당 3~5분", after: "건당 10~20초", icon: "⏱️" },
    { metric: "오입력률", before: "5~8%", after: "0.1% 미만", icon: "✏️" },
    { metric: "상차 확인 시간", before: "30분/건", after: "5분/건", icon: "🚛" },
    { metric: "통신 장애 횟수", before: "월 10~20회", after: "월 0~1회", icon: "📶" },
    { metric: "인프라 유지비", before: "연 100만원+", after: "연 20만원 이하", icon: "💰" },
  ];

  quantEffects.forEach((eff, i) => {
    const y = 2.2 + i * 0.8;
    slide.addText(eff.icon, {
      x: 0.5, y: y, w: 0.5, h: 0.6, fontSize: 16, align: "center",
    });
    slide.addText(eff.metric, {
      x: 1.0, y: y, w: 1.6, h: 0.6,
      fontSize: 11, color: COLOR.primary, bold: true, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 2.7, y: y + 0.05, w: 1.6, h: 0.5,
      fill: { color: "FFCDD2" }, rectRadius: 0.05,
    });
    slide.addText(eff.before, {
      x: 2.7, y: y + 0.05, w: 1.6, h: 0.5,
      fontSize: 10, color: COLOR.red, align: "center", fontFace: "맑은 고딕",
    });
    slide.addText("→", {
      x: 4.35, y: y, w: 0.4, h: 0.6,
      fontSize: 14, color: COLOR.gray, align: "center", bold: true,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.8, y: y + 0.05, w: 1.6, h: 0.5,
      fill: { color: "C8E6C9" }, rectRadius: 0.05,
    });
    slide.addText(eff.after, {
      x: 4.8, y: y + 0.05, w: 1.6, h: 0.5,
      fontSize: 10, color: COLOR.green, align: "center", bold: true, fontFace: "맑은 고딕",
    });
  });

  // 정성적 효과
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 6.3, h: 5.5,
    fill: { color: "FFF8E1" }, rectRadius: 0.15,
    line: { color: COLOR.accent, width: 2 },
  });
  slide.addText("정성적 기대효과", {
    x: 7.1, y: 1.5, w: 5, h: 0.5,
    fontSize: 18, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });

  const qualEffects = [
    { title: "현장 업무 효율화", desc: "바코드 스캔 기반 자동화로\n수기 작업 제거, 업무 속도 향상" },
    { title: "실시간 데이터 연동", desc: "ERP(Oracle) 실시간 연동으로\n정보 지연 없는 의사결정 지원" },
    { title: "작업자 편의성 향상", desc: "사운드/진동 피드백, 다크모드,\n글꼴 크기 조절 등 현장 최적화 UX" },
    { title: "LTE 통신 안정성", desc: "야적장·야외 어디서나 끊김 없는\n안정적 통신으로 작업 연속성 보장" },
    { title: "인프라 비용 절감", desc: "AP 장비/배선 불필요, LTE 유심만으로\n운영하여 인프라 비용 대폭 절감" },
    { title: "확장 용이성", desc: "신규 기능/설비 추가 시\n웹앱 업데이트만으로 즉시 배포" },
  ];

  qualEffects.forEach((eff, i) => {
    const y = 2.2 + i * 0.75;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.0, y: y, w: 5.9, h: 0.65,
      fill: { color: i % 2 === 0 ? "FFF3E0" : COLOR.white }, rectRadius: 0.08,
    });
    slide.addText(eff.title, {
      x: 7.2, y: y, w: 1.8, h: 0.65,
      fontSize: 11, color: COLOR.accent, bold: true, fontFace: "맑은 고딕", valign: "middle",
    });
    slide.addText(eff.desc, {
      x: 9.0, y: y, w: 3.8, h: 0.65,
      fontSize: 10, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.3, valign: "middle",
    });
  });
}

// ============================================================
// 14. 향후 계획 + 마무리
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "09. 향후 계획", "Future Plans");
  addFooter(slide);
  addSlideNumber(slide, 21, TOTAL_SLIDES);

  // Phase 별 계획
  const phases = [
    {
      phase: "Phase 1 (완료)",
      color: COLOR.green,
      bgColor: "E8F5E9",
      items: [
        "적재위치관리 기능 구현",
        "스켈프 투입 기능 구현",
        "상차등록 기능 구현",
        "Oracle ERP 연동 완료",
        "LTE 기반 모바일 웹앱 배포",
      ],
    },
    {
      phase: "Phase 2 (계획)",
      color: COLOR.secondary,
      bgColor: "E3F2FD",
      items: [
        "입고 검수 기능 추가",
        "출하 관리 기능 확장",
        "재고 실사 기능 개발",
        "대시보드/통계 화면 추가",
        "Push 알림 기능 구현",
      ],
    },
    {
      phase: "Phase 3 (구상)",
      color: COLOR.accent,
      bgColor: "FFF3E0",
      items: [
        "AI 기반 재고 예측",
        "IoT 센서 연동 (온도/습도)",
        "RFID 태그 스캔 지원",
        "타 사업장 확대 적용",
        "실시간 모니터링 대시보드",
      ],
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.3 + i * 4.3;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.4, w: 4.0, h: 4.5,
      fill: { color: p.bgColor }, rectRadius: 0.15,
      line: { color: p.color, width: 2 },
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x, y: 1.4, w: 4.0, h: 0.6,
      fill: { color: p.color }, rectRadius: 0.15,
    });
    slide.addText(p.phase, {
      x: x, y: 1.4, w: 4.0, h: 0.6,
      fontSize: 15, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    });
    p.items.forEach((item, j) => {
      slide.addText(`✔  ${item}`, {
        x: x + 0.3, y: 2.2 + j * 0.6, w: 3.4, h: 0.5,
        fontSize: 11, color: COLOR.dark, fontFace: "맑은 고딕",
      });
    });
  });

  // 마무리 메시지
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 6.1, w: 12.7, h: 0.85,
    fill: { color: COLOR.primary }, rectRadius: 0.1,
  });
  slide.addText(
    "DA PDA 시스템을 통해 동아스틸의 스마트 물류 혁신을 실현하고, 지속적인 기능 확장으로 디지털 전환을 가속화하겠습니다.",
    {
      x: 0.5, y: 6.15, w: 12.3, h: 0.75,
      fontSize: 14, color: COLOR.white, bold: true, align: "center", fontFace: "맑은 고딕",
    }
  );
}

// ============================================================
// 22. AI 활용 개발 - Cursor AI
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR.white };
  addSectionTitle(slide, "AI 활용 개발 — Cursor AI", "AI-Powered Development with Cursor");
  addFooter(slide);
  addSlideNumber(slide, 22, TOTAL_SLIDES);

  // ── 왼쪽: AI 개발 도구 소개 + 활용 방식 ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 1.35, w: 4.1, h: 2.8,
    fill: { color: "EDE9FE" }, rectRadius: 0.15,
    line: { color: "7C3AED", width: 1.5 },
  });
  slide.addText("🤖  개발 도구", {
    x: 0.5, y: 1.4, w: 3.5, h: 0.45,
    fontSize: 15, color: "7C3AED", bold: true, fontFace: "맑은 고딕",
  });
  slide.addText("Cursor AI IDE", {
    x: 0.5, y: 1.85, w: 3.5, h: 0.4,
    fontSize: 20, color: COLOR.dark, bold: true, fontFace: "맑은 고딕",
  });
  slide.addText(
    "AI 코딩 어시스턴트가 내장된 차세대 IDE.\n" +
    "코드 생성·리팩토링·디버깅·문서화를\n" +
    "대화형으로 수행하여 개발 효율 극대화.",
    {
      x: 0.5, y: 2.3, w: 3.7, h: 1.0,
      fontSize: 10.5, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.5,
    }
  );
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.35, w: 3.5, h: 0.6,
    fill: { color: "7C3AED" }, rectRadius: 0.08,
  });
  slide.addText("DA PDA 시스템 전 과정을 Cursor AI로 개발", {
    x: 0.6, y: 3.35, w: 3.5, h: 0.6,
    fontSize: 10, color: COLOR.white, bold: true, align: "center",
    fontFace: "맑은 고딕", valign: "middle",
  });

  // ── 왼쪽 하단: 활용 영역 ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.3, y: 4.3, w: 4.1, h: 2.55,
    fill: { color: "F0F4F8" }, rectRadius: 0.15,
    line: { color: COLOR.secondary, width: 1.5 },
  });
  slide.addText("⚡  AI 활용 영역", {
    x: 0.5, y: 4.35, w: 3.5, h: 0.4,
    fontSize: 13, color: COLOR.secondary, bold: true, fontFace: "맑은 고딕",
  });
  const areas = [
    "React + TypeScript 프론트엔드 전체 코드 생성",
    "Node.js + Express 백엔드 API 설계·구현",
    "Oracle SP 연동 로직 자동 생성",
    "CSS 스타일링 및 반응형 레이아웃",
    "바코드 스캐너 연동 로직 구현",
    "PPT 결과보고서 자동 생성 스크립트",
  ];
  areas.forEach((a, i) => {
    slide.addText(`•  ${a}`, {
      x: 0.6, y: 4.8 + i * 0.32, w: 3.6, h: 0.3,
      fontSize: 9.5, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // ── 오른쪽 상단: 개발 생산성 향상 효과 ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.6, y: 1.35, w: 4.2, h: 3.0,
    fill: { color: "F0FDF4" }, rectRadius: 0.15,
    line: { color: COLOR.green, width: 1.5 },
  });
  slide.addText("📈  생산성 향상 효과", {
    x: 4.8, y: 1.4, w: 3.8, h: 0.45,
    fontSize: 13, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
  });

  const prodEffects = [
    { metric: "개발 속도", value: "3~5배 ↑", desc: "반복 코드·보일러플레이트 자동 생성" },
    { metric: "코드 품질", value: "일관성 ↑", desc: "베스트 프랙티스 기반 코드 제안" },
    { metric: "디버깅 시간", value: "70% ↓", desc: "오류 원인 분석 및 수정안 즉시 제안" },
    { metric: "문서화 비용", value: "80% ↓", desc: "주석·보고서·README 자동 생성" },
  ];
  prodEffects.forEach((e, i) => {
    const y = 1.95 + i * 0.55;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.8, y: y, w: 1.3, h: 0.42,
      fill: { color: COLOR.green }, rectRadius: 0.05,
    });
    slide.addText(e.value, {
      x: 4.8, y: y, w: 1.3, h: 0.42,
      fontSize: 10, color: COLOR.white, bold: true, align: "center",
      fontFace: "맑은 고딕",
    });
    slide.addText(e.metric, {
      x: 6.2, y: y, w: 1.2, h: 0.22,
      fontSize: 10, color: COLOR.green, bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(e.desc, {
      x: 6.2, y: y + 0.2, w: 2.4, h: 0.22,
      fontSize: 8.5, color: COLOR.gray, fontFace: "맑은 고딕",
    });
  });

  // ── 오른쪽 하단 왼: 장점 ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.6, y: 4.5, w: 4.2, h: 2.35,
    fill: { color: "FFF8E1" }, rectRadius: 0.15,
    line: { color: COLOR.accent, width: 1.5 },
  });
  slide.addText("✅  AI 개발의 장점", {
    x: 4.8, y: 4.55, w: 3.8, h: 0.4,
    fontSize: 13, color: COLOR.accent, bold: true, fontFace: "맑은 고딕",
  });
  const advantages = [
    "소규모 IT팀으로도 대규모 프로젝트 수행 가능",
    "프로토타입 → 운영 시스템 전환 기간 대폭 단축",
    "최신 기술 스택 즉시 적용 (React, TS, Vite…)",
    "반복적 코딩 작업 자동화로 핵심 로직에 집중",
    "개발자 역량과 무관하게 균일한 코드 품질 확보",
  ];
  advantages.forEach((a, i) => {
    slide.addText(`✔  ${a}`, {
      x: 4.8, y: 5.0 + i * 0.34, w: 3.8, h: 0.3,
      fontSize: 9.5, color: COLOR.dark, fontFace: "맑은 고딕",
    });
  });

  // ── 맨 오른쪽: 기대 효과 ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 9.0, y: 1.35, w: 4.0, h: 5.5,
    fill: { color: "EFF6FF" }, rectRadius: 0.15,
    line: { color: "3B82F6", width: 2 },
  });
  slide.addText("🚀  유발 가능한 효과", {
    x: 9.2, y: 1.4, w: 3.6, h: 0.5,
    fontSize: 14, color: "3B82F6", bold: true, fontFace: "맑은 고딕",
  });

  const futureEffects = [
    { title: "IT 내재화 가속", desc: "외주 의존도 감소\n자체 개발·유지보수 역량 확보", color: "3B82F6" },
    { title: "비용 절감", desc: "외주 개발비 50~70% 절감\n인건비 대비 높은 생산성", color: COLOR.green },
    { title: "빠른 현장 대응", desc: "현업 요구사항 즉시 반영\n기능 추가·수정 당일 배포 가능", color: COLOR.accent },
    { title: "디지털 전환 촉진", desc: "AI 도구 활용 경험 축적\n타 업무 시스템 확대 적용 기반", color: "7C3AED" },
    { title: "조직 경쟁력 강화", desc: "기술 내재화 + AI 활용 = \n스마트 팩토리 선도 기업으로 도약", color: COLOR.red },
  ];
  futureEffects.forEach((e, i) => {
    const y = 2.05 + i * 0.95;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.2, y: y, w: 3.6, h: 0.82,
      fill: { color: COLOR.white }, rectRadius: 0.08,
      line: { color: e.color, width: 1 },
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.3, y: y + 0.08, w: 0.08, h: 0.65,
      fill: { color: e.color }, rectRadius: 0.04,
    });
    slide.addText(e.title, {
      x: 9.55, y: y + 0.02, w: 3.1, h: 0.3,
      fontSize: 11, color: e.color, bold: true, fontFace: "맑은 고딕",
    });
    slide.addText(e.desc, {
      x: 9.55, y: y + 0.32, w: 3.1, h: 0.45,
      fontSize: 9, color: COLOR.dark, fontFace: "맑은 고딕",
      lineSpacingMultiple: 1.3,
    });
  });
}

// ============================================================
// 파일 저장
// ============================================================
const outputPath = "c:\\Users\\HDPARK\\Desktop\\da_pda\\DongaSteel_PDA_Report.pptx";
pptx.write("nodebuffer").then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("PPT 생성 완료:", outputPath);
  console.log("파일 크기:", (buffer.length / 1024).toFixed(1), "KB");
}).catch(err => {
  console.error("PPT 생성 실패:", err);
});
