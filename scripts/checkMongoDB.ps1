# MongoDB Status Checker and Helper Script
Write-Host ""
Write-Host "=== MongoDB Status Checker ===" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB service exists and its status
$mongoService = Get-Service -Name *mongo* -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "MongoDB Service Found: $($mongoService.DisplayName)" -ForegroundColor Green
    Write-Host "Status: $($mongoService.Status)" -ForegroundColor White
    
    if ($mongoService.Status -ne 'Running') {
        Write-Host ""
        Write-Host "MongoDB is not running!" -ForegroundColor Yellow
        Write-Host "To start it, run: Start-Service $($mongoService.Name)" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "MongoDB is running!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now:" -ForegroundColor Cyan
        Write-Host "  1. Use MongoDB Compass: mongodb://localhost:27017" -ForegroundColor White
        Write-Host "  2. Run: node listUsers.js" -ForegroundColor White
        Write-Host "  3. Run: mongosh mongodb://localhost:27017/deshswaar_passport" -ForegroundColor White
    }
} else {
    Write-Host "MongoDB Service NOT Found" -ForegroundColor Red
    Write-Host ""
    Write-Host "MongoDB is not installed or not configured as a service." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Install MongoDB Community Server:" -ForegroundColor White
    Write-Host "     https://www.mongodb.com/try/download/community"
    Write-Host "  2. Use MongoDB Atlas (free cloud database):" -ForegroundColor White
    Write-Host "     https://www.mongodb.com/cloud/atlas"
    Write-Host "  3. Run mongod manually (if installed):" -ForegroundColor White
    Write-Host "     mongod --dbpath C:\data\db"
}

# Check if mongosh is installed
Write-Host ""
Write-Host "--- Checking MongoDB Shell (mongosh) ---" -ForegroundColor Cyan
$mongoshInstalled = Get-Command mongosh -ErrorAction SilentlyContinue
if ($mongoshInstalled) {
    Write-Host "mongosh is installed: $($mongoshInstalled.Source)" -ForegroundColor Green
} else {
    Write-Host "mongosh not found" -ForegroundColor Red
    Write-Host "Install from: https://www.mongodb.com/try/download/shell"
}

# Check Node.js scripts
Write-Host ""
Write-Host "--- Checking Database Scripts ---" -ForegroundColor Cyan
if (Test-Path ".\listUsers.js") {
    Write-Host "listUsers.js ready" -ForegroundColor Green
    Write-Host "Run: node listUsers.js"
} else {
    Write-Host "Not in scripts directory" -ForegroundColor Yellow
    Write-Host "Navigate to: cd scripts"
}

# Connection string info
Write-Host ""
Write-Host "--- Connection Information ---" -ForegroundColor Cyan
Write-Host "Database: deshswaar_passport" -ForegroundColor White
Write-Host "URI: mongodb://localhost:27017/deshswaar_passport" -ForegroundColor White
Write-Host ""
Write-Host "Full guide: README_DATABASE_ACCESS.md" -ForegroundColor Yellow
Write-Host ""
