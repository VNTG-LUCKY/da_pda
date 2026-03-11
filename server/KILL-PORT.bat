@echo off
chcp 65001 >nul
REM 사용법: KILL-PORT.bat [포트번호]
REM 예: KILL-PORT.bat 5000   또는   KILL-PORT.bat 6000
set PORTNUM=%1
if "%PORTNUM%"=="" set PORTNUM=5000

echo ========================================
echo  포트 %PORTNUM% 사용 중인 프로세스 종료
echo ========================================
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORTNUM% ^| findstr LISTENING') do (
  echo PID %%a 종료 중...
  taskkill /PID %%a /F 2>nul
)
echo 완료. 이제 npm run start 또는 START-SERVER.bat 실행하세요.
pause
