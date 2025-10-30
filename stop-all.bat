@echo off
echo Stopping all Open Farm services...
echo.

echo Killing Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo Killing any remaining development servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000\|:3001\|:3002\|:3003\|:5000"') do (
    taskkill /f /pid %%a 2>nul
)

echo.
echo All services stopped!
echo Press any key to exit...
pause > nul
