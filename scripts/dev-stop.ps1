param(
  [switch]$RemoveVolumes
)

$ErrorActionPreference = 'Stop'

function Write-Info {
  param([string]$Message)
  Write-Host "[SignalForge] $Message"
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

$scriptRoot = Split-Path -Parent $PSCommandPath
$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot '..')
$compose = Get-ComposeCommand
$composeArgs = @('down')

if ($RemoveVolumes) {
  Write-Warning 'Removing volumes deletes local MongoDB data for this repo, including synthetic demo data.'
  $composeArgs += '-v'
}

Write-Info 'Stopping local MongoDB.'
Push-Location $repoRoot
try {
  & $compose.File @($compose.Args + $composeArgs)
} finally {
  Pop-Location
}

Write-Info 'MongoDB stop command completed.'
Write-Info 'If API/web dev windows are open, close them with Ctrl+C in each window.'
