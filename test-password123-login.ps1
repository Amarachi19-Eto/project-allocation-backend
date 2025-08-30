$username = "STU2024001"  # Try different usernames
$password = "password123"

$body = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Username: $($response.user.username)"
    Write-Host "Role: $($response.user.role)"
    Write-Host "Token received successfully!"
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
