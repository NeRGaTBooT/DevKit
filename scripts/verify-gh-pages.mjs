import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const outDir = join(process.cwd(), "out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/DevKit";
const doubled = `${basePath}${basePath}`;
const extensions = new Set([".html", ".js", ".json", ".rsc", ".txt"]);
const offenders = [];

function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      scan(filePath);
      continue;
    }

    const ext = entry.slice(entry.lastIndexOf("."));
    if (!extensions.has(ext)) continue;

    const content = readFileSync(filePath, "utf8");
    if (content.includes(doubled)) {
      offenders.push(relative(process.cwd(), filePath));
    }
  }
}

if (!statSync(outDir).isDirectory()) {
  console.error("out/ not found. Run pnpm build:pages first.");
  process.exit(1);
}

scan(outDir);

if (offenders.length > 0) {
  console.error(`Found double basePath (${doubled}) in:`);
  for (const file of offenders) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}

console.log(`OK: no double basePath (${doubled}) in out/`);
