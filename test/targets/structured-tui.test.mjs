import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { buildRenderContext, renderTemplate } from '../../src/compiler.mjs';
import { validateBottomConfig, validateLazygitTheme } from '../../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));
const context = buildRenderContext(palette);

test('bottom config adopts 0.14 styles schema and keeps widget backgrounds unset', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'bottom-colors.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'bottom-colors.template');

  validateBottomConfig(rendered);
  assert.match(rendered, /\[styles\.widgets\]/);
  assert.match(rendered, /border_color = "#6E7588"/);
  assert.match(rendered, /selected_border_color = "#72EAD5"/);
  assert.equal(rendered.includes('[colors]'), false);
  assert.equal(rendered.includes('\nbg_color ='), false);
});

test('lazygit theme emits only documented 0.64 theme keys with strong neutral inactive border', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'lazygit-theme.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'lazygit-theme.template');

  validateLazygitTheme(rendered);
  assert.match(rendered, /activeBorderColor:\s*\n\s*-\s*'#72EAD5'/);
  assert.match(rendered, /inactiveBorderColor:\s*\n\s*-\s*'#6E7588'/);
  assert.equal(rendered.includes('borderFocus'), false);
  assert.equal(rendered.includes('searchingInactiveBorderColor'), false);
  assert.equal(rendered.includes('selectedRangeBgColor'), false);
});
