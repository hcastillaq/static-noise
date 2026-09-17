import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, resolveToken } from './helpers/palette.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));

function colorAt(reference) {
  return resolveToken(palette, reference);
}

describe('accessibility: protects structural and explicit foreground pairs', () => {
  it('keeps the structural outline at or above 3:1 against required surfaces', () => {
    const outline = colorAt(palette.semantic.outline.strong.$value);
    for (const surface of ['canvas', 'base', 'elevated']) {
      expect(contrastRatio(outline, colorAt(palette.semantic.surface[surface].$value)), surface).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps explicit onFocus content at or above 4.5:1', () => {
    const focus = colorAt(palette.semantic.interaction.focus.$value);
    const onFocus = colorAt(palette.semantic.interaction.onFocus.$value);
    expect(contrastRatio(focus, onFocus)).toBeGreaterThanOrEqual(4.5);
  });
});
