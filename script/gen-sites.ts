import { writeFile } from "fs/promises";
import Fuse from "fuse.js";
import kebabCase from "lodash/kebabCase";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import bookmarks from "../data/bookmarks";
import github from "../data/github";
import { sitesKeys } from "../src/fuseKeys";
import type { Site } from "../src/type";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sites = [...bookmarks];
github.forEach((repo) => {
  const siteIndex = sites.findIndex(
    (site) =>
      site.github &&
      site.github.name === repo.name &&
      site.github.owner === repo.owner
  );
  if (siteIndex === -1) {
    sites.push({
      url: `https://github.com/${repo.owner}/${repo.name}`,
      title: `${repo.owner}/${repo.name}`,
      description: repo.description,
      tags: repo.tags,
      github: {
        owner: repo.owner,
        name: repo.name,
      },
    });
    return;
  }
  const site = sites[siteIndex];
  sites[siteIndex] = {
    ...site,
    description: site.description || repo.description,
    tags: [...new Set([...(site.tags ? site.tags : []), ...repo.tags])].sort(
      (a, b) => a.localeCompare(b)
    ),
  };
});

export type Tag = {
  name: string;
  sites: Site[];
};

export const tags: Tag[] = [];

sites.forEach((site) => {
  site.tags?.forEach((tagName) => {
    let existedTag = tags.find((tag) => tag.name === tagName);
    if (!existedTag) {
      existedTag = {
        name: tagName,
        sites: [],
      };
      tags.push(existedTag);
    }
    existedTag.sites.push(site);
  });
});

tags.sort((a, b) => a.name.localeCompare(b.name));

// insert fake tag if no tags
for (let i = 0; i < sites.length; i++) {
  const site = sites[i];
  if (site.tags && site.tags.length > 0) continue;
  const newTags: Tag[] = [];
  tags.forEach((tag) => {
    const kebabTag = kebabCase(tag.name);
    if (
      kebabCase(site.title).match(new RegExp(`(^|-)${kebabTag}($|-)`, "ig")) ||
      kebabCase(site.description).match(
        new RegExp(`(^|-)${kebabTag}($|-)`, "ig")
      )
    ) {
      newTags.push(tag);
    }
  });
  if (newTags.length === 0) continue;
  sites[i] = {
    ...site,
    tags: newTags.map((tag) => tag.name),
  };
  newTags.forEach((tag) => {
    tag.sites.push(sites[i]);
  });
}

await writeFile(
  resolve(__dirname, "../src/sites.ts"),
  prettier.format(
    `import type { Site } from "./type";
const sites: Site[] = ${JSON.stringify(sites)};
export const tags: string[] = ${JSON.stringify(
      [...tags]
        .sort((a, b) => b.sites.length - a.sites.length)
        .map(({ name }) => name)
    )};
export default sites;
`,
    { parser: "typescript" }
  )
);

const sitesIndex = Fuse.createIndex(sitesKeys, sites);
await writeFile(
  resolve(__dirname, "../src/sitesIndex.json"),
  prettier.format(JSON.stringify(sitesIndex), { parser: "json" })
);
