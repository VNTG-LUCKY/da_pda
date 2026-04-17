@echo off
REM client 폴더에서 더블클릭하지 말고, client 폴더에서 cmd로 실행하세요.
cd /d "%~dp0.."
node android\scripts\generate-mipmap-pngs.mjs
if errorlevel 1 pause
exit /b 0
