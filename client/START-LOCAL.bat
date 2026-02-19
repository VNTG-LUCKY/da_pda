@echo off
chcp 65001 >nul
echo ========================================
echo  로컬 개발용: 프론트 3000, /api -> 5000
echo  (백엔드는 별도 터미널에서 server 폴더에서 npm run dev)
echo ========================================
set PORT=3000
set BACKEND_URL=http://localhost:5000
node start-preview.cjs
pause
