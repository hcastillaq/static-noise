import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { publishArtifacts, renderAllTargets } from '../src/compiler.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

async function makeFixture() {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), 'static-noise-test-'));
  await cp(path.join(ROOT_DIR, 'palette.json'), path.join(rootDir, 'palette.json'));
  await cp(path.join(ROOT_DIR, 'package.json'), path.join(rootDir, 'package.json'));
  await cp(path.join(ROOT_DIR, 'templates'), path.join(rootDir, 'templates'), { recursive: true });
  return rootDir;
}

test('rendering is deterministic and includes every published path', async () => {
  const first = await renderAllTargets({ rootDir: ROOT_DIR });
  const second = await renderAllTargets({ rootDir: ROOT_DIR });

  assert.deepEqual(first, second);
  assert.equal(first.size, 13);
  assert.ok(first.has('dist/palette.min.json'));
  assert.ok(first.has('dist/neovim/palette.lua'));
  assert.ok(first.has('dist/starship/static-noise-palette.toml'));
});

test('an unresolved token fails before an existing output directory changes', async () => {
  const rootDir = await makeFixture();
  const outputDir = path.join(rootDir, 'published');
  const markerPath = path.join(outputDir, 'marker.txt');
  await mkdir(outputDir, { recursive: true });
  await writeFile(markerPath, 'keep-me', 'utf8');

  const ghosttyPath = path.join(rootDir, 'templates', 'ghostty.template');
  const ghostty = await readFile(ghosttyPath, 'utf8');
  await writeFile(ghosttyPath, `${ghostty}\nbackground = {{colors.base.missing}}\n`, 'utf8');

  await assert.rejects(
    publishArtifacts({ rootDir, outputDir }),
    /Unknown palette token.*colors\.base\.missing/,
  );
  assert.equal(await readFile(markerPath, 'utf8'), 'keep-me');
});

test('a concrete color literal in a template is rejected', async () => {
  const rootDir = await makeFixture();
  const ghosttyPath = path.join(rootDir, 'templates', 'ghostty.template');
  const ghostty = await readFile(ghosttyPath, 'utf8');
  await writeFile(ghosttyPath, `${ghostty}\ncursor-color = #FFFFFF\n`, 'utf8');

  await assert.rejects(renderAllTargets({ rootDir }), /Concrete color literal/);
});
