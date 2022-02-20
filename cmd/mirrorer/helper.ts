import * as YAML from "https://deno.land/std@0.63.0/encoding/yaml.ts";



export async function scanImagesFromFile(file: string): Promise<string[]> {
  const o = await YAML.parse(Deno.readTextFileSync(file));
  return lookup(o);
}

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
