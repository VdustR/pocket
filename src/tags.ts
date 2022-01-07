import allSites from "./allSites";
import type { Site } from "./sites";

export type Tag = {
  tag: string;
  sites: Site[];
};

const tags: Tag[] = [];

allSites.forEach((site) => {
  site.tags?.forEach((tagName) => {
    let existedTag = tags.find(({ tag }) => tag === tagName);
    if (!existedTag) {
      existedTag = {
        tag: tagName,
        sites: [],
      };
      tags.push(existedTag);
    }
    existedTag.sites.push(site);
  });
});

tags.sort((a, b) => a.tag.localeCompare(b.tag));

export default tags;
