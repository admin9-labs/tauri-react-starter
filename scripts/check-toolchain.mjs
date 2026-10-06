import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");
const packageJson = JSON.parse(read("package.json"));
const rustVersion = /^channel\s*=\s*"([^"]+)"/m.exec(
  read("rust-toolchain.toml"),
)?.[1];
const expected = {
  node: read(".node-version").trim(),
  pnpm: /^pnpm@([^+]+)(?:\+.*)?$/.exec(packageJson.packageManager)?.[1],
  rustc: rustVersion,
  cargo: rustVersion,
};

try {
  const actual = {
    node: process.versions.node,
    pnpm: execFileSync("pnpm", ["--version"], { encoding: "utf8" }).trim(),
    rustc: execFileSync("rustc", ["--version"], { encoding: "utf8" }).split(
      /\s+/,
    )[1],
    cargo: execFileSync("cargo", ["--version"], { encoding: "utf8" }).split(
      /\s+/,
    )[1],
  };
  const mismatches = Object.entries(expected).filter(
    ([tool, version]) => !version || actual[tool] !== version,
  );
  if (mismatches.length) {
    for (const [tool, version] of mismatches)
      console.error(
        `${tool}: expected ${version ?? "a configured version"}, received ${actual[tool]}`,
      );
    console.error(
      "Select the repository toolchain before running the complete checks; see docs/tech/engineering.md.",
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Toolchain verified: ${Object.entries(actual)
        .map(([tool, version]) => `${tool} ${version}`)
        .join(", ")}`,
    );
  }
} catch (error) {
  console.error(
    "Toolchain check failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
}
