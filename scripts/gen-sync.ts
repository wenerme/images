import { parseImageName, buildImageName } from "./util.ts";
const images = Deno.readTextFileSync("images.txt")
  .split("\n")
  .filter((v) => /^\w/.test(v))
  .sort()
  .map(parseImageName)
  .map(toImageSync)
  .map(mappingSource)
  .map(mappingTarget)
  .map(buildFinal)
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

function toImageSync(s: Image): ImageSync {
  return {
    src: { ...s },
    dst: { ...s },
    source: s.raw,
    target: s.raw,
  };
}

function buildFinal(s: ImageSync) {
  s.source = buildImageName(s.src);
  s.target = buildImageName(s.dst);
  if (s.src === s.dst) {
    throw new Error("same src dst");
  }
  return s;
}

function mappingTarget(s: ImageSync) {
  const v = s.dst;
  if (v.host !== "cr.incos.cloud") {
    v.host = "cr.incos.cloud";
    v.repo = `pub/${v.repo}`;
  }
  return s;
}
function mappingSource(s: ImageSync) {
  const img = s.src;
  switch (img.host) {
    case "k8s.gcr.io":
      img.host = "registry.cn-hangzhou.aliyuncs.com";
      img.repo = `google_containers/${img.repo.split("/").at(-1)}`;
      // registry.cn-hangzhou.aliyuncs.com/google_containers
      break;
  }
  return s;
}

interface ImageSync {
  source: string;
  target: string;
  src: Image;
  dst: Image;
}

interface Image {
  repo: string;
  tag: string;
  host: string;
  raw: string;
  digest?: string;
}
