import { load } from "cheerio";
import type { Site } from "../../src/type";
import formatStr from "./formatStr";
import request from "./request";

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

export default async function getSite(url: string): Promise<Site> {
  const site =
    (await getSiteDirectly(url)) || (await getSiteByBraveSearchEngine(url));
  if (!site) throw new Error(`url cannot fetch: ${url}`);
  return site;
}
