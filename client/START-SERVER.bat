@echo off
chcp 65001 >nul
echo ========================================
echo  [1] 3000 포트 사용 중인 프로세스 종료
echo ========================================
REM 방법1: netstat으로 PID 찾아서 종료
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo PID %%a 종료 중...
  taskkill /PID %%a /F 2>nul
)
REM 방법2: PowerShell로 3000 포트 프로세스 강제 종료 (방법1이 실패해도 동작)
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo 포트 해제 대기 중 (5초)...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  [2] 프론트엔드 시작 (3000, /api -^> 6000)
echo ========================================
set PORT=3000
set BACKEND_URL=http://localhost:6000
node start-preview.cjs
pause
