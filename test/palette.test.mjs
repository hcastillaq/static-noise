import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  buildRenderContext,
  compositeHex,
  contrastRatio,
} from '../src/compiler.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));

test('borderStrong is the canonical structural border and meets every contrast fixture', () => {
  assert.equal(palette.colors.base.borderStrong, '#6E7588');
  assert.equal('borderFocus' in palette.colors.base, false);

  const backgrounds = [
    palette.colors.base.void,
    compositeHex(palette.colors.base.void, '#000000', 0.9),
    compositeHex(palette.colors.base.void, '#808080', 0.9),
    compositeHex(palette.colors.base.void, '#FFFFFF', 0.9),
  ];

  for (const background of backgrounds) {
    assert.ok(
      contrastRatio(palette.colors.base.borderStrong, background) >= 3,
      `${palette.colors.base.borderStrong} must reach 3:1 against ${background}`,
    );
  }
});

test('target color representations derive from canonical palette values', () => {
  const context = buildRenderContext(palette);

  assert.equal(context.formats.hexBare.colors.base.borderStrong, '6E7588');
  assert.equal(context.formats.rgb.colors.base.borderStrong, '110 117 136');
  assert.equal(context.colors.base.borderStrong, '#6E7588');
});

test('palette and package versions stay aligned', async () => {
  const packageJson = JSON.parse(await readFile(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  assert.equal(palette.version, packageJson.version);
});
