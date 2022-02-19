import * as YAML from "https://deno.land/std@0.63.0/encoding/yaml.ts";

// deno run --allow-write --allow-read scripts/extract.ts
import {
  loadImageManifest,
  parseImageName,
  saveImageManifest,
} from "./util.ts";

function lookup(o: any, images: string[] = []) {
  if (o && typeof o === "object") {
    if ("image" in o) {
      images.push(`${o["image"]}:${o["version"] ?? "latest"}`);
    } else {
      Object.values(o).map((v) => lookup(v, images));
    }
  }
  return images;
}

const k0s: any = await YAML.parse(Deno.readTextFileSync("./k0s.yaml"));
const found = lookup(k0s);

const m = await loadImageManifest();
found.map(parseImageName).forEach((v) => m.addImage(v));

// migration
Deno.readTextFileSync("./CHANGELOG.md")
  .split("\n")
  .splice(2)
  .filter(Boolean)
  .map((v) => {
    const [_,repo, tag] = v.split("|").map((v) => v.trim());
    return parseImageName(`${repo}:${tag}`);
  })
  .forEach((v) => m.addImage(v));

saveImageManifest(m);
