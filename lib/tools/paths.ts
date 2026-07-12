import { withBasePath } from "@/lib/base-path";

export function getToolPath(slug: string): string {
  return withBasePath(`/${slug}`);
}
