import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validatePalette } from '../src/validate.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

describe('Static Noise token contract', () => {
  it('matches the schema and package version', () => {
    expect(() => validatePalette(palette, packageJson)).not.toThrow();
  });

  it('uses canonical six-digit hex colors throughout the contract', () => {
    const colors = JSON.stringify(palette).match(/#[0-9A-Fa-f]+/g) ?? [];
    expect(colors.length).toBeGreaterThan(0);
    expect(colors.every((color) => /^#[0-9A-Fa-f]{6}$/.test(color))).toBe(true);
  });

  it('rejects the retired borderFocus token', () => {
    expect(() => validatePalette({ ...palette, colors: { ...palette.colors, base: { ...palette.colors.base, borderFocus: '#FFFFFF' } } }, packageJson)).toThrow(/borderFocus/);
  });
});
