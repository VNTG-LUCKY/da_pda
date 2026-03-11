@echo off
chcp 65001 >nul
set "NGINX_EXE="
if exist "C:\da_pda\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx-1.26.2\nginx.exe"
if exist "C:\da_pda\nginx\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx\nginx-1.26.2\nginx.exe"
if exist "C:\nginx\nginx-1.26.2\nginx.exe" set "NGINX_EXE=C:\nginx\nginx-1.26.2\nginx.exe"
if exist "C:\da_pda\nginx-1.29.5\nginx.exe" set "NGINX_EXE=C:\da_pda\nginx-1.29.5\nginx.exe"
if not defined NGINX_EXE (
  echo nginx.exe 를 찾을 수 없습니다. START-NGINX.bat 과 같은 위치 기준으로 확인합니다.
  pause
  exit /b 1
)
"%NGINX_EXE%" -s stop 2>nul
echo Nginx 중지 요청을 보냈습니다.
pause
