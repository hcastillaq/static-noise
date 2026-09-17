import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { tokenEntries, validatePalette } from './helpers/palette.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

describe('schema: validates the DTCG token contract structure', () => {
  it('accepts the published palette and matches its package version', () => {
    expect(() => validatePalette(palette, packageJson)).not.toThrow();
  });

  it('exposes exactly the four public token layers', () => {
    expect(Object.keys(palette)).toEqual(['$schema', '$description', 'name', 'version', 'primitives', 'semantic', 'domains', 'projections']);
  });

  it('defines typed color tokens with non-empty descriptions', () => {
    for (const { path: tokenPath, token } of tokenEntries(palette)) {
      expect(token.$type, tokenPath).toBe('color');
      expect(token.$description, tokenPath).toBeTruthy();
    }
  });
});
