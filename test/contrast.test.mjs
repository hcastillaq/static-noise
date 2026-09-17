import { describe, expect, it } from 'vitest';
import { compositeHex, contrastRatio } from '../src/validate.mjs';

const borderStrong = '#6E7588';
const voidColor = '#0F1117';

describe('token contrast', () => {
  it('keeps borderStrong at or above 3:1 against required backgrounds', () => {
    const backgrounds = [
      voidColor,
      compositeHex(voidColor, '#000000', 0.9),
      compositeHex(voidColor, '#808080', 0.9),
      compositeHex(voidColor, '#FFFFFF', 0.9),
    ];
    for (const background of backgrounds) expect(contrastRatio(borderStrong, background)).toBeGreaterThanOrEqual(3);
  });
});
