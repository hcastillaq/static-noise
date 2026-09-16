import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { buildRenderContext, renderTemplate } from '../../src/compiler.mjs';
import { validateGhosttyTheme, validateZellijLayout, validateZellijTheme } from '../../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));
const context = buildRenderContext(palette);

test('ghostty theme defines void root, neutral selection and cyan active cursor without opacity', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'ghostty.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'ghostty.template');

  validateGhosttyTheme(rendered);
  assert.match(rendered, new RegExp(`background = ${palette.colors.base.void}`));
  assert.match(rendered, new RegExp(`selection-background = ${palette.colors.base.selection}`));
  assert.match(rendered, new RegExp(`cursor-color = ${palette.colors.accents.cyan}`));
});

test('zellij theme provides 0.45 UI components using derived RGB triplets', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'zellij.kdl.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'zellij.kdl.template');

  validateZellijTheme(rendered);
  assert.match(rendered, /frame_unselected/);
  assert.match(rendered, /frame_selected/);
  assert.match(rendered, /frame_highlight/);
});

test('zellij layout keeps application panes transparent and styles zjstatus bounded areas', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'zellij-layout.kdl.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'zellij-layout.kdl.template');

  validateZellijLayout(rendered);
  assert.equal(rendered.includes('default_bg'), false);
  assert.match(rendered, /mode_normal/);
});
