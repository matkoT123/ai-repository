# Machine environment (Windows 11)

- Shells: PowerShell 5.1 and Git Bash. Bash sometimes lacks coreutils; fall back to PowerShell.
- No `jq`, no `pandoc`. Use `node` (v20) or `py -3` for JSON and scripting. System `python` is 2.7.
- Write HTML or long files with the Write tool, not heredocs.
- Word `.docx`: read via python zipfile + `word/document.xml` (skip fldChar field-code spans). HTML to docx via LibreOffice needs `--infilter="HTML (StarWriter)"` and an isolated profile.
- JDK: several installed. Kotlin/Android builds need JDK 17 (`JAVA_HOME="C:\Program Files\Java\jdk-17"`); JDK 21 causes "Inconsistent JVM-target".
- After killing a Gradle build run `./gradlew --stop`, otherwise the daemon holds jars.
- Batch related shell steps into one call to reduce permission prompts.
- `claude-in-chrome` cannot see the user's own tabs. When the user is reading something in their browser, ask for screenshots.
