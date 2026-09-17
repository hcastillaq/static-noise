import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { colorValues, validatePalette } from './helpers/palette.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

const requiredGroups = {
  colors: ['base', 'text', 'accents', 'dim', 'diff'],
  base: ['void', 'surface', 'card', 'cardHover', 'border', 'borderStrong', 'selection'],
  text: ['foreground', 'soft', 'muted', 'dim'],
  accents: ['cyan', 'blue', 'purple', 'magenta', 'green', 'yellow', 'orange', 'red'],
  dim: ['cyan', 'blue', 'purple', 'magenta', 'green', 'yellow', 'orange', 'red'],
  diff: ['added', 'addedEmphasis', 'removed', 'removedEmphasis'],
  ansi: ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite'],
};

describe('Static Noise token contract', () => {
  it('matches the schema and package version', () => {
    expect(() => validatePalette(palette, packageJson)).not.toThrow();
  });

  it('contains every canonical group and role', () => {
    for (const [group, roles] of Object.entries(requiredGroups)) {
      const target = group === 'colors' ? palette.colors : palette[group] ?? palette.colors[group];
      expect(target, group).toBeDefined();
      for (const role of roles) expect(target[role], `${group}.${role}`).toBeDefined();
    }
  });

  it('uses six-digit hexadecimal values for every color token', () => {
    const values = colorValues(palette);
    expect(values.length).toBeGreaterThan(0);
    for (const { path: tokenPath, value } of values) expect(value, tokenPath).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('rejects the retired borderFocus token', () => {
    const invalidPalette = { ...palette, colors: { ...palette.colors, base: { ...palette.colors.base, borderFocus: palette.colors.base.border } } };
    expect(() => validatePalette(invalidPalette, packageJson)).toThrow(/borderFocus/);
  });
});
