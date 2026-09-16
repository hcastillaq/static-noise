import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const VSCODE_THEME_PATH = path.join(ROOT_DIR, 'dist', 'vscode', 'static-noise-color-theme.json');

test('generated vscode theme exists and is valid', async () => {
  await stat(VSCODE_THEME_PATH);
  const raw = await readFile(VSCODE_THEME_PATH, 'utf-8');
  assert.ok(!raw.includes('{{'), 'Theme must not contain unparsed template tokens');

  const theme = JSON.parse(raw);
  assert.equal(theme.name, 'Static Noise');
  assert.equal(theme.type, 'dark');
  assert.equal(theme.semanticHighlighting, true);

  assert.ok(theme.colors && typeof theme.colors === 'object');
  assert.ok(Array.isArray(theme.tokenColors) && theme.tokenColors.length > 0);
  assert.ok(theme.semanticTokenColors && typeof theme.semanticTokenColors === 'object');

  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  for (const [key, color] of Object.entries(theme.colors)) {
    assert.match(color, hexRegex, `theme.colors["${key}"] must be a valid hex color`);
  }

  for (const [token, value] of Object.entries(theme.semanticTokenColors)) {
    const color = typeof value === 'string' ? value : value?.foreground;
    if (color) {
      assert.match(color, hexRegex, `semanticTokenColors["${token}"] must be a valid hex color`);
    }
  }

  for (const rule of theme.tokenColors) {
    if (rule.settings?.foreground) {
      assert.match(rule.settings.foreground, hexRegex, `tokenColors rule "${rule.name}" foreground must be a valid hex color`);
    }
  }
});
