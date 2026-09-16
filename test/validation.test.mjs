import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { TARGETS } from '../src/compiler.mjs';
import {
  validateBottomConfig,
  validateFishColors,
  validateLazygitTheme,
  validateNeovimLua,
  validateZellijTheme,
} from '../src/validate.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

test('compatibility.json covers every compiler target exactly once', async () => {
  const compatibility = JSON.parse(await readFile(path.join(ROOT_DIR, 'compatibility.json'), 'utf8'));
  const registeredTargets = new Set(Object.keys(compatibility.targets));

  for (const target of TARGETS) {
    assert.ok(registeredTargets.has(target.id), `Target "${target.id}" is missing from compatibility.json`);
    registeredTargets.delete(target.id);
  }
  registeredTargets.delete('zjstatus');
  assert.equal(registeredTargets.size, 0, `compatibility.json has extra targets: ${[...registeredTargets].join(', ')}`);
});

test('negative fixtures fail target validators with descriptive errors', () => {
  assert.throws(() => validateNeovimLua('local x = { a = 1 b = 2 }'), /expected near 'b'/i);
  assert.throws(() => validateBottomConfig('[colors]\nborder_color = "#fff"\n'), /obsolete \[colors\]/);
  assert.throws(() => validateLazygitTheme('gui:\n  theme:\n    searchingInactiveBorderColor: ["#fff"]\n'), /Unsupported lazygit key/);
  assert.throws(
    () => validateFishColors('set -g FZF_DEFAULT_OPTS "--color=bg:#000"\nset -g fish_color_command #72EAD5\n'),
    /bare hex/,
  );
  assert.throws(() => validateZellijTheme('themes {\n  static-noise {\n    text_unselected { base 0 0 0; background 0 0 0; }\n  }\n}\n'), /missing component/i);
});
