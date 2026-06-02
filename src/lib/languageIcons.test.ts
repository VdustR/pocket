import assert from "node:assert/strict";
import test from "node:test";
import { getLanguageIcon } from "./languageIcons";

test("getLanguageIcon maps GitHub languages to VSCode icon names", () => {
  assert.equal(getLanguageIcon("TypeScript"), "vscode-icons:file-type-typescript-official");
  assert.equal(getLanguageIcon("JavaScript"), "vscode-icons:file-type-js-official");
  assert.equal(getLanguageIcon("C#"), "vscode-icons:file-type-csharp");
  assert.equal(getLanguageIcon("Jupyter Notebook"), "vscode-icons:file-type-jupyter");
});

test("getLanguageIcon falls back when no reliable icon is mapped", () => {
  assert.equal(getLanguageIcon(null), null);
  assert.equal(getLanguageIcon("UnknownLang"), null);
});
