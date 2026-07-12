import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/DevKit";

if (!existsSync(outDir)) {
  console.error("out/ directory not found. Run `pnpm build:pages` first.");
  process.exit(1);
}

writeFileSync(join(outDir, ".nojekyll"), "");

const swPath = join(outDir, "sw.js");
if (existsSync(swPath)) {
  const sw = readFileSync(swPath, "utf8");
  const patched = sw.replace(
    'const BASE_PATH = "";',
    `const BASE_PATH = "${basePath}";`,
  );
  writeFileSync(swPath, patched);
  console.log(`Patched sw.js with BASE_PATH="${basePath}"`);
} else {
  console.warn("sw.js not found in out/, skipping patch");
}

console.log("GitHub Pages artifacts ready in out/");
