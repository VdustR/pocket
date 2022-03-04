import axios from "axios";
import { load } from "cheerio";
import { writeFile } from "fs/promises";
import pMap from "p-map";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { Site } from "../src/type";

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

function request(url: string) {
  return axios(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
    },
    validateStatus: null,
  });
}

function formatStr(str: string): string {
  return str.replace(/[\s\n\r]+/g, " ").trim();
}

async function getSiteDirectly(url: string): Promise<Site | null> {
  const res = await request(url);
  if (res.status < 200 || res.status >= 300) return null;
  const $ = load(res.data);
  const title = formatStr(
    $("meta[property='og:title']").attr("content") || $("title").text()
  );
  const description = formatStr(
    $("meta[name='description']").attr("content") || ""
  );
  const keywords = $("meta[name='keywords']").attr("content");
  const site: Site = {
    title,
    description,
    tags: keywords ? keywords.split(",").map(formatStr) : [],
    url,
  };
  return site;
}

async function getSiteByBraveSearchEngine(url: string): Promise<Site | null> {
  const res = await request(
    `https://search.brave.com/search?q=${encodeURIComponent(url)}`
  );
  if (res.status < 200 || res.status >= 300) return null;
  const $ = load(res.data);
  const $infoBox = $("#infobox");
  const $firstResult = $("#results > div:nth-child(1)");
  const title = formatStr(
    $infoBox.length > 0
      ? $infoBox.find(".infobox-title").text()
      : $firstResult.find(".snippet-title").text()
  );
  const description = formatStr(
    $infoBox.length > 0
      ? $infoBox.find(".infobox-description").text()
      : $firstResult.find(".snippet-content").text()
  );
  const site: Site = {
    title,
    description,
    url,
  };
  return site;
}

async function getSite(url: string): Promise<Site> {
  const site =
    (await getSiteDirectly(url)) || (await getSiteByBraveSearchEngine(url));
  if (!site) throw new Error(`url cannot fetch: ${url}`);
  return site;
}

const results = await pMap(favorites, getSite, { concurrency: 10 });

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
