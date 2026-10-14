#!/usr/bin/env node
// PreToolUse guard: blocks every `git push` that targets a work repo or work host.
// Personal pushes pass through to the normal permission prompt (settings: ask).
const { execFileSync } = require('child_process');
const path = require('path');
const { normalize, isUnder, readStdinJson } = require('./lib');

const WORK_ROOTS = [
  'g:/nogames/asseco-android',
  'g:/nogames/tipos-aconsulting-office',
  'g:/nogames/tasr',
  'g:/nogames/nds',
  'g:/nogames/nds_final_dufam',
  'g:/nogames/nds-funkcny-exchnage',
  'g:/nogames/nds-funkcny-hyperv-dc',
  'g:/nogames/praca',
  'g:/nogames/claude',
  'g:/nogames/assecopodklady',
  'g:/nogames/bookadlo',
  'd:/aconsulting_projects',
  'd:/mzv',
  'c:/projects',
];

const WORK_HOST = /(adit\.sk|asseco|assecosk|aconsulting\.sk|alfabase\.sk|dcmc\.sk|\/\/gitlab\/|@gitlab:)/i;
// `push` must be the git subcommand, optionally preceded by global options (-C dir, -c k=v, --no-pager)
const GIT_PUSH = /\bgit(?:\.exe)?\s+(?:(?:-C\s+("[^"]+"|'[^']+'|\S+)|-c\s+\S+|--[\w-]+(?:=\S+)?)\s+)*push\b/i;

function isUnderWorkRoot(dir) {
  return isUnder(dir, WORK_ROOTS);
}

function remotesOf(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'remote', '-v'], { encoding: 'utf8', timeout: 5000 });
  } catch {
    return '';
  }
}

function block(reason) {
  process.stderr.write(
    `BLOCKED by guard plugin: ${reason}\n` +
      'Work repositories are never pushed by Claude. Give the user the exact command and target URL; the user pushes manually.\n'
  );
  process.exit(2);
}

readStdinJson((input) => {
  const command = (input.tool_input && input.tool_input.command) || '';
  const match = command.match(GIT_PUSH);
  if (!match) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const cdMatch = command.match(/(?:^|[;&|]\s*)(?:cd|Set-Location)\s+("[^"]+"|'[^']+'|\S+)/i);
  const target = match[1] || (cdMatch && cdMatch[1]);
  const repoDir = target ? path.resolve(cwd, normalize(target.replace(/^["']|["']$/g, ''))) : cwd;

  if (WORK_HOST.test(command)) block('push command names a work host.');
  if (isUnderWorkRoot(repoDir) || isUnderWorkRoot(cwd)) block(`repository is under a work root (${repoDir}).`);
  if (WORK_HOST.test(remotesOf(repoDir))) block('repository has a work remote (adit/asseco).');

  process.exit(0);
});
