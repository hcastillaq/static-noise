import Ajv from 'ajv';
import schema from '../../schemas/palette.schema.json' with { type: 'json' };

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const REFERENCE = /^\{([A-Za-z0-9_.-]+)\}$/;

export function tokenEntries(value, path = []) {
  if (!value || typeof value !== 'object') return [];
  if ('$value' in value) return [{ path: path.join('.'), token: value }];
  return Object.entries(value).flatMap(([key, child]) => tokenEntries(child, [...path, key]));
}

export function resolveToken(palette, reference, seen = new Set()) {
  const match = REFERENCE.exec(reference);
  if (!match) return reference;
  if (seen.has(match[1])) throw new Error(`Circular token reference: ${match[1]}`);
  const token = match[1].split('.').reduce((value, key) => value?.[key], palette);
  if (!token || typeof token.$value !== 'string') return undefined;
  return resolveToken(palette, token.$value, new Set([...seen, match[1]]));
}

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

export function validatePalette(palette, packageJson = palette) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  if (!ajv.validate(schema, palette)) throw new Error(`Palette schema validation failed: ${ajv.errorsText()}`);
  if (palette.version !== packageJson.version) throw new Error(`Palette version ${palette.version} does not match package version ${packageJson.version}`);
  for (const { path, token } of tokenEntries(palette)) {
    const value = resolveToken(palette, token.$value);
    if (!value || !HEX_COLOR.test(value)) throw new Error(`Invalid or unresolved color at ${path}`);
  }
  return true;
}
