<#
PowerShell helper to set multiple GitHub repository secrets using the `gh` CLI.
Usage:
  .\scripts\set-github-secrets.ps1 -Repo 'Instawerx/QUANT-AI'
Requires: gh CLI authenticated (gh auth login)
#>
param(
  [string]$Repo = 'Instawerx/QUANT-AI'
)

$secrets = @(
  'INFURA_API_KEY',
  'ETHERSCAN_API_KEY',
  'FIREBASE_SERVICE_ACCOUNT_STAGING',
  'FIREBASE_PROJECT_ID_STAGING',
  'STAGING_DEPLOYER_PRIVATE_KEY',
  'STAGING_TREASURY_WALLET',
  'STAGING_FEE_COLLECTOR',
  'FIREBASE_SERVICE_ACCOUNT_PRODUCTION',
  'FIREBASE_PROJECT_ID_PRODUCTION',
  'PRODUCTION_DEPLOYER_PRIVATE_KEY',
  'PRODUCTION_TREASURY_WALLET',
  'PRODUCTION_FEE_COLLECTOR',
  'PRODUCTION_URL',
  'PRODUCTION_CONTRACT_ADDRESS',
  'CODECOV_TOKEN'
)

foreach ($s in $secrets) {
  Write-Host "Setting secret: $s"
  switch ($s) {
    'FIREBASE_SERVICE_ACCOUNT_STAGING' {
      $path = Join-Path -Path $PSScriptRoot -ChildPath '..\secrets\firebase-service-account.json'
      if (Test-Path $path) {
        gh secret set $s --body (Get-Content -Raw $path) --repo $Repo
      } else {
        Write-Host "Warning: $path not found — skipping $s"
      }
    }
    'FIREBASE_SERVICE_ACCOUNT_PRODUCTION' {
      $path = Join-Path -Path $PSScriptRoot -ChildPath '..\secrets\firebase-service-account.json'
      if (Test-Path $path) {
        gh secret set $s --body (Get-Content -Raw $path) --repo $Repo
      } else {
        Write-Host "Warning: $path not found — skipping $s"
      }
    }
    default {
      # Prompt for value securely for other secrets
      $val = Read-Host -AsSecureString "Enter value for $s" | ConvertFrom-SecureString
      gh secret set $s --body $val --repo $Repo
    }
  }
}

Write-Host "Done. Verify secrets via: gh secret list --repo $Repo"
