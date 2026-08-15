import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function waitFor(url, timeoutMs = 40000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(undefined);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
        } else {
          setTimeout(tick, 350);
        }
      });
    };
    tick();
  });
}

const vite = spawn('pnpm', ['exec', 'vite', '--config', 'ui/vite.config.ts'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

vite.on('exit', (code) => {
  if (code) process.exit(code ?? 1);
});

await waitFor('http://127.0.0.1:5173');

const env = { ...process.env, ELECTRON_RENDERER_URL: 'http://127.0.0.1:5173' };
delete env.ELECTRON_RUN_AS_NODE;

const electron = spawn('pnpm', ['exec', 'electron', '.'], {
  cwd: root,
  stdio: 'inherit',
  env,
});

electron.on('exit', (code) => {
  vite.kill();
  process.exit(code ?? 0);
});
