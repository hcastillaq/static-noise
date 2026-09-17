import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './helpers/palette.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));
const { borderStrong, void: voidColor } = palette.colors.base;

describe('token contrast', () => {
  it('keeps the structural border at or above 3:1 against required backgrounds', () => {
    const backgrounds = [
      voidColor,
      palette.colors.base.surface,
      palette.colors.base.card,
    ];
    for (const background of backgrounds) expect(contrastRatio(borderStrong, background)).toBeGreaterThanOrEqual(3);
  });
});
