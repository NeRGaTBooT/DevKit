import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "out");
const previewDir = join(root, ".pages-preview");
const devKitDir = join(previewDir, "DevKit");
const port = process.env.PORT ?? "3000";

if (!existsSync(outDir)) {
  console.error("out/ not found. Run `pnpm build:pages` first.");
  process.exit(1);
}

rmSync(previewDir, { recursive: true, force: true });
mkdirSync(devKitDir, { recursive: true });
cpSync(outDir, devKitDir, { recursive: true });

const url = `http://localhost:${port}/DevKit/`;
console.log(`Serving GitHub Pages preview at ${url}`);

const child = spawn("npx", ["serve", previewDir, "-l", port], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
