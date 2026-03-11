@echo off
chcp 65001 >nul
setlocal

set "CONFIG=C:\da_pda\deploy\nginx-pda.conf"
set "NGINX_EXE="

:: nginx.exe 위치 찾기 (서버에서 압축 해제한 위치에 맞게 하나만 해당됨)
if exist "C:\da_pda\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx-1.26.2\nginx.exe"
if exist "C:\da_pda\nginx\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx\nginx-1.26.2\nginx.exe"
if exist "C:\nginx\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\nginx\nginx-1.26.2\nginx.exe"
if exist "C:\da_pda\nginx-1.29.5\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx-1.29.5\nginx.exe"

if not defined NGINX_EXE (
  echo [오류] nginx.exe 를 찾을 수 없습니다.
  echo.
  echo 다음 중 한 위치에 nginx 폴더가 있는지 확인하세요.
  echo   - C:\da_pda\nginx-1.26.2\
  echo   - C:\da_pda\nginx\nginx-1.26.2\
  echo   - C:\nginx\nginx-1.26.2\
  echo.
  echo nginx-1.26.2.zip 을 C:\da_pda 에 압축 해제하면
  echo   C:\da_pda\nginx-1.26.2\nginx.exe 가 생깁니다.
  pause
  exit /b 1
)

if not exist "%CONFIG%" (
  echo [오류] 설정 파일이 없습니다: %CONFIG%
  pause
  exit /b 1
)

echo Nginx 실행: "%NGINX_EXE%" -c "%CONFIG%"
"%NGINX_EXE%" -c "%CONFIG%"

if errorlevel 1 (
  echo.
  echo 실행 실패. 80 포트가 이미 사용 중이면 다른 프로그램을 확인하세요.
  pause
  exit /b 1
)

echo.
echo Nginx 가 백그라운드에서 실행 중입니다.
echo 접속: http://pda.dongasteel.co.kr 또는 http://pda.dongasteel.co.kr/login
echo 중지: 같은 폴더의 STOP-NGINX.bat 실행 또는 nginx -s stop
pause
