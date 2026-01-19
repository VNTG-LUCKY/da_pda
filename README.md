# DA PDA Project

안드로이드 PDA 프로젝트입니다. 처음에는 웹으로 구성하고 이후 웹앱으로 전환할 예정입니다.

## 프로젝트 구조

```
da_pda/
├── client/          # 프론트엔드 (React + TypeScript)
└── server/          # 백엔드 (Node.js + TypeScript + Express)
```

## 기술 스택

### Client (프론트엔드)
- React 18
- TypeScript
- Vite
- React Router

### Server (백엔드)
- Node.js
- TypeScript
- Express
- CORS
- Oracle Database (oracledb)

## 시작하기

### Client 실행

```bash
cd client
npm install
npm run dev
```

Client는 `http://localhost:3000`에서 실행됩니다.

### Server 실행

```bash
cd server
npm install
npm run dev
```

Server는 `http://localhost:5000`에서 실행됩니다.

## 개발 스크립트

### Client
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 미리보기
- `npm run lint` - ESLint 실행

### Server
- `npm run dev` - 개발 서버 실행 (ts-node-dev)
- `npm run build` - TypeScript 컴파일
- `npm start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 환경 변수

Server의 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
PORT=5000
NODE_ENV=development

# Oracle Database Configuration
DB_USER=daerp
DB_PASSWORD=daerp#2018
DB_CONNECTION_STRING=172.17.1.56:1521/DAERP
```

## 데이터베이스 설정

### Oracle Database 연결 정보
- **서버 주소**: 172.17.1.56:1521/DAERP
- **사용자명**: daerp
- **비밀번호**: daerp#2018

### DB 연결 테스트

서버가 실행된 후 다음 엔드포인트로 데이터베이스 연결을 테스트할 수 있습니다:

```
GET http://localhost:5000/api/db/test
```

성공하면 현재 시간(SYSDATE)이 반환됩니다.

### 주의사항
- 개발 PC에 Oracle Client가 설치되어 있어야 합니다.
- Oracle Instant Client가 설치되어 있지 않다면 설치가 필요할 수 있습니다.

