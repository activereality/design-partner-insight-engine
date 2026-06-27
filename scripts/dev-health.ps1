$ErrorActionPreference = 'Stop'

function Write-Status {
  param(
    [string]$Name,
    [string]$Status,
    [string]$Detail = ''
  )

  if ($Detail) {
    Write-Host ("{0}: {1} - {2}" -f $Name, $Status, $Detail)
  } else {
    Write-Host ("{0}: {1}" -f $Name, $Status)
  }
}

function Get-ComposeCommand {
  if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    return @{ File = 'docker-compose'; Args = @() }
  }

  if (Get-Command docker -ErrorAction SilentlyContinue) {
    return @{ File = 'docker'; Args = @('compose') }
  }

  return $null
}

$scriptRoot = Split-Path -Parent $PSCommandPath
$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot '..')
$compose = Get-ComposeCommand

if (-not $compose) {
  Write-Status -Name 'MongoDB' -Status 'unknown' -Detail 'Docker Compose is not available.'
} else {
  Push-Location $repoRoot
  try {
    $composeOutput = & $compose.File @($compose.Args + @('ps')) 2>$null
    if ($LASTEXITCODE -eq 0 -and ($composeOutput -join "`n") -match 'signalforge-mongodb') {
      Write-Status -Name 'MongoDB' -Status 'ok' -Detail 'Compose service is present.'
    } else {
      Write-Status -Name 'MongoDB' -Status 'not running' -Detail 'Run scripts/dev-start.ps1 or docker-compose up -d.'
    }
  } catch {
    Write-Status -Name 'MongoDB' -Status 'unknown' -Detail 'Could not inspect Docker Compose.'
  } finally {
    Pop-Location
  }
}

try {
  $health = Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -Method Get -TimeoutSec 3
  if ($health.status -eq 'ok') {
    Write-Status -Name 'API' -Status 'ok' -Detail "database=$($health.database)"
  } else {
    Write-Status -Name 'API' -Status 'unhealthy'
  }
} catch {
  Write-Status -Name 'API' -Status 'not reachable' -Detail 'Expected http://localhost:3000/api/health.'
}

try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173' -Method Get -TimeoutSec 3
  if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
    Write-Status -Name 'Web' -Status 'ok' -Detail 'http://127.0.0.1:5173 responds.'
  } else {
    Write-Status -Name 'Web' -Status 'unexpected status' -Detail $response.StatusCode
  }
} catch {
  Write-Status -Name 'Web' -Status 'not reachable' -Detail 'Expected http://127.0.0.1:5173.'
}
