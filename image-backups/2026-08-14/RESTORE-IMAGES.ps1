[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$archiveRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $archiveRoot '..\..')).Path
$manifestPath = Join-Path $archiveRoot 'MOVE-MANIFEST.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$archivePrefix = $archiveRoot + [IO.Path]::DirectorySeparatorChar
$projectPrefix = $projectRoot + [IO.Path]::DirectorySeparatorChar

$moves = foreach ($entry in $manifest.files) {
  $source = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.archivedPath))
  $destination = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.originalPath))

  if (-not $source.StartsWith($archivePrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Archived path escaped the quarantine: $source"
  }
  if (-not $destination.StartsWith((Join-Path $projectRoot 'assets') + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Restore destination escaped assets: $destination"
  }
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Archived file is missing: $source"
  }
  if (Test-Path -LiteralPath $destination) {
    throw "Restore refused because the destination already exists: $destination"
  }
  if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash -ne $entry.sha256) {
    throw "Archived file hash mismatch: $source"
  }

  [pscustomobject]@{ Source = $source; Destination = $destination }
}

foreach ($move in $moves) {
  $parent = Split-Path -Parent $move.Destination
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  Move-Item -LiteralPath $move.Source -Destination $move.Destination
}

Write-Output ("Restored {0} image/source files." -f $moves.Count)
Write-Output 'Code and metadata rollback copies are under backups/2026-08-14/prisma-abyss-asset-cleanup-prechange/.'
