import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { buildRenderContext, renderTemplate } from '../../src/compiler.mjs';
import { validateFishColors, validateNeovimLua } from '../../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));
const context = buildRenderContext(palette);

test('neovim palette exports valid lua table with inherited normal background and distinct diffs', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'neovim.lua.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'neovim.lua.template');

  validateNeovimLua(rendered);
  assert.match(rendered, /borderStrong = "#6E7588"/);
  assert.equal(rendered.includes('borderFocus'), false);
  assert.match(rendered, /Normal = \{ fg = palette\.text \}/);
  assert.match(rendered, /WinSeparator = \{ fg = palette\.borderStrong \}/);
  assert.match(rendered, /CursorLineNr = \{ fg = palette\.cyan/);
});

test('fish colors use bare hex and fzf retains expected hex formatting', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'fish-colors.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'fish-colors.template');

  validateFishColors(rendered);
  assert.match(rendered, /set -g fish_color_command 72EAD5/);
  assert.match(rendered, /pointer:#72EAD5/);
});
