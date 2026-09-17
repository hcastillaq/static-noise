import Ajv from 'ajv';
import schema from '../schemas/palette.schema.json' with { type: 'json' };

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function parseHex(hex) {
  if (!HEX_COLOR.test(hex)) throw new Error(`Invalid color: ${hex}`);
  return hex.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16));
}

function relativeLuminance(hex) {
  return parseHex(hex).map((channel) => channel / 255).map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  )).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

export function contrastRatio(first, second) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function compositeHex(foreground, background, alpha) {
  if (alpha < 0 || alpha > 1) throw new Error(`Alpha must be between 0 and 1: ${alpha}`);
  const foregroundRgb = parseHex(foreground);
  const backgroundRgb = parseHex(background);
  const channels = foregroundRgb.map((channel, index) => Math.round(channel * alpha + backgroundRgb[index] * (1 - alpha)));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

export function validatePalette(palette, packageJson = palette) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  if (!ajv.validate(schema, palette)) throw new Error(`Palette schema validation failed: ${ajv.errorsText()}`);
  if (palette.version !== packageJson.version) throw new Error(`Palette version ${palette.version} does not match package version ${packageJson.version}`);
  if (!palette.colors.base.borderStrong || 'borderFocus' in palette.colors.base) throw new Error('Palette must expose borderStrong and must not expose borderFocus');
  if (contrastRatio(palette.colors.base.borderStrong, palette.colors.base.void) < 3) throw new Error('borderStrong must reach 3:1 contrast against void');
  return true;
}
