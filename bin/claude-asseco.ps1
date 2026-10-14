# Starts Claude Code with the Asseco account (separate config dir, own login).
# Installed to ~/.local/bin by install.ps1. Environment changes are restored on exit.
$names = 'CLAUDE_CONFIG_DIR', 'ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN'
$saved = @{}
foreach ($n in $names) { $saved[$n] = [Environment]::GetEnvironmentVariable($n, 'Process') }
$code = 0
try {
    foreach ($n in $names) { [Environment]::SetEnvironmentVariable($n, $null, 'Process') }
    $env:CLAUDE_CONFIG_DIR = Join-Path $env:USERPROFILE '.claude-asseco'
    & claude @args
    $code = $LASTEXITCODE
} finally {
    foreach ($n in $names) { [Environment]::SetEnvironmentVariable($n, $saved[$n], 'Process') }
}
exit $code
