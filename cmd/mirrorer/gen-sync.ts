import { parseImageName, buildImageName } from "./util.ts";
import { loadMapping } from "./mapping.ts";

export async function generateSyncScript() {
  const mapping = await loadMapping();
  const images = Deno.readTextFileSync("images.txt")
    .split("\n")
    .filter((v) => /^\w/.test(v))
    .sort()
    .map(parseImageName)
    .map(mapping)
    .map((v) => ({
      ...v,
      source: buildImageName(v.pull),
      target: buildImageName(v.dst),
    }))
    .filter((v) => v.source !== v.target);

  let script = [
    `
#!/usr/bin/env bash
set -euxo pipefail`.trim(),

    ...images.map((v) => {
      return `crane copy ${v.source} ${v.target}`;
    }),

    "",
  ];

  await Deno.writeTextFile("sync.sh", script.join("\n"));
}
