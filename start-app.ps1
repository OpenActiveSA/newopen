# Open Farm Tennis Booking System - Startup Script
Write-Host "🚀 Starting Open Farm Tennis Booking System..." -ForegroundColor Green
Write-Host ""

# Kill any existing Node.js processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Backend API Server
Write-Host "🔧 Starting Backend API Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend API Server' -ForegroundColor Green; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Web App
Write-Host "🌐 Starting Web App..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'Web App Server' -ForegroundColor Green; npm run dev"

# Wait a moment for web app to start
Start-Sleep -Seconds 3

# Start Mobile App (optional)
Write-Host "📱 Starting Mobile App..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\mobile'; Write-Host 'Mobile App Server' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "✅ All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Web App: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "📱 Mobile App: Check mobile terminal for Expo details" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
