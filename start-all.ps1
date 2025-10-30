Write-Host "Starting Open Farm Tennis Booking System..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Starting Backend API Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "2. Starting Web App..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Start-Sleep -Seconds 3

Write-Host "3. Starting Mobile App..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mobile; npm start"

Write-Host ""
Write-Host "All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Web App: http://localhost:3000 (or next available port)" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan  
Write-Host "Mobile App: Check the mobile terminal for Expo details" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
