// @vitest-environment node
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.join(import.meta.dirname, "check-post.mjs");
const run = (slug: string) => {
  try {
    return { code: 0, out: execFileSync("node", [script, slug, "--json"], { encoding: "utf8" }) };
  } catch (error) {
    const { status, stdout } = error as { status: number; stdout: string };
    return { code: status, out: stdout };
  }
};

describe("check-post", () => {
  const slugs = readdirSync(path.join(process.cwd(), "content", "blog"));

  it.each(slugs)("%s has no structural errors", (slug) => {
    const { code, out } = run(slug);
    const report = JSON.parse(out);
    expect(report.issues.filter((i: { level: string }) => i.level === "error")).toEqual([]);
    expect(code).toBe(0);
  });

  it("fails for a post that doesn't exist", () => {
    const { code, out } = run("does-not-exist");
    expect(code).toBe(1);
    expect(JSON.parse(out).errors).toBeGreaterThan(0);
  });
});
