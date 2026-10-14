// Shared path helpers for guard hooks.

function normalize(p) {
  let s = String(p || '').replace(/\\/g, '/').toLowerCase();
  const msys = s.match(/^\/([a-z])\/(.*)$/);
  if (msys) s = `${msys[1]}:/${msys[2]}`;
  return s.replace(/\/+$/, '');
}

function isUnder(dir, roots) {
  const d = normalize(dir);
  return roots.some((root) => d === root || d.startsWith(root + '/'));
}

function readStdinJson(callback) {
  let raw = '';
  process.stdin.on('data', (chunk) => (raw += chunk));
  process.stdin.on('end', () => {
    try {
      callback(JSON.parse(raw));
    } catch {
      process.exit(0);
    }
  });
}

module.exports = { normalize, isUnder, readStdinJson };
