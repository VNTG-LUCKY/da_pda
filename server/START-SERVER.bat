@echo off
chcp 65001 >nul
echo ========================================
echo  [1] 6000 포트 사용 중인 프로세스 종료
echo ========================================
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :6000 ^| findstr LISTENING') do (
  echo PID %%a 종료 중...
  taskkill /PID %%a /F 2>nul
)
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo  [2] 백엔드 시작 (6000)
echo ========================================
set PORT=6000
npm run dev
pause
