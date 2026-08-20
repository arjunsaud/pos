#!/usr/bin/env node
/**
 * Run the full local stack:
 * - Backend  → http://localhost:4000
 * - Frontend → http://localhost:3000
 * - Desktop  → Electron + Vite UI (same design as website, not embedded)
 *
 * Usage: pnpm dev:all
 */
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_URL = 'http://localhost:4000/api';
const REQUIRED_PORTS = [3000, 4000];

const children = [];
let shuttingDown = false;

function pidsOnPort(port) {
  try {
    const out = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, {
      encoding: 'utf8',
    }).trim();
    return out ? [...new Set(out.split(/\s+/).filter(Boolean))] : [];
  } catch {
    return [];
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function freePorts(ports) {
  for (const port of ports) {
    const pids = pidsOnPort(port);
    if (!pids.length) continue;
    console.log(`Port ${port} in use (PID ${pids.join(', ')}). Stopping…`);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), 'SIGTERM');
      } catch {
        // already gone
      }
    }
  }

  const deadline = Date.now() + 4000;
  while (Date.now() < deadline) {
    if (ports.every((port) => pidsOnPort(port).length === 0)) return;
    sleep(200);
  }

  for (const port of ports) {
    for (const pid of pidsOnPort(port)) {
      try {
        process.kill(Number(pid), 'SIGKILL');
      } catch {
        // ignore
      }
    }
  }
}

function run(name, args, env = {}) {
  const child = spawn('pnpm', args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
  });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (shuttingDown || signal) return;
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown(code);
    }
  });
  return child;
}

function runOnce(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', args, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, ...env },
      shell: process.platform === 'win32',
    });
    child.on('exit', (code) => {
      if (code && code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 200);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('Starting POS Nepal...');
console.log(`  Backend  → http://localhost:4000  (${API_URL})`);
console.log('  Frontend → http://localhost:3000');
console.log('  Desktop  → Electron (Vite :5173)');
console.log('');

freePorts(REQUIRED_PORTS);

try {
  await runOnce(['--filter', '@posnepal/shared', 'build']);

  run('backend', ['--filter', '@posnepal/backend', 'start:dev'], {
    HTTP_PORT: '4000',
    R2_BASE_URL: 'http://localhost:4000',
  });

  run('frontend', ['--filter', '@posnepal/frontend', 'dev'], {
    NEXT_PUBLIC_API_URL: API_URL,
  });

  run('desktop', ['--filter', '@posnepal/desktop', 'dev'], {
    VITE_API_URL: API_URL,
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  shutdown(1);
}
