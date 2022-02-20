import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

import {
  loadImageManifest,
  parseImageName,
  saveImageManifest,
  buildImageName,
} from "./util.ts";
import { scanImagesFromFile } from "./helper.ts";
import { generateSyncScript } from "./gen-sync.ts";

yargs(Deno.args)
  .command(
    "g",
    "generate files",
    (yargs: any) => {
      return yargs
        .command(
          "sync.sh",
          "generate sync.sh",
          () => {},
          (argv: Arguments) => {
            console.log(`generating sync.sh`);
            generateSyncScript();
          }
        )
        .command(
          "images.txt",
          "generate images.txt",
          () => {},
          async (argv: Arguments) => {
            const m = await loadImageManifest();
            Deno.writeTextFileSync(
              "./images.txt",
              m.getImages().map(buildImageName).join("\n")
            );
          }
        )

        .command(
          "images.md",
          "generate images.txt",
          () => {},
          async (argv: Arguments) => {
            const m = await loadImageManifest();
            Deno.writeTextFileSync(
              "./images.md",
              [
                "image | mirrored | tags",
                "----- | -------- | ----",
                ...m.items.flatMap(buildImageTableRow),
              ].join("\n")
            );
          }
        );
    },
    (argv: Arguments) => {
      console.error(`generate what ?`);
    }
  )
  .command(
    "scan <files...>",
    "scan files to update manifest",
    (yargs: any) => {
      return yargs.positional("files", {
        describe: "a list of files to scan",
      });
    },
    async (argv: Arguments) => {
      const m = await loadImageManifest();

      for (const file of argv.files) {
        console.info(`scanning ${file}`);
        const imgs = await scanImagesFromFile(file);
        console.info(`found ${imgs.length} images`);

        imgs.map(parseImageName).forEach((v) => m.addImage(v));
      }

      await saveImageManifest(m);
    }
  )
  .command(
    "migration",
    "migrating from changelog",
    () => {},
    async () => {
      // migration
      const m = await loadImageManifest();

      Deno.readTextFileSync("./CHANGELOG.md")
        .split("\n")
        .splice(2)
        .filter(Boolean)
        .map((v) => {
          const [_, repo, tag] = v.split("|").map((v) => v.trim());
          return parseImageName(`${repo}:${tag}`);
        })
        .forEach((v) => m.addImage(v));

      await saveImageManifest(m);
    }
  )
  .command("m", "manipulate manifest", (yargs: any) => {
    return yargs.command(
      "fmt",
      "format manifest",
      () => {},
      async () => {
        const m = await loadImageManifest();
        await saveImageManifest(m);
      }
    );
  })
  .option("verbose", {
    type: "boolean",
    description: "Run with verbose logging",
  })
  .strictCommands()
  .demandCommand(1)
  .parse();

function buildImageTableRow(o: any) {
  const { repos, host } = o;
  return repos.map((v: any) => {
    return `${host}/${v.repo} | n/a | ${v.tags.join(",")}`;
  });
}
