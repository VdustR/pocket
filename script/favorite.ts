import { writeFile } from "fs/promises";
import pMap from "p-map";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import getSite from "./utils/getSite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const favorites = [
  "https://archive.org",
  "https://cachedview.com",
  "https://clrs.cc",
  "https://code.visualstudio.com",
  "https://codepen.io",
  "https://coding-fonts.css-tricks.com",
  "https://colorhunt.co",
  "https://downdetector.com",
  "https://fakeimg.pl",
  "https://fishshell.com",
  "https://fonts.adobe.com",
  "https://fonts.google.com",
  "https://github.com",
  "https://gitlab.com",
  "https://krita.org",
  "https://lingojam.com/FancyTextGenerator",
  "https://markdown-here.com",
  "https://myip.ms",
  "https://outage.report",
  "https://owncloud.com",
  "https://passwordsgenerator.net",
  "https://rocket.chat",
  "https://tineye.com",
  "https://www.color-hex.com",
  "https://www.colourlovers.com",
  "https://www.fakenamegenerator.com",
  "https://www.justbeamit.com",
  "https://www.lipsum.com",
  "https://www.sharedrop.io",
  "https://www.supremo.co.uk/typeterms/",
];

const concurrency = 10;

const results = await pMap(favorites, getSite, { concurrency });

const typescriptContent = prettier.format(
  `import type { Site } from "../src/type";
const sites: Site[] = ${JSON.stringify(results)};
export default sites;
`,
  { parser: "typescript" }
);

await writeFile(resolve(__dirname, "../data/favorite.ts"), typescriptContent, {
  encoding: "utf8",
});
