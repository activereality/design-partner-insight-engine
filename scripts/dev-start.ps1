param(
  [switch]$EnableDemoTools,
  [switch]$SeedDemo
)

$ErrorActionPreference = 'Stop'

function Write-Info {
  param([string]$Message)
  Write-Host "[SignalForge] $Message"
}

function Require-Command {
  param(
    [string]$Name,
    [string]$InstallHint
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required. $InstallHint"
  }
}

function Get-ComposeCommand {
  if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    return @{ File = 'docker-compose'; Args = @() }
  }

  if (Get-Command docker -ErrorAction SilentlyContinue) {
    return @{ File = 'docker'; Args = @('compose') }
  }

  throw 'Docker Compose is required. Install Docker Desktop and ensure docker-compose or docker compose is available.'
}

function Set-EnvValue {
  param(
    [string]$Path,
    [string]$Key,
    [string]$Value
  )

  $lines = @(Get-Content -LiteralPath $Path)
  $pattern = "^\s*$([regex]::Escape($Key))="
  $found = $false

  $updated = foreach ($line in $lines) {
    if ($line -match $pattern) {
      $found = $true
      "$Key=$Value"
    } else {
      $line
    }
  }

  if (-not $found) {
    $updated += "$Key=$Value"
  }

  Set-Content -LiteralPath $Path -Value $updated -Encoding UTF8
}

function Wait-ForApiHealth {
  param([string]$HealthUrl)

  for ($attempt = 1; $attempt -le 30; $attempt++) {
    try {
      $health = Invoke-RestMethod -Uri $HealthUrl -Method Get -TimeoutSec 2
      if ($health.status -eq 'ok') {
        return $true
      }
    } catch {
      Start-Sleep -Seconds 1
    }
  }

  return $false
}

$scriptRoot = Split-Path -Parent $PSCommandPath
$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot '..')
$apiEnvExample = Join-Path $repoRoot 'apps/api/.env.example'
$apiEnv = Join-Path $repoRoot 'apps/api/.env'
$webEnvExample = Join-Path $repoRoot 'apps/web/.env.example'
$webEnv = Join-Path $repoRoot 'apps/web/.env'
$apiHealthUrl = 'http://localhost:3000/api/health'
$webUrl = 'http://127.0.0.1:5173'

Require-Command -Name 'node' -InstallHint 'Install Node.js before running the local app.'
Require-Command -Name 'pnpm' -InstallHint 'Install pnpm before running the local app.'
$compose = Get-ComposeCommand

if (-not (Test-Path -LiteralPath $apiEnv)) {
  Copy-Item -LiteralPath $apiEnvExample -Destination $apiEnv
  Write-Info 'Created apps/api/.env from .env.example.'
}

if (-not (Test-Path -LiteralPath $webEnv)) {
  Copy-Item -LiteralPath $webEnvExample -Destination $webEnv
  Write-Info 'Created apps/web/.env from .env.example.'
}

Set-EnvValue -Path $apiEnv -Key 'AI_PROVIDER' -Value 'mock'

if ($EnableDemoTools) {
  Set-EnvValue -Path $apiEnv -Key 'DEMO_TOOLS_ENABLED' -Value 'true'
  Write-Info 'Enabled local demo tools in apps/api/.env.'
} else {
  Write-Info 'Demo tools were not forced on. Use -EnableDemoTools for local demo seed/reset.'
}

Write-Info 'Starting MongoDB with Docker Compose.'
Push-Location $repoRoot
try {
  & $compose.File @($compose.Args + @('up', '-d'))
} finally {
  Pop-Location
}

$pwsh = Get-Command pwsh -ErrorAction SilentlyContinue
if ($pwsh) {
  $powerShellExe = $pwsh.Source
} else {
  $powerShellExe = (Get-Command powershell).Source
}

$repoRootLiteral = $repoRoot.Path.Replace("'", "''")
$apiCommand = "Set-Location -LiteralPath '$repoRootLiteral'; `$env:CI='true'; pnpm --filter @signalforge/api dev"
$webCommand = "Set-Location -LiteralPath '$repoRootLiteral'; `$env:CI='true'; pnpm --filter @signalforge/web dev -- --host 127.0.0.1"

Write-Info 'Starting API and web dev servers in separate PowerShell windows.'
Start-Process -FilePath $powerShellExe -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $apiCommand) -WorkingDirectory $repoRoot
Start-Process -FilePath $powerShellExe -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $webCommand) -WorkingDirectory $repoRoot

Write-Info "API health: $apiHealthUrl"
Write-Info "Web app: $webUrl"

if ($SeedDemo) {
  if (-not $EnableDemoTools) {
    Write-Info 'Demo seed was requested, but demo tools are not enabled. Rerun with -EnableDemoTools -SeedDemo.'
    exit 0
  }

  Write-Info 'Waiting for API health before seeding demo data.'
  if (-not (Wait-ForApiHealth -HealthUrl $apiHealthUrl)) {
    Write-Info 'API did not become healthy in time. You can seed later with: Invoke-RestMethod -Method Post http://localhost:3000/api/demo/seed'
    exit 0
  }

  try {
    $seed = Invoke-RestMethod -Uri 'http://localhost:3000/api/demo/seed' -Method Post -TimeoutSec 15
    Write-Info "Seeded demo project: $($seed.projectId)"
    Write-Info "Dashboard path: $($seed.dashboardPath)"
  } catch {
    Write-Info 'Demo seed did not complete. Confirm DEMO_TOOLS_ENABLED=true and rerun when the API is healthy.'
  }
}
