import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REMOVED_TOOL_SLUGS = [
  "css-reference",
  "html-reference",
  "canvas-reference",
  "js-reference",
  "http-status",
  "git-commands",
  "tutorials",
  "js-tutorial",
  "tutorial",
  "tutorial-editor",
];

const FILES_TO_CHECK = [
  "lib/tools/registry.ts",
  "lib/tools/ready-components.ts",
];

let failed = false;

for (const relativePath of FILES_TO_CHECK) {
  const content = readFileSync(join(root, relativePath), "utf8");

  for (const slug of REMOVED_TOOL_SLUGS) {
    if (content.includes(`"${slug}"`)) {
      console.error(`${relativePath}: removed slug "${slug}" is still referenced`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("validate:slugs OK");
