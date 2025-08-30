$body = @{
    username = "STU2024001"
    password = "student123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "User: $($response.user.username)"
    Write-Host "Role: $($response.user.role)"
    Write-Host "Token: $($response.token)"
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message
}
