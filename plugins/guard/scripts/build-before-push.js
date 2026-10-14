#!/usr/bin/env node
// PreToolUse: before a `git push` (only personal repos get this far, work pushes are blocked by push-guard),
// run the repo's build. Maven: mvn -B package -DskipTests. npm with a "build" script: npm run build.
// Anything else: no build check. A failed build blocks the push.
const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIT_PUSH = /\bgit(?:\.exe)?\s+(?:(?:-C\s+("[^"]+"|'[^']+'|\S+)|-c\s+\S+|--[\w-]+(?:=\S+)?)\s+)*push\b/i;

function repoRoot(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', timeout: 5000 }).trim();
  } catch {
    return null;
  }
}

function buildCommand(root) {
  if (fs.existsSync(path.join(root, 'pom.xml'))) return 'mvn -B -q package -DskipTests';
  const pkg = path.join(root, 'package.json');
  if (fs.existsSync(pkg)) {
    try {
      if (JSON.parse(fs.readFileSync(pkg, 'utf8')).scripts?.build) return 'npm run build --silent';
    } catch {}
  }
  return null;
}

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const command = (input.tool_input && input.tool_input.command) || '';
  const match = command.match(GIT_PUSH);
  if (!match || /--dry-run|--delete|\s-d\s/.test(command)) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const target = match[1] ? path.resolve(cwd, match[1].replace(/^["']|["']$/g, '')) : cwd;
  const root = repoRoot(target);
  if (!root) process.exit(0);

  // push-guard blocks work pushes in parallel; do not waste minutes building them
  try {
    const remotes = execFileSync('git', ['-C', root, 'remote', '-v'], { encoding: 'utf8', timeout: 5000 });
    if (/(adit\.sk|asseco|assecosk|aconsulting\.sk|alfabase\.sk|dcmc\.sk|\/\/gitlab\/)/i.test(remotes)) process.exit(0);
  } catch {}

  const build = buildCommand(root);
  if (!build) process.exit(0);

  const result = spawnSync(build, { cwd: root, shell: true, encoding: 'utf8', timeout: 570000 });
  if (result.status === 0) process.exit(0);

  const tail = `${result.stdout || ''}${result.stderr || ''}`.split('\n').slice(-30).join('\n');
  process.stderr.write(`BLOCKED by guard plugin: build failed in ${root} (${build}). Fix it before pushing.\n${tail}\n`);
  process.exit(2);
});
