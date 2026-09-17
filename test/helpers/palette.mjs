import Ajv from 'ajv';
import schema from '../../schemas/palette.schema.json' with { type: 'json' };

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

export function colorValues(value, path = []) {
  if (typeof value === 'string' && value.startsWith('#')) return [{ path: path.join('.'), value }];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => colorValues(child, [...path, key]));
}

export function validatePalette(palette, packageJson = palette) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  if (!ajv.validate(schema, palette)) throw new Error(`Palette schema validation failed: ${ajv.errorsText()}`);
  if (palette.version !== packageJson.version) throw new Error(`Palette version ${palette.version} does not match package version ${packageJson.version}`);
  if (!palette.colors.base.borderStrong || 'borderFocus' in palette.colors.base) throw new Error('Palette must expose borderStrong and must not expose borderFocus');
  const invalidColors = colorValues(palette).filter(({ value }) => !HEX_COLOR.test(value));
  if (invalidColors.length) throw new Error(`Invalid colors: ${invalidColors.map(({ path }) => path).join(', ')}`);
  return true;
}
