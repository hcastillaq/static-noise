import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { publishArtifacts, renderAllTargets, TARGETS } from '../src/compiler.mjs';
import { validateTargetArtifact } from '../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

test('all generated targets compile and pass their specific validators', async () => {
  const artifacts = await renderAllTargets({
    rootDir: ROOT_DIR,
    validate: (target, rendered, { rootDir }) => validateTargetArtifact(target, rendered, { rootDir }),
  });

  assert.equal(artifacts.size, TARGETS.length + 1);
  for (const target of TARGETS) {
    assert.ok(artifacts.has(target.output), `Missing artifact for ${target.output}`);
    const content = artifacts.get(target.output);
    assert.ok(!content.includes('{{'), `${target.output} contains unresolved tokens`);
    assert.ok(!content.includes('borderFocus'), `${target.output} still references borderFocus`);
  }
});

test('compilation is byte-identical across two runs', async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), 'static-noise-build-'));
  await cp(path.join(ROOT_DIR, 'palette.json'), path.join(rootDir, 'palette.json'));
  await cp(path.join(ROOT_DIR, 'package.json'), path.join(rootDir, 'package.json'));
  await cp(path.join(ROOT_DIR, 'templates'), path.join(rootDir, 'templates'), { recursive: true });
  await cp(path.join(ROOT_DIR, 'schemas'), path.join(rootDir, 'schemas'), { recursive: true });

  const firstDir = path.join(rootDir, 'dist-one');
  const secondDir = path.join(rootDir, 'dist-two');

  const first = await publishArtifacts({
    rootDir,
    outputDir: firstDir,
    validate: (target, rendered) => validateTargetArtifact(target, rendered, { rootDir }),
  });
  const second = await publishArtifacts({
    rootDir,
    outputDir: secondDir,
    validate: (target, rendered) => validateTargetArtifact(target, rendered, { rootDir }),
  });

  assert.deepEqual([...first.entries()], [...second.entries()]);
  for (const artifactPath of first.keys()) {
    const rel = path.relative('dist', artifactPath);
    const firstContent = await readFile(path.join(firstDir, rel), 'utf8');
    const secondContent = await readFile(path.join(secondDir, rel), 'utf8');
    assert.equal(firstContent, secondContent, `Mismatch in ${rel}`);
  }
});
