import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

import Ajv from 'ajv';
import toml from '@iarna/toml';
import luaparse from 'luaparse';
import yaml from 'yaml';

import { parseSimpleKdl } from './kdl.mjs';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const BARE_HEX = /^[0-9a-fA-F]{6}$/;
const RGB_TRIPLET = /^\d{1,3} \d{1,3} \d{1,3}$/;

export function validateGhosttyTheme(content) {
  const lines = content.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
  const config = new Map();
  const paletteEntries = new Map();

  for (const line of lines) {
    const [rawKey, ...rest] = line.split('=');
    const key = rawKey.trim();
    const value = rest.join('=').trim();
    if (key === 'palette') {
      const [slot, color] = value.split('=');
      paletteEntries.set(Number.parseInt(slot, 10), color);
      continue;
    }
    config.set(key, value);
  }

  const requiredKeys = ['background', 'foreground', 'selection-background', 'selection-foreground', 'cursor-color'];
  for (const key of requiredKeys) {
    assert.ok(config.has(key), `Ghostty theme missing "${key}"`);
    assert.match(config.get(key), HEX_COLOR, `Ghostty "${key}" must be hex`);
  }
  assert.equal(config.has('background-opacity'), false, 'Ghostty theme must not hardcode background-opacity');

  for (let slot = 0; slot < 16; slot += 1) {
    assert.ok(paletteEntries.has(slot), `Ghostty palette slot ${slot} missing`);
    assert.match(paletteEntries.get(slot), HEX_COLOR, `Ghostty palette slot ${slot} must be hex`);
  }
}

export function validateZellijTheme(content) {
  const root = parseSimpleKdl(content);
  const themesNode = root.children.find((node) => node.name === 'themes');
  assert.ok(themesNode, 'Missing "themes" node in Zellij theme');
  const themeNode = themesNode.children.find((node) => node.name === 'static-noise');
  assert.ok(themeNode, 'Missing "static-noise" theme node');

  const requiredComponents = [
    'text_unselected', 'text_selected', 'ribbon_unselected', 'ribbon_selected',
    'table_title', 'table_cell_unselected', 'table_cell_selected',
    'list_unselected', 'list_selected', 'frame_unselected', 'frame_selected',
    'frame_highlight', 'exit_code_success', 'exit_code_error',
  ];

  const components = new Map(themeNode.children.map((child) => [child.name, child]));
  const requiredColors = ['base', 'background', 'emphasis_0', 'emphasis_1', 'emphasis_2', 'emphasis_3'];

  for (const componentName of requiredComponents) {
    assert.ok(components.has(componentName), `Zellij missing component "${componentName}"`);
  }

  for (const componentName of requiredComponents) {
    const component = components.get(componentName);
    const colors = new Map(component.children.map((child) => [child.name, child.arguments]));
    for (const colorName of requiredColors) {
      const channels = colors.get(colorName);
      assert.ok(channels, `Zellij component "${componentName}" missing color "${colorName}"`);
      assert.match(channels.join(' '), RGB_TRIPLET, `Zellij ${componentName}.${colorName} must be an RGB triplet`);
      assert.ok(
        channels.every((channel) => Number.parseInt(channel, 10) <= 255),
        `Zellij ${componentName}.${colorName} channels must be between 0 and 255`,
      );
    }
  }
}

export function validateZellijLayout(content) {
  const root = parseSimpleKdl(content);
  const layoutNode = root.children.find((node) => node.name === 'layout');
  assert.ok(layoutNode, 'Missing "layout" root node');
  assert.equal(content.includes('default_bg'), false, 'Zellij layout must not set an opaque default_bg');
  assert.match(content, /mode_normal/, 'Layout missing mode_normal');
  assert.match(content, /tab_active/, 'Layout missing tab_active');
}

export function validateNeovimLua(content) {
  luaparse.parse(content, { comments: false, locations: true });
  assert.match(content, /borderStrong = "#[0-9A-Fa-f]{6}"/);
  assert.equal(content.includes('borderFocus'), false);
  assert.match(content, /Normal = \{ fg = palette\.text \}/);
  assert.match(content, /WinSeparator = \{ fg = palette\.borderStrong \}/);
  assert.match(content, /DiffAdd = \{ fg = palette\.green, bg = palette\.greenDim \}/);
  assert.match(content, /DiffDelete = \{ fg = palette\.red, bg = palette\.redDim \}/);
}

export function validateVscodeTheme(content) {
  const theme = JSON.parse(content);
  assert.equal(theme.name, 'Static Noise');
  assert.equal(theme.type, 'dark');
  assert.equal(theme.semanticHighlighting, true);
  assert.ok(theme.colors && typeof theme.colors === 'object');
  assert.ok(Array.isArray(theme.tokenColors) && theme.tokenColors.length > 0);
  assert.ok(theme.semanticTokenColors && typeof theme.semanticTokenColors === 'object');

  for (const [key, val] of Object.entries(theme.colors)) {
    assert.match(val, HEX_COLOR, `Invalid hex in colors["${key}"]: "${val}"`);
  }
  for (const [key, val] of Object.entries(theme.semanticTokenColors)) {
    const color = typeof val === 'string' ? val : val?.foreground;
    if (color) {
      assert.match(color, HEX_COLOR, `Invalid hex in semanticTokenColors["${key}"]: "${color}"`);
    }
  }
}

export async function validatePiTheme(content, rootDir) {
  const theme = JSON.parse(content);
  const schemaPath = path.join(rootDir, 'schemas', 'pi-theme.schema.json');
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);
  const valid = validate(theme);
  assert.ok(valid, `Pi theme schema errors: ${ajv.errorsText(validate.errors)}`);
}

export function validateFishColors(content) {
  const lines = content.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
  assert.ok(lines.some((line) => line.startsWith('set -g FZF_DEFAULT_OPTS')), 'Missing FZF_DEFAULT_OPTS');

  for (const line of lines) {
    if (!line.startsWith('set -g fish_')) continue;
    const tokens = line.split(/\s+/);
    for (const token of tokens.slice(3)) {
      if (token.startsWith('--background=')) {
        const [, val] = token.split('=');
        if (val) assert.match(val, BARE_HEX, `Fish background color must be bare hex: ${val}`);
      } else if (token.startsWith('--')) {
        continue;
      } else {
        assert.match(token, BARE_HEX, `Fish color must be bare hex: ${token}`);
      }
    }
  }
}

export function validateStarshipConfig(content) {
  const parsed = toml.parse(content);
  assert.equal(parsed.palette, 'static-noise', 'Starship config must select static-noise palette');
  assert.ok(parsed.palettes?.['static-noise'], 'Starship config must embed [palettes.static-noise]');
}

export function validateStarshipPalette(content) {
  const parsed = toml.parse(content);
  assert.ok(parsed.palettes?.['static-noise'], 'Modular palette must define [palettes.static-noise]');
}

export function validateBottomConfig(content) {
  const parsed = toml.parse(content);
  assert.equal(parsed.colors, undefined, 'bottom configuration must not use obsolete [colors] table');
  assert.ok(parsed.styles && typeof parsed.styles === 'object', 'bottom configuration must use [styles]');
}

export function validateLazygitTheme(content) {
  const parsed = yaml.parse(content);
  const theme = parsed?.gui?.theme;
  assert.ok(theme && typeof theme === 'object', 'Missing gui.theme in lazygit theme');
  const disallowed = [
    'searchingInactiveBorderColor', 'activeViewSelectedLineBgColor',
    'inactiveViewSelectedLineFgColor', 'activeViewSelectedLineFgColor',
    'selectedRangeBgColor', 'selectedRangeFgColor', 'stagedChangesColor',
  ];
  for (const key of disallowed) {
    assert.equal(theme[key], undefined, `Unsupported lazygit key present: ${key}`);
  }
  assert.ok(theme.activeBorderColor, 'Missing activeBorderColor');
  assert.ok(theme.inactiveBorderColor, 'Missing inactiveBorderColor');
}

export function validateDeltaTheme(content) {
  assert.match(content, /\[delta\]/, 'Delta theme missing [delta] section');
  assert.match(content, /plus-style/, 'Delta theme missing plus-style');
  assert.match(content, /plus-emph-style/, 'Delta theme missing plus-emph-style');
  assert.match(content, /minus-style/, 'Delta theme missing minus-style');
  assert.match(content, /minus-emph-style/, 'Delta theme missing minus-emph-style');
}

export async function validateTargetArtifact(target, content, { rootDir }) {
  switch (target.id) {
    case 'ghostty':
      return validateGhosttyTheme(content);
    case 'zellij-theme':
      return validateZellijTheme(content);
    case 'zellij-layout':
      return validateZellijLayout(content);
    case 'neovim':
      return validateNeovimLua(content);
    case 'vscode':
      return validateVscodeTheme(content);
    case 'pi':
      return validatePiTheme(content, rootDir);
    case 'fish-fzf':
      return validateFishColors(content);
    case 'starship-palette':
      return validateStarshipPalette(content);
    case 'starship':
      return validateStarshipConfig(content);
    case 'bottom':
      return validateBottomConfig(content);
    case 'lazygit':
      return validateLazygitTheme(content);
    case 'delta':
      return validateDeltaTheme(content);
    default:
      throw new Error(`No validator configured for target "${target.id}"`);
  }
}
