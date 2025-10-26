@echo off
echo Starting Open Active Tennis Booking System...
echo.

echo 1. Starting Backend API Server...
start "Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

echo 2. Starting Web App...
start "Web App" cmd /k "cd /d %~dp0 && npm run dev"

echo 3. Starting Mobile App...
start "Mobile App" cmd /k "cd /d %~dp0mobile && npm start"

echo.
echo All services are starting up!
echo.
echo Web App: http://localhost:3000 (or next available port)
echo Backend API: http://localhost:5000
echo Mobile App: Check the mobile terminal for Expo details
echo.
echo Press any key to exit...
pause > nul
