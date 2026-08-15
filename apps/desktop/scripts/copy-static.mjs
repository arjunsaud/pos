#!/usr/bin/env node
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'src/presentation/renderer');
const to = join(root, 'dist/presentation/renderer');

mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });
console.log('Copied renderer static files → dist/presentation/renderer');
