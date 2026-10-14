@echo off
rem Starts Claude Code with the Asseco account (separate config dir, own login).
setlocal
set "ANTHROPIC_API_KEY="
set "ANTHROPIC_AUTH_TOKEN="
set "CLAUDE_CODE_OAUTH_TOKEN="
set "CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-asseco"
call claude %*
exit /b %ERRORLEVEL%
