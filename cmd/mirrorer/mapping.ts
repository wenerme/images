import * as YAML from "https://deno.land/std@0.63.0/encoding/yaml.ts";

function buildCondition(
  o: any,
  { contextNames, targetNames }: BuildMappingOptions
) {
  if (o === null || o === undefined || o === true) {
    return () => true;
  }
  if (typeof o === "string") {
    return Function(
      `
      "use strict";
      const {${contextNames.join(",")}}=arguments[0].context;
      const {${targetNames.join(",")}}=arguments[0].target;
      return (${o});
      `
    );
  }
  if (typeof o === "object") {
    return ({ target, context }: Mapping) => {
      return !Object.entries(o).find(([k, v]) => target[k] !== v);
    };
  }
  return () => false;
}

interface MappingConf {
  target: MappingSpec[];
  source: MappingSpec[];
  pull: MappingSpec[];
}

export interface MappingSpec {
  $when?: any;
  $debug?: boolean;
  [k: string]: any;
}
function buildApply(
  o: any,
  { contextNames, targetNames }: BuildMappingOptions
) {
  const fields = Object.entries(o);
  const processors = fields.map(([k, v]) => {
    if (typeof v === "string" && v.includes("${")) {
      const fv = Function(
        `
        "use strict";
        const {${contextNames.join(",")}}=arguments[0].context;
        const {${targetNames.join(",")}}=arguments[0].target;
        return (\`${v}\`)`
      );
      return (val: any, o: any) => {
        val[k] = fv(o);
        return val;
      };
    }
    return (val: any, _: any) => {
      val[k] = v;
      return val;
    };
  });
  return (m: Mapping) => {
    return processors.reduce((o, f) => f(o, m), m.target);
  };
}
export function buildMappings(
  specs: MappingSpec[],
  opts: Partial<BuildMappingOptions>
) {
  opts = Object.assign(opts, {
    contextNames: opts.contextNames ?? [],
    targetNames: opts.targetNames ?? [],
  }) ;
  const p = specs.map((v) => buildMapping(v, opts as any));
  return (o: Mapping) => p.map((f) => f.run(o));
}

function buildMapping(
  { $when, $debug = false, ...rest }: MappingSpec,
  opt: BuildMappingOptions
) {
  const test = buildCondition($when, opt);
  const apply = buildApply(rest, opt);
  return {
    test,
    apply,
    run: (v: Mapping) => {
      if (test(v)) {
        if ($debug) {
          console.debug("before", v.target, $when);
        }
        v.target = apply(v);
        if ($debug) {
          console.debug("after", v.target, rest);
        }
      }
      return v;
    },
  };
}

export interface Mapping {
  target: any;
  context?: any;
}
export interface BuildMappingOptions {
  contextNames: string[];
  targetNames: string[];
}

import { ImageName } from "./util.ts";
export async function loadMapping(): Promise<
  <T>(item: T) => { origin: T; src: T; dst: T; pull: T }
> {
  const {
    pull: pulling = [],
    source = [],
    target = [],
  } = (await YAML.parse(Deno.readTextFileSync("mapping.yaml"))) as any;
  const opts = {
    contextNames: ["src", "dst", "pull", "origin"],
    targetNames: ["repo", "host", "org"],
  };

  const dst = buildMappings(target, opts);
  const src = buildMappings(source, opts);
  const pull = buildMappings(pulling, opts);

  return (v: any) => {
    let o = {
      origin: new ImageName(v),
      src: new ImageName({ ...v }),
      dst: new ImageName({ ...v }),
      pull: new ImageName({ ...v }),
    };
    src({ target: o.src, context: o });
    Object.assign(o, {
      dst: new ImageName({ ...o.src } as any),
      pull: new ImageName({ ...o.src } as any),
    });
    
    dst({ target: o.dst, context: o });
    pull({ target: o.pull, context: o });
    
    return o as any;
  };
}
