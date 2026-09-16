import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { buildRenderContext, renderTemplate } from '../../src/compiler.mjs';
import { validatePiTheme, validateVscodeTheme } from '../../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));
const context = buildRenderContext(palette);

test('vscode theme uses strong neutral structure, cyan active focus and valid hex values', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'vscode.json.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'vscode.json.template');

  validateVscodeTheme(rendered);
  const theme = JSON.parse(rendered);
  assert.equal(theme.colors['editorIndentGuide.activeBackground'], palette.colors.base.borderStrong);
  assert.equal(theme.colors['sideBar.border'], palette.colors.base.borderStrong);
  assert.equal(theme.colors['list.activeSelectionForeground'], palette.colors.accents.cyan);
  assert.equal(theme.colors['list.inactiveSelectionBackground'], palette.colors.base.card);
});

test('pi theme satisfies schema and maps structural and focus borders properly', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'pi-theme.json.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'pi-theme.json.template');

  await validatePiTheme(rendered, ROOT_DIR);
  const theme = JSON.parse(rendered);
  assert.equal(theme.vars.borderStrong, palette.colors.base.borderStrong);
  assert.equal(theme.colors.border, 'borderStrong');
  assert.equal(theme.colors.borderMuted, 'border');
  assert.equal(theme.colors.borderAccent, 'cyan');
});
