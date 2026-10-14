<#
.SYNOPSIS
  Wires this context repo into Claude Code. Dry run by default; pass -Apply to write.

.DESCRIPTION
  1. ~/.claude/CLAUDE.md and ~/.claude-asseco/CLAUDE.md -> marked block importing core/CLAUDE.md
  2. <root>/CLAUDE.md per roots.json -> marked block with @imports (existing content kept)
  3. settings.json of both profiles -> merges settings/global.json (permissions union, marketplace, plugins)
  4. bin/* (claude-asseco wrappers) -> ~/.local/bin, which is added to the user PATH
  Every touched file is backed up to ~/.claude/backups/ai-context-<timestamp>/ first.
  Re-running is safe: the marked block is replaced, never duplicated.
#>
param([switch]$Apply)

$ErrorActionPreference = 'Stop'
$Repo = $PSScriptRoot -replace '\\', '/'
$ClaudeDir = Join-Path $env:USERPROFILE '.claude'
$AssecoDir = Join-Path $env:USERPROFILE '.claude-asseco'
$Profiles = @($ClaudeDir, $AssecoDir)
$BinDir = Join-Path $env:USERPROFILE '.local\bin'
$BackupDir = Join-Path $ClaudeDir ("backups/ai-context-" + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$Begin = '<!-- ai-context:begin (managed by ai-logic-claude-context/install.ps1) -->'
$End = '<!-- ai-context:end -->'
$Utf8 = New-Object System.Text.UTF8Encoding($false)

function Backup-File($path) {
    if (-not (Test-Path $path)) { return }
    $target = Join-Path $BackupDir (($path -replace '[:\\/]', '_'))
    if ($Apply) {
        New-Item -ItemType Directory -Force $BackupDir | Out-Null
        Copy-Item $path $target
    }
    Write-Host "  backup  $path"
}

function Set-ManagedBlock($file, [string[]]$imports) {
    $block = @($Begin) + ($imports | ForEach-Object { "@$Repo/$_" }) + @($End) -join "`n"
    $existing = if (Test-Path $file) { [IO.File]::ReadAllText($file) } else { '' }
    $pattern = '(?s)' + [regex]::Escape($Begin) + '.*?' + [regex]::Escape($End)
    if ($existing -match $pattern) {
        $new = [regex]::Replace($existing, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $block })
        $action = 'update'
    } elseif ($existing) {
        $new = $block + "`n`n" + $existing
        $action = 'prepend'
    } else {
        $new = $block + "`n"
        $action = 'create'
    }
    if ($new -eq $existing) { Write-Host "  ok      $file"; return }
    Backup-File $file
    Write-Host "  $action $file"
    $imports | ForEach-Object { Write-Host "            @$Repo/$_" }
    if ($Apply) { [IO.File]::WriteAllText($file, $new, $Utf8) }
}

function Test-InsideGitRepo($dir) {
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & git -C $dir rev-parse --is-inside-work-tree 2>&1 | Out-Null
    $inside = ($LASTEXITCODE -eq 0)
    $ErrorActionPreference = $previous
    return $inside
}

Write-Host ($(if ($Apply) { 'APPLY' } else { 'DRY RUN (use -Apply to write)' }))
$roots = Get-Content (Join-Path $Repo 'settings/roots.json') -Raw | ConvertFrom-Json

Write-Host "`n[1] Global CLAUDE.md (both profiles)"
foreach ($profileDir in $Profiles) {
    if ($Apply) { New-Item -ItemType Directory -Force $profileDir | Out-Null }
    Set-ManagedBlock (Join-Path $profileDir 'CLAUDE.md') $roots.global
}

Write-Host "`n[2] Root CLAUDE.md stubs"
foreach ($prop in $roots.roots.PSObject.Properties) {
    $dir = $prop.Name
    if (-not (Test-Path $dir)) { Write-Host "  skip    $dir (missing)"; continue }
    if (Test-InsideGitRepo $dir) { Write-Host "  skip    $dir (inside a git repo, would show as untracked)"; continue }
    Set-ManagedBlock (Join-Path $dir 'CLAUDE.md') @($prop.Value)
}

Write-Host "`n[3] Global settings.json (both profiles)"
$merge = @'
const fs = require('fs');
const [settingsPath, fragmentPath, apply] = process.argv.slice(2);
const cur = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, 'utf8')) : {};
const frag = JSON.parse(fs.readFileSync(fragmentPath, 'utf8'));
const union = (a = [], b = []) => [...new Set([...a, ...b])];
cur.permissions = cur.permissions || {};
for (const k of ['allow', 'ask', 'deny']) {
  if (frag.permissions && frag.permissions[k]) {
    const before = (cur.permissions[k] || []).length;
    cur.permissions[k] = union(cur.permissions[k], frag.permissions[k]);
    console.log(`  permissions.${k}: +${cur.permissions[k].length - before}`);
  }
}
cur.extraKnownMarketplaces = { ...(cur.extraKnownMarketplaces || {}), ...frag.extraKnownMarketplaces };
cur.enabledPlugins = { ...(cur.enabledPlugins || {}), ...frag.enabledPlugins };
console.log('  marketplaces: ' + Object.keys(frag.extraKnownMarketplaces).join(', '));
console.log('  plugins: ' + Object.keys(frag.enabledPlugins).join(', '));
if (apply === '1') fs.writeFileSync(settingsPath, JSON.stringify(cur, null, 2) + '\n');
'@
$mergeFile = Join-Path $env:TEMP 'ai-context-merge.js'
[IO.File]::WriteAllText($mergeFile, $merge, $Utf8)
foreach ($profileDir in $Profiles) {
    $settingsPath = Join-Path $profileDir 'settings.json'
    Write-Host "  $settingsPath"
    Backup-File $settingsPath
    & node $mergeFile $settingsPath (Join-Path $Repo 'settings/global.json') $(if ($Apply) { '1' } else { '0' })
}
Remove-Item $mergeFile

Write-Host "`n[4] claude-asseco wrappers -> $BinDir"
foreach ($wrapper in Get-ChildItem (Join-Path $Repo 'bin') -File) {
    $target = Join-Path $BinDir $wrapper.Name
    if ((Test-Path $target) -and ((Get-FileHash $target).Hash -eq (Get-FileHash $wrapper.FullName).Hash)) {
        Write-Host "  ok      $target"; continue
    }
    Write-Host "  copy    $target"
    if ($Apply) {
        New-Item -ItemType Directory -Force $BinDir | Out-Null
        Copy-Item $wrapper.FullName $target -Force
    }
}
$userPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
if (($userPath -split ';') -notcontains $BinDir) {
    Write-Host "  add     $BinDir to user PATH (open a new terminal afterwards)"
    if ($Apply) { [Environment]::SetEnvironmentVariable('PATH', ($userPath.TrimEnd(';') + ';' + $BinDir), 'User') }
} else {
    Write-Host "  ok      $BinDir is on user PATH"
}

Write-Host "`nDone. New sessions pick this up; running sessions are not affected."
if ($Apply) { Write-Host "Backups: $BackupDir" }
