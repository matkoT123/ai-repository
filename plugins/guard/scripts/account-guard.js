#!/usr/bin/env node
// Keeps the two Claude accounts in their lanes.
// Asseco profile (CLAUDE_CONFIG_DIR=.claude-asseco, monitored) is only for Asseco folders: prompts elsewhere are blocked.
// Default Adit profile inside Asseco folders is allowed, but warned loudly.
// Usage: account-guard.js session-start | prompt
const fs = require('fs');
const { isUnder, readStdinJson } = require('./lib');

const ASSECO_ROOTS = ['g:/nogames/asseco-android', 'g:/nogames/assecopodklady'];
// Adit copies of Asseco repos (adit remotes) belong to the Adit account.
const ADIT_EXCEPTIONS = ['g:/nogames/asseco-android/aditcopyprojects'];

const isAssecoProfile = /[\\/]\.claude-asseco[\\/]?$/i.test(process.env.CLAUDE_CONFIG_DIR || '');
const event = process.argv[2];

function isAssecoFolder(dir) {
  return isUnder(dir, ASSECO_ROOTS) && !isUnder(dir, ADIT_EXCEPTIONS);
}

function respond(output) {
  // writeSync: process.exit right after an async stdout write can drop the output
  fs.writeSync(1, JSON.stringify(output));
  process.exit(0);
}

readStdinJson((input) => {
  const cwd = input.cwd || process.cwd();
  const inAsseco = isAssecoFolder(cwd);

  if (isAssecoProfile && !inAsseco) {
    const message =
      `!!! ASSECO UCET MIMO ASSECO PROJEKTOV (${cwd}) - BLOKOVANE !!!\n` +
      'Ukonci session a spusti tu obycajny `claude`. claude-asseco je len pre G:/nogames/asseco-android (bez aditCopyProjects) a G:/nogames/assecoPodklady.';
    if (event === 'prompt') respond({ decision: 'block', reason: message });
    respond({ systemMessage: message });
  }

  if (isAssecoProfile && event === 'session-start') {
    respond({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: 'This session runs on the Asseco account (claude-asseco profile).',
      },
    });
  }

  if (!isAssecoProfile && inAsseco && event === 'session-start') {
    respond({
      systemMessage:
        '!!! POZOR: ADIT UCET V ASSECO PROJEKTE !!! Ak je to Asseco praca, ukonci session a spusti `claude-asseco`.',
    });
  }

  process.exit(0);
});
