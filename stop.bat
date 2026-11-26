@echo off
setlocal
chcp 65001 >nul
set LOCALPORT=3307

echo Stopping SSH tunnel on port %LOCALPORT% ...
set FOUND=
for /f "tokens=5" %%p in ('netstat -ano ^| findstr LISTENING ^| findstr /C:":%LOCALPORT%"') do (
  set FOUND=1
  echo   killing PID %%p
  taskkill /PID %%p /F >nul 2>&1
)
if not defined FOUND echo   no listener found on %LOCALPORT%

echo.
echo Done. The backend window keeps running until you close it.
pause

endlocal