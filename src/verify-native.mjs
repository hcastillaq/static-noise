#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { mkdtemp, mkdir, copyFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isStrict = process.argv.includes('--strict');
const compatibility = JSON.parse(await readFile(path.join(ROOT_DIR, 'compatibility.json'), 'utf8'));

console.log(`🔎 Running native target verification (${isStrict ? 'STRICT' : 'DEVELOPMENT'})...`);
let failures = 0;

for (const [id, target] of Object.entries(compatibility.targets)) {
  const binaryCheck = spawnSync('which', [target.nativeCommand], { stdio: 'pipe' });
  const isAvailable = binaryCheck.status === 0;

  if (!isAvailable) {
    if (isStrict) {
      console.error(`  ❌ [${id}] Native binary "${target.nativeCommand}" is missing (required in strict mode)`);
      failures += 1;
    } else {
      console.log(`  ⚠️  [${id}] Native binary "${target.nativeCommand}" not installed; equivalent test validator covers this target`);
    }
    continue;
  }

  let tempConfigDir = null;
  if (target.nativeArgs.some((arg) => arg.includes('{tempThemeDir}'))) {
    tempConfigDir = await mkdtemp(path.join(os.tmpdir(), 'static-noise-zellij-'));
    const themesDir = path.join(tempConfigDir, 'themes');
    await mkdir(themesDir, { recursive: true });
    await copyFile(path.join(ROOT_DIR, target.output), path.join(themesDir, 'static-noise.kdl'));
  }

  const resolvedArgs = target.nativeArgs.map((arg) => (
    arg
      .replace('{output}', path.join(ROOT_DIR, target.output))
      .replace('{tempThemeDir}', tempConfigDir || '')
  ));

  const run = spawnSync(target.nativeCommand, resolvedArgs, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (tempConfigDir) {
    await rm(tempConfigDir, { recursive: true, force: true });
  }

  if (run.status === 0) {
    console.log(`  ✓ [${id}] Verified with ${target.nativeCommand} ${target.version}`);
  } else {
    console.error(`  ❌ [${id}] ${target.nativeCommand} failed with exit code ${run.status}`);
    if (run.stderr) console.error(run.stderr.trim());
    failures += 1;
  }
}

if (failures > 0) {
  process.exit(1);
}
