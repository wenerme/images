import { parseImageName, buildImageName } from "./util.ts";
import { buildMappings, loadMapping } from "./mapping.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
Deno.test("mapping", async () => {
  const dst = buildMappings(
    [
      {
        host: "registry.cn-hongkong.aliyuncs.com",
        repo: "cmi/${src.repo.replace('/','_')}",
      },
    ],
    { names: ["src", "dst", "pull", "origin"] }
  );
  const src = buildMappings(
    [
      {
        $when: { host: "us.k8s.gcr.io" },
        host: "k8s.gcr.io",
      },
    ],
    { names: ["src", "dst", "pull", "origin"] }
  );
  const pull = buildMappings(
    [
      {
        $when: { host: "k8s.gcr.io" },
        host: "registry.cn-hangzhou.aliyuncs.com",
        repo: 'google_containers/${src.repo.split("/").at(-1)}',
      },
    ],
    { names: ["src", "dst", "pull", "origin"] }
  );
  let items = [
    parseImageName("k8s.gcr.io/pause:3.6"),
    parseImageName("us.k8s.gcr.io/pause:3.6"),
  ].map((v) => ({
    origin: v,
    src: { ...v },
    dst: { ...v },
    pull: { ...v },
  }));

  console.log();
  items.forEach((v) => src({ target: v.src, context: v }));
  items.forEach((v) =>
    Object.assign(v, { dst: { ...v.src }, pull: { ...v.src } })
  );

  items.map((v) => {
    dst({ target: v.dst, context: v });
    pull({ target: v.pull, context: v });

    console.log(
      buildImageName(v.origin),
      "->",
      buildImageName(v.src),
      "->",
      buildImageName(v.pull),
      "->",
      buildImageName(v.dst)
    );
  });

  //
});

Deno.test({ name: "load mapping", permissions: { read: true } }, async () => {
  const m = await loadMapping();
  const items = [
    parseImageName("k8s.gcr.io/pause:3.6"),
    parseImageName("us.gcr.io/pause:3.6"),
  ].map(m);
  items.forEach((v) => {
    console.log(
      buildImageName(v.origin),
      "->",
      buildImageName(v.src),
      "->",
      buildImageName(v.pull),
      "->",
      buildImageName(v.dst)
    );
  });
});
