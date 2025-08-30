$users = @(
    @{username = "STU2024001"; password = "student123"; role = "student"},
    @{username = "LEC2024001"; password = "lecturer123"; role = "supervisor"},
    @{username = "ADM2024001"; password = "admin123"; role = "admin"}
)

foreach ($user in $users) {
    Write-Host "Testing $($user.role) login: $($user.username)" -ForegroundColor Cyan
    
    $body = @{
        username = $user.username
        password = $user.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✅ $($user.role) login successful!" -ForegroundColor Green
        Write-Host "   Username: $($response.user.username)"
        Write-Host "   Role: $($response.user.role)"
        Write-Host "   Token received successfully!" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "❌ $($user.role) login failed:" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)"
        if ($_.ErrorDetails.Message) {
            Write-Host "   Details: $($_.ErrorDetails.Message)"
        }
        Write-Host ""
    }
}
