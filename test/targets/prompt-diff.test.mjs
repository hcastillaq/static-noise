import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import toml from '@iarna/toml';

import { buildRenderContext, renderTemplate } from '../../src/compiler.mjs';
import { validateDeltaTheme, validateStarshipConfig, validateStarshipPalette } from '../../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const palette = JSON.parse(await readFile(path.join(ROOT_DIR, 'palette.json'), 'utf8'));
const context = buildRenderContext(palette);

test('starship config selects embedded static-noise palette and matches modular palette', async () => {
  const fullTemplate = await readFile(path.join(ROOT_DIR, 'templates', 'starship.toml.template'), 'utf8');
  const paletteTemplate = await readFile(path.join(ROOT_DIR, 'templates', 'starship-palette.template'), 'utf8');
  const fullRendered = renderTemplate(fullTemplate, context, 'starship.toml.template');
  const paletteRendered = renderTemplate(paletteTemplate, context, 'starship-palette.template');

  validateStarshipConfig(fullRendered);
  validateStarshipPalette(paletteRendered);

  const fullParsed = toml.parse(fullRendered);
  const paletteParsed = toml.parse(paletteRendered);
  assert.deepEqual(fullParsed.palettes['static-noise'], paletteParsed.palettes['static-noise']);
});

test('delta theme separates base diff from emphasis styles', async () => {
  const template = await readFile(path.join(ROOT_DIR, 'templates', 'delta-theme.template'), 'utf8');
  const rendered = renderTemplate(template, context, 'delta-theme.template');

  validateDeltaTheme(rendered);
  assert.match(rendered, /plus-style = syntax "#293B2C"/);
  assert.match(rendered, /plus-emph-style = syntax "#3A5C3E"/);
  assert.match(rendered, /minus-style = syntax "#48262E"/);
  assert.match(rendered, /minus-emph-style = syntax "#6B2B38"/);
});
