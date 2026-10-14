#!/usr/bin/env node
// Keeps the two Claude accounts in their lanes, by profile AND by the account really logged in.
// Asseco account (monitored) is only for Asseco folders: prompts elsewhere are blocked, whichever profile it sits in.
// Asseco profile (CLAUDE_CONFIG_DIR=.claude-asseco) logged in with a non-Asseco account: blocked.
// Default profile inside Asseco folders is allowed, but warned loudly.
// Usage: account-guard.js session-start | prompt
const fs = require('fs');
const os = require('os');
const path = require('path');
const { isUnder, readStdinJson } = require('./lib');

const ASSECO_ROOTS = ['g:/nogames/asseco-android', 'g:/nogames/assecopodklady'];
// Adit copies of Asseco repos (adit remotes) belong to the Adit account.
const ADIT_EXCEPTIONS = ['g:/nogames/asseco-android/aditcopyprojects'];
const ASSECO_EMAIL = /@asseco[\w.-]*$/i;

const configDir = process.env.CLAUDE_CONFIG_DIR || '';
const isAssecoProfile = /[\\/]\.claude-asseco[\\/]?$/i.test(configDir);
const event = process.argv[2];

function isAssecoFolder(dir) {
  return isUnder(dir, ASSECO_ROOTS) && !isUnder(dir, ADIT_EXCEPTIONS);
}

// /login writes the account into <config dir>/.claude.json; without CLAUDE_CONFIG_DIR it is ~/.claude.json.
function loggedInEmail() {
  const file = configDir ? path.join(configDir, '.claude.json') : path.join(os.homedir(), '.claude.json');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).oauthAccount?.emailAddress || null;
  } catch {
    return null;
  }
}

function respond(output) {
  // writeSync: process.exit right after an async stdout write can drop the output
  fs.writeSync(1, JSON.stringify(output));
  process.exit(0);
}

// Blocks prompts; at session start it can only show the message.
function block(message) {
  if (event === 'prompt') respond({ decision: 'block', reason: message });
  respond({ systemMessage: message });
}

readStdinJson((input) => {
  const cwd = input.cwd || process.cwd();
  const inAsseco = isAssecoFolder(cwd);
  const email = loggedInEmail();
  const assecoAccount = email ? ASSECO_EMAIL.test(email) : isAssecoProfile;
  const profile = isAssecoProfile ? 'claude-asseco' : 'claude';

  if (isAssecoProfile && email && !assecoAccount) {
    block(
      `!!! PROFIL claude-asseco JE PRIHLASENY AKO ${email} - BLOKOVANE !!!\n` +
        'Daj /login s Asseco mailom (martin.tremko@asseco-int.com), alebo ukonci session a pouzi obycajny `claude`.'
    );
  }

  if (assecoAccount && !inAsseco) {
    const fix = isAssecoProfile
      ? 'Ukonci session a spusti tu obycajny `claude`.'
      : 'Default profil `claude` je omylom prihlaseny na Asseco ucet: daj /login s tremko@adit.sk (privatne okno prehliadaca).';
    block(
      `!!! ASSECO UCET (${email || 'claude-asseco'}) MIMO ASSECO PROJEKTOV (${cwd}) - BLOKOVANE !!!\n` +
        `${fix} Asseco ucet je len pre G:/nogames/asseco-android (bez aditCopyProjects) a G:/nogames/assecoPodklady.`
    );
  }

  if (!isAssecoProfile && assecoAccount && inAsseco) {
    const message =
      `!!! POZOR: DEFAULT PROFIL \`claude\` MA ASSECO UCET (${email}) !!! ` +
      'Na Asseco pracu pouzi `claude-asseco`. Default profil vrat na Adit: /login s tremko@adit.sk (privatne okno).';
    if (event === 'session-start') respond({ systemMessage: message });
    process.exit(0);
  }

  if (isAssecoProfile && event === 'session-start') {
    respond({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `This session runs on the Asseco account (${profile} profile, ${email || 'email unknown'}).`,
      },
    });
  }

  if (!isAssecoProfile && inAsseco && event === 'session-start') {
    respond({
      systemMessage:
        `!!! POZOR: ADIT UCET (${email || 'neznamy'}) V ASSECO PROJEKTE !!! Ak je to Asseco praca, ukonci session a spusti \`claude-asseco\`.`,
    });
  }

  process.exit(0);
});
