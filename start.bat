@echo off
setlocal
chcp 65001 >nul

set "KEY=%USERPROFILE%\.ssh\public_key"
set "LOCALPORT=3307"
set "BACKEND=%~dp0backend"
set "LOG=%~dp0tunnel.log"

echo.
echo [1/3] SSH tunnel on port %LOCALPORT%
netstat -ano | findstr LISTENING | findstr /C:":%LOCALPORT%" >nul
if %errorlevel%==0 (
  echo       already running - skip
  goto tunnel_ok
)

echo       starting tunnel.cmd, waiting up to 20s ...
if exist "%LOG%" del "%LOG%"
start "tunnel-%LOCALPORT%" /min "%~dp0tunnel.cmd"

set /a TRIES=0
:poll
ping -n 2 127.0.0.1 >nul
netstat -ano | findstr LISTENING | findstr /C:":%LOCALPORT%" >nul
if %errorlevel%==0 goto tunnel_ok
set /a TRIES+=1
if %TRIES% LSS 15 goto poll

echo       ERROR: tunnel did not come up.
echo       --- tunnel.log ---
if exist "%LOG%" type "%LOG%"
echo       ------------------
pause
exit /b 1

:tunnel_ok
echo       tunnel is up

echo.
echo [2/3] backend folder
if not exist "%BACKEND%\package.json" (
  echo       ERROR: backend\package.json not found
  pause
  exit /b 1
)
echo       ok

echo.
echo [3/3] starting Next.js dev server on http://localhost:3000
echo       close this window to stop the backend
echo.
cd /d "%BACKEND%"
call npm run dev

endlocal