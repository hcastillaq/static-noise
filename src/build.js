#!/usr/bin/env node
// ==============================================================================
// Static Noise — Palette Compiler
// Reads palette.json and renders target templates into dist/
// ==============================================================================

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PALETTE_FILE = path.join(ROOT_DIR, 'palette.json');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// 1. Read palette tokens
const paletteRaw = fs.readFileSync(PALETTE_FILE, 'utf-8');
const palette = JSON.parse(paletteRaw);

console.log(`⚡ Compiling ${palette.name} v${palette.version}...`);

// Helper to resolve nested keys like "colors.base.surface"
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

// Replace {{key.path}} with value
function renderTemplate(templateContent, data) {
  return templateContent.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, keyPath) => {
    const val = getNestedValue(data, keyPath);
    if (val === undefined) {
      console.warn(`  ⚠️ Warning: Token not found: "${keyPath}"`);
      return match;
    }
    return val;
  });
}

// Ensure dist output subdirectories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Ensure clean dist dir
ensureDir(DIST_DIR);

// Targets mapping
const targets = [
  {
    template: 'ghostty.template',
    output: path.join(DIST_DIR, 'ghostty', 'static-noise'),
  },
  {
    template: 'zellij.kdl.template',
    output: path.join(DIST_DIR, 'zellij', 'static-noise.kdl'),
  },
  {
    template: 'neovim.lua.template',
    output: path.join(DIST_DIR, 'neovim', 'palette.lua'),
  },
  {
    template: 'vscode.json.template',
    output: path.join(DIST_DIR, 'vscode', 'static-noise-color-theme.json'),
    format: 'json',
  },
  {
    template: 'fish-colors.template',
    output: path.join(DIST_DIR, 'fish', 'static-noise-colors.fish'),
  },
  {
    template: 'starship-palette.template',
    output: path.join(DIST_DIR, 'starship', 'static-noise-palette.toml'),
  },
  {
    template: 'bottom-colors.template',
    output: path.join(DIST_DIR, 'bottom', 'static-noise-colors.toml'),
  },
  {
    template: 'lazygit-theme.template',
    output: path.join(DIST_DIR, 'lazygit', 'static-noise-theme.yml'),
  },
  {
    template: 'delta-theme.template',
    output: path.join(DIST_DIR, 'delta', 'static-noise.gitconfig'),
  },
  {
    template: 'pi-theme.json.template',
    output: path.join(DIST_DIR, 'pi', 'static-noise-theme.json'),
    format: 'json',
  },
];

for (const target of targets) {
  const templatePath = path.join(TEMPLATES_DIR, target.template);
  if (!fs.existsSync(templatePath)) {
    console.error(`  ❌ Template missing: ${templatePath}`);
    continue;
  }
  const content = fs.readFileSync(templatePath, 'utf-8');
  const rendered = renderTemplate(content, palette);

  if (rendered.includes('{{')) {
    throw new Error(`Unresolved token in ${target.template}`);
  }
  if (target.format === 'json') {
    JSON.parse(rendered);
  }

  ensureDir(path.dirname(target.output));
  fs.writeFileSync(target.output, rendered, 'utf-8');
  console.log(`  ✓ Generated: ${path.relative(ROOT_DIR, target.output)}`);
}

// Also emit a minified json palette in dist/
fs.writeFileSync(path.join(DIST_DIR, 'palette.min.json'), JSON.stringify(palette), 'utf-8');
console.log(`  ✓ Generated: dist/palette.min.json`);

console.log(`✅ Compilation finished successfully.`);
