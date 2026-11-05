$base = 'http://localhost:3001'
$tests = @(
    @{ name = 'System Health (Public GET)'; method = 'GET'; path = '/api/system/health'; exp = 200 },
    @{ name = 'Enquiry Export (Protected GET)'; method = 'GET'; path = '/api/enquiries/export'; exp = 401 },
    @{ name = 'Enquiry List (Protected GET)'; method = 'GET'; path = '/api/enquiries'; exp = 401 },
    @{ name = 'Activity Logs (Protected GET)'; method = 'GET'; path = '/api/logs'; exp = 401 },
    @{ name = 'User Management (Protected GET)'; method = 'GET'; path = '/api/user'; exp = 401 },
    @{ name = 'Database Backup (Protected GET)'; method = 'GET'; path = '/api/system/backup'; exp = 401 },
    @{ name = 'System Errors (Protected GET)'; method = 'GET'; path = '/api/system/errors'; exp = 401 },
    @{ name = 'System Redirects (Protected GET)'; method = 'GET'; path = '/api/system/redirects'; exp = 401 },
    @{ name = 'Files List (Protected GET)'; method = 'GET'; path = '/api/files'; exp = 401 },
    @{ name = 'CKEditor Upload (Protected POST)'; method = 'POST'; path = '/api/upload'; exp = 401 },
    @{ name = 'FileManager Upload (Protected POST)'; method = 'POST'; path = '/api/files/upload'; exp = 401 },
    @{ name = 'Product Creation (Protected POST)'; method = 'POST'; path = '/api/products'; exp = 401 },
    @{ name = 'Product Update (Protected PUT)'; method = 'PUT'; path = '/api/products/test-id'; exp = 401 },
    @{ name = 'Product Deletion (Protected DELETE)'; method = 'DELETE'; path = '/api/products/test-id'; exp = 401 },
    @{ name = 'Category Update (Protected PUT)'; method = 'PUT'; path = '/api/categories/test-id'; exp = 401 },
    @{ name = 'Category Deletion (Protected DELETE)'; method = 'DELETE'; path = '/api/categories/test-id'; exp = 401 },
    @{ name = 'Enquiry Status Update (Protected PUT)'; method = 'PUT'; path = '/api/enquiries/test-id'; exp = 401 },
    @{ name = 'Enquiry Deletion (Protected DELETE)'; method = 'DELETE'; path = '/api/enquiries/test-id'; exp = 401 },
    @{ name = 'Dashboard Access (Protected Route)'; method = 'GET'; path = '/dashboard'; exp = 307 },
    @{ name = 'Enquiry Submission Validation (Public POST)'; method = 'POST'; path = '/api/enquiries'; body = '{}'; exp = 400 },
    @{ name = 'Enquiry Honeypot Defense (Bot Trap)'; method = 'POST'; path = '/api/enquiries'; body = '{"website":"spam-bot.com"}'; exp = 201 },
    @{ name = 'Login Validation (Public POST)'; method = 'POST'; path = '/api/auth/login'; body = '{}'; exp = 400 },
    @{ name = 'Logout Clearing (Public POST)'; method = 'POST'; path = '/api/auth/logout'; exp = 200 }
)

Write-Host "=================================================="
Write-Host "  PHASE 4.0.2 LIVE SECURITY REGRESSION TEST SUITE"
Write-Host "=================================================="

$passed = 0
$failed = 0

foreach ($t in $tests) {
    $url = $base + $t.path
    $statusCode = 0
    $bodyContent = ''
    try {
        if ($t.method -eq 'GET') {
            $req = [System.Net.HttpWebRequest]::Create($url)
            $req.Method = 'GET'
            $req.AllowAutoRedirect = $false
            $resp = $req.GetResponse()
            $statusCode = [int]$resp.StatusCode
            $resp.Close()
        } elseif ($t.method -eq 'POST') {
            $req = [System.Net.HttpWebRequest]::Create($url)
            $req.Method = 'POST'
            $req.ContentType = 'application/json'
            $req.AllowAutoRedirect = $false
            if ($t.body) {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($t.body)
                $req.ContentLength = $bytes.Length
                $stream = $req.GetRequestStream()
                $stream.Write($bytes, 0, $bytes.Length)
                $stream.Close()
            } else {
                $req.ContentLength = 0
            }
            $resp = $req.GetResponse()
            $statusCode = [int]$resp.StatusCode
            $resp.Close()
        } elseif ($t.method -eq 'PUT') {
            $req = [System.Net.HttpWebRequest]::Create($url)
            $req.Method = 'PUT'
            $req.ContentType = 'application/json'
            $req.AllowAutoRedirect = $false
            $req.ContentLength = 0
            $resp = $req.GetResponse()
            $statusCode = [int]$resp.StatusCode
            $resp.Close()
        } elseif ($t.method -eq 'DELETE') {
            $req = [System.Net.HttpWebRequest]::Create($url)
            $req.Method = 'DELETE'
            $req.AllowAutoRedirect = $false
            $resp = $req.GetResponse()
            $statusCode = [int]$resp.StatusCode
            $resp.Close()
        }
    } catch [System.Net.WebException] {
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $bodyContent = $reader.ReadToEnd()
            $reader.Close()
        } else {
            $statusCode = -1
            $bodyContent = $_.Exception.Message
        }
    } catch {
        $statusCode = -2
        $bodyContent = $_.Exception.Message
    }

    $expected = $t.exp
    $testName = $t.name
    if ($statusCode -eq $expected) {
        $passed++
        Write-Host "[PASS] $testName -> HTTP $statusCode (Expected $expected)" -ForegroundColor Green
    } else {
        $failed++
        Write-Host "[FAIL] $testName -> HTTP $statusCode (Expected $expected) Details: $bodyContent" -ForegroundColor Red
    }
}

Write-Host "=================================================="
Write-Host "TOTAL PASSED: $passed / $($tests.Count)"
Write-Host "TOTAL FAILED: $failed / $($tests.Count)"
Write-Host "=================================================="

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}

