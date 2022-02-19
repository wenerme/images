import * as YAML from "https://deno.land/std@0.63.0/encoding/yaml.ts";

export function parseImageName(s: string): Image {
  const {
    host = "docker.io",
    repo,
    tag = "latest",
  } = s.match(/^((?<host>[^/]+)[/])*?(?<repo>[^:.]+)(:(?<tag>.*))?$/)
    ?.groups as any;

  return {
    host,
    repo,
    tag,
    raw: s,
  };
}

export function buildImageName({
  repo,
  host = "docker.io",
  tag = "latest",
  digest,
}: {
  repo: string;
  host?: string;
  tag?: string;
  digest?: string;
}) {
  return `${host}/${repo}:${tag}`;
}

export interface Image {
  repo: string;
  tag: string;
  host: string;
  raw: string;
  digest?: string;
}

export async function saveImageManifest(v: ImageManifest) {
  v.sort();
  Deno.writeTextFileSync("./images.yaml", YAML.stringify(v.items));
  Deno.writeTextFileSync(
    "./images.txt",
    v.getImages().map(buildImageName).join("\n")
  );
}
export async function loadImageManifest() {
  return new ImageManifest({
    items: (await YAML.parse(
      Deno.readTextFileSync("./images.yaml")
    )) as ImageManifestItem[],
  });
}

class ImageManifest {
  items: ImageManifestItem[] = [];
  constructor({ items }: { items: ImageManifestItem[] }) {
    this.items = items;
  }
  sort() {
    this.items.sort((a, b) => a.host.localeCompare(b.host));
    this.items.forEach((v) => {
      v.repos.sort((a, b) => a.repo.localeCompare(b.repo));
      v.repos.forEach((v) => {
        v.tags.sort();
      });
    });
  }
  addImage(img: Image) {
    let item = this.items.find((v) => v.host === img.host);
    if (!item) {
      item = {
        host: img.host,
        repos: [],
      };
      this.items.push(item);
    }
    let repo = item.repos.find((v) => v.repo === img.repo);
    if (!repo) {
      repo = { repo: img.repo, tags: [] };
      item.repos.push(repo);
    }
    if (repo.tags.indexOf(img.tag) < 0) {
      repo.tags.push(img.tag);
    }
  }
  getImages() {
    return this.items.flatMap((item) => {
      return item.repos.flatMap((repo) => {
        return repo.tags.map((tag) => ({
          tag,
          repo: repo.repo,
          host: item.host,
        }));
      });
    });
  }
}

export interface ImageManifestItem {
  host: string;
  repos: Array<{
    repo: string;
    tags: string[];
    vcs?: string;
  }>;
}

export class ImageName {
  repo: string;
  tag: string;
  host: string;
  digest?: string;
  #raw: string;
  constructor(raw: string) {
    const { repo, tag, host, digest } = parseImageName(raw);
    this.#raw = raw;
    this.repo = repo;
    this.tag = tag;
    this.host = host;
    this.digest = digest;
  }

  get org() {
    return this.repo.split("/")[0];
  }
  get name() {
    return this.repo.split("/").at(-1);
  }
  toString() {
    return buildImageName(this);
  }
}

function buildCondition(o: any) {
  if (o === null || o === undefined || o === true) {
    return () => true;
  }
  if (typeof o === "string") {
    return Function(`"use strict";return (${o})`);
  }
  if (typeof o === "object") {
    return ({ target, context }: any) => {
      return !Object.entries(o).find(([k, v]) => target[k] !== v);
    };
  }
  return () => false;
}

interface MappingSpec {
  when?: any;
  [k: string]: any;
}
function buildApply(o: any) {}
function buildMapping({ when, ...rest }: MappingSpec) {
  return {
    test: buildCondition(when),
    apply: buildApply(rest),
  };
}
