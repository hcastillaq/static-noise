#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { publishArtifacts } from './compiler.mjs';
import { validateTargetArtifact } from './validate.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  const artifacts = await publishArtifacts({
    rootDir: ROOT_DIR,
    validate: (target, rendered, { rootDir }) => validateTargetArtifact(target, rendered, { rootDir }),
  });
  console.log(`⚡ Compiled and validated ${artifacts.size} artifacts successfully.`);
  for (const artifactPath of artifacts.keys()) {
    console.log(`  ✓ ${artifactPath}`);
  }
} catch (error) {
  console.error(`❌ Compilation failed: ${error.message}`);
  process.exit(1);
}
