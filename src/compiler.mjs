import { mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const TEMPLATE_COLOR = /#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?\b/;

export const TARGETS = Object.freeze([
  { id: 'ghostty', template: 'ghostty.template', output: 'dist/ghostty/static-noise' },
  { id: 'zellij-theme', template: 'zellij.kdl.template', output: 'dist/zellij/static-noise.kdl' },
  { id: 'zellij-layout', template: 'zellij-layout.kdl.template', output: 'dist/zellij/layouts/default.kdl' },
  { id: 'neovim', template: 'neovim.lua.template', output: 'dist/neovim/palette.lua' },
  { id: 'vscode', template: 'vscode.json.template', output: 'dist/vscode/static-noise-color-theme.json' },
  { id: 'fish-fzf', template: 'fish-colors.template', output: 'dist/fish/static-noise-colors.fish' },
  { id: 'starship-palette', template: 'starship-palette.template', output: 'dist/starship/static-noise-palette.toml' },
  { id: 'starship', template: 'starship.toml.template', output: 'dist/starship/starship.toml' },
  { id: 'bottom', template: 'bottom-colors.template', output: 'dist/bottom/static-noise-colors.toml' },
  { id: 'lazygit', template: 'lazygit-theme.template', output: 'dist/lazygit/static-noise-theme.yml' },
  { id: 'delta', template: 'delta-theme.template', output: 'dist/delta/static-noise.gitconfig' },
  { id: 'pi', template: 'pi-theme.json.template', output: 'dist/pi/static-noise-theme.json' },
]);

function parseHex(hex) {
  if (!HEX_COLOR.test(hex)) {
    throw new Error(`Invalid six-digit hex color: ${hex}`);
  }
  return hex.slice(1).match(/../g).map((part) => Number.parseInt(part, 16));
}

function formatColorTree(value, formatter) {
  if (typeof value === 'string' && HEX_COLOR.test(value)) {
    return formatter(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatColorTree(item, formatter));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, formatColorTree(item, formatter)]),
    );
  }
  return value;
}

export function buildRenderContext(palette) {
  return {
    ...palette,
    formats: {
      hexBare: formatColorTree(palette, (hex) => hex.slice(1)),
      rgb: formatColorTree(palette, (hex) => parseHex(hex).join(' ')),
    },
  };
}

function relativeLuminance(hex) {
  const [red, green, blue] = parseHex(hex)
    .map((channel) => channel / 255)
    .map((channel) => (
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    ));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

export function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

export function compositeHex(foreground, background, alpha) {
  if (alpha < 0 || alpha > 1) {
    throw new Error(`Alpha must be between 0 and 1: ${alpha}`);
  }
  const foregroundRgb = parseHex(foreground);
  const backgroundRgb = parseHex(background);
  const channels = foregroundRgb.map((channel, index) => (
    Math.round((channel * alpha) + (backgroundRgb[index] * (1 - alpha)))
  ));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function getNestedValue(object, keyPath) {
  return keyPath.split('.').reduce((current, part) => (
    current && current[part] !== undefined ? current[part] : undefined
  ), object);
}

export function renderTemplate(templateContent, context, templateName = 'template') {
  return templateContent.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_match, keyPath) => {
    const value = getNestedValue(context, keyPath);
    if (value === undefined) {
      throw new Error(`[${templateName}] Unknown palette token: ${keyPath}`);
    }
    if (value && typeof value === 'object') {
      throw new Error(`[${templateName}] Palette token does not resolve to a scalar: ${keyPath}`);
    }
    return String(value);
  });
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function renderAllTargets({ rootDir, validate } = {}) {
  const palettePath = path.join(rootDir, 'palette.json');
  const packagePath = path.join(rootDir, 'package.json');
  const templatesDir = path.join(rootDir, 'templates');
  const palette = JSON.parse(await readFile(palettePath, 'utf8'));
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));

  if (palette.version !== packageJson.version) {
    throw new Error(`palette.json version ${palette.version} does not match package.json ${packageJson.version}`);
  }
  if (palette.colors?.base?.borderStrong === undefined) {
    throw new Error('palette.json is missing colors.base.borderStrong');
  }
  if (palette.colors?.base?.borderFocus !== undefined) {
    throw new Error('palette.json still defines retired token colors.base.borderFocus');
  }

  const context = buildRenderContext(palette);
  const artifacts = new Map();

  for (const target of TARGETS) {
    const templatePath = path.join(templatesDir, target.template);
    if (!(await pathExists(templatePath))) {
      throw new Error(`[${target.id}] Template missing: ${target.template}`);
    }
    const template = await readFile(templatePath, 'utf8');
    if (TEMPLATE_COLOR.test(template)) {
      throw new Error(`[${target.id}] Concrete color literal found in ${target.template}`);
    }
    const rendered = renderTemplate(template, context, target.template);
    if (rendered.includes('{{')) {
      throw new Error(`[${target.id}] Unresolved template expression in ${target.template}`);
    }
    if (validate) {
      await validate(target, rendered, { palette, packageJson, rootDir });
    }
    artifacts.set(target.output, rendered);
  }

  artifacts.set('dist/palette.min.json', JSON.stringify(palette));
  return artifacts;
}

export async function publishArtifacts({ rootDir, outputDir = path.join(rootDir, 'dist'), validate } = {}) {
  const artifacts = await renderAllTargets({ rootDir, validate });
  const parentDir = path.dirname(outputDir);
  const outputName = path.basename(outputDir);
  await mkdir(parentDir, { recursive: true });
  const temporaryDir = await mkdtemp(path.join(parentDir, `.${outputName}.tmp-`));
  const backupDir = path.join(parentDir, `.${outputName}.backup-${process.pid}-${Date.now()}`);
  let movedExisting = false;

  try {
    for (const [artifactPath, content] of artifacts) {
      const relativePath = path.relative('dist', artifactPath);
      const destination = path.join(temporaryDir, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, content, 'utf8');
    }

    if (await pathExists(outputDir)) {
      await rename(outputDir, backupDir);
      movedExisting = true;
    }
    await rename(temporaryDir, outputDir);
    if (movedExisting) {
      await rm(backupDir, { recursive: true, force: true });
    }
  } catch (error) {
    await rm(temporaryDir, { recursive: true, force: true });
    if (movedExisting && !(await pathExists(outputDir)) && await pathExists(backupDir)) {
      await rename(backupDir, outputDir);
    }
    throw error;
  }

  return artifacts;
}
