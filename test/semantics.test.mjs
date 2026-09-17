import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveToken, tokenEntries } from './helpers/palette.mjs';

const root = path.resolve(import.meta.dirname, '..');
const palette = JSON.parse(await readFile(path.join(root, 'palette.json'), 'utf8'));
const forbiddenNames = /neovim|vscode|ghostty|zellij|lualine|powerbar|button|sidebar|panel/i;

describe('semantics: preserves the visual identity vocabulary', () => {
  it('keeps required semantic and development domains', () => {
    expect(palette.semantic.surface).toBeDefined();
    expect(palette.semantic.content).toBeDefined();
    expect(palette.semantic.outline).toBeDefined();
    expect(palette.semantic.interaction).toBeDefined();
    expect(palette.semantic.status).toBeDefined();
    expect(palette.domains.syntax).toBeDefined();
    expect(palette.domains.diff).toBeDefined();
  });

  it('resolves every alias to a concrete color', () => {
    for (const { path: tokenPath, token } of tokenEntries(palette)) {
      expect(resolveToken(palette, token.$value), tokenPath).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('does not introduce tool or component names into the contract', () => {
    for (const { path: tokenPath } of tokenEntries(palette)) expect(tokenPath).not.toMatch(forbiddenNames);
  });
});
