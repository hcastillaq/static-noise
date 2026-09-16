#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
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

  const resolvedArgs = target.nativeArgs.map((arg) => (
    arg.replace('{output}', path.join(ROOT_DIR, target.output))
  ));

  const run = spawnSync(target.nativeCommand, resolvedArgs, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: 'pipe',
  });

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
