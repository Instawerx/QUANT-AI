# Non-interactive secret uploader using gh CLI
# Usage: powershell -ExecutionPolicy Bypass -File scripts\set-github-secrets-auto.ps1 -Repo 'Instawerx/QUANT-AI'
param(
  [string]$Repo = 'Instawerx/QUANT-AI'
)

function Read-EnvFile {
  param([string]$Path)
  $hash = @{}
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) { return }
    $i = $line.IndexOf('=')
    if ($i -gt -1) {
      $k = $line.Substring(0,$i).Trim()
      $v = $line.Substring($i+1).Trim()
      $hash[$k] = $v
    }
  }
  return $hash
}

$envPath = Join-Path $PSScriptRoot '..\.env'
if (-not (Test-Path $envPath)) {
  Write-Error ".env not found at $envPath"
  exit 2
}
$env = Read-EnvFile -Path $envPath

# Read local firebase json if present
$saPath = Join-Path $PSScriptRoot '..\secrets\firebase-service-account.json'
$saExists = Test-Path $saPath
if ($saExists) {
  $sa = Get-Content -Raw $saPath
}

# Helper to set a secret only if value present
function Set-SecretIf($name, $value) {
  if (-not $value) { Write-Host ("Skipping {0}: no value" -f $name); return }
  Write-Host "Setting secret: $name"
  gh secret set $name --body $value --repo $Repo
}

# Shared
Set-SecretIf -name 'INFURA_API_KEY' -value ($env['INFURA_API_KEY'])
Set-SecretIf -name 'ETHERSCAN_API_KEY' -value ($env['ETHERSCAN_API_KEY'])

# Staging
if ($saExists) { Set-SecretIf -name 'FIREBASE_SERVICE_ACCOUNT_STAGING' -value $sa }
Set-SecretIf -name 'FIREBASE_PROJECT_ID_STAGING' -value ($env['FIREBASE_PROJECT_ID'])
# Use PRIVATE_KEY if provided else use HOT_WALLET_PRIVATE_KEY (mnemonic)
$stagingKey = $env['PRIVATE_KEY']
if (-not $stagingKey -or $stagingKey -match 'YOUR_') { $stagingKey = $env['HOT_WALLET_PRIVATE_KEY'] }
Set-SecretIf -name 'STAGING_DEPLOYER_PRIVATE_KEY' -value $stagingKey
Set-SecretIf -name 'STAGING_TREASURY_WALLET' -value ($env['TREASURY_WALLET_ADDRESS'])
Set-SecretIf -name 'STAGING_FEE_COLLECTOR' -value ($env['FEE_COLLECTOR_ADDRESS'])

# Production (mirror staging values unless different)
if ($saExists) { Set-SecretIf -name 'FIREBASE_SERVICE_ACCOUNT_PRODUCTION' -value $sa }
Set-SecretIf -name 'FIREBASE_PROJECT_ID_PRODUCTION' -value ($env['FIREBASE_PROJECT_ID'])
$prodKey = $env['PRIVATE_KEY']
if (-not $prodKey -or $prodKey -match 'YOUR_') { $prodKey = $env['HOT_WALLET_PRIVATE_KEY'] }
Set-SecretIf -name 'PRODUCTION_DEPLOYER_PRIVATE_KEY' -value $prodKey
Set-SecretIf -name 'PRODUCTION_TREASURY_WALLET' -value ($env['TREASURY_WALLET_ADDRESS'])
Set-SecretIf -name 'PRODUCTION_FEE_COLLECTOR' -value ($env['FEE_COLLECTOR_ADDRESS'])

Write-Host "Finished setting available secrets. Run 'gh secret list --repo $Repo' to verify."