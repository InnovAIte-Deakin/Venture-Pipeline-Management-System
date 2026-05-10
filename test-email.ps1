# PowerShell script to test welcome email
$body = @{
    email = "hardik.mittal343@gmail.com"
    firstName = "Test"
    lastName = "User"
    ventureName = "Test Venture"
    position = "Founder"
} | ConvertTo-Json

Write-Host "Testing welcome email..."
Write-Host "Request body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/email/test-welcome" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Success: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error details: $responseBody"
    }
}
