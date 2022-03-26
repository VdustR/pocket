import { writeFile } from "fs/promises";
import Fuse from "fuse.js";
import flow from "lodash/flow";
import get from "lodash/get";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import fuseKeys from "../src/fuseKeys";
import type { Repo } from "../src/type";
import formatStr from "./utils/formatStr";
import request from "./utils/request";

const __dirname = dirname(fileURLToPath(import.meta.url));

const repos: Repo[] = [];

function toStrArr(val: unknown) {
  return !Array.isArray(val) ? [] : val.map(formatStr);
}

async function getStarred(page = 1) {
  const url = `https://api.github.com/users/vdustr/starred?per_page=100&page=${page}`;
  const res = await request(url);
  if (res.status < 200 || res.status >= 300)
    throw new Error(`url: ${url}, status: ${res.status}`);
  if (!Array.isArray(res.data)) {
    console.error(res.data);
    throw new Error("not an array");
  }
  res.data.map((repo: unknown) => {
    const name = flow(() => get(repo, "name"), formatStr)();
    const fullName = flow(() => get(repo, "full_name"), formatStr)();
    const description = flow(() => get(repo, "description"), formatStr)();
    const [owner] = fullName.split("/").map(formatStr);
    const homepage = flow(() => get(repo, "homepage"), formatStr)();
    const tags = flow(() => get(repo, "topics"), toStrArr)();
    repos.push({
      owner,
      name,
      description,
      homepage,
      tags,
    });
  });
  if (res.data.length > 0) {
    await getStarred(page + 1);
  }
}

await getStarred();

repos.forEach((repo) => {
  repo.tags.sort((a, b) => a.localeCompare(b));
});

export type Tag = {
  name: string;
  repos: Repo[];
};

export const tags: Tag[] = [];

repos.forEach((repo) => {
  repo.tags?.forEach((tagName) => {
    let existedTag = tags.find((tag) => tag.name === tagName);
    if (!existedTag) {
      existedTag = {
        name: tagName,
        repos: [],
      };
      tags.push(existedTag);
    }
    existedTag.repos.push(repo);
  });
});

tags.sort((a, b) => a.name.localeCompare(b.name));

await writeFile(
  resolve(__dirname, "../src/repos.ts"),
  prettier.format(
    `import type { Repo } from "./type";
const repos: Repo[] = ${JSON.stringify(
      repos.sort((a, b) => {
        const ownerResult = a.owner.localeCompare(b.owner);
        if (ownerResult != 0) return ownerResult;
        return a.name.localeCompare(b.name);
      })
    )}; export default repos;

    export const tags: string[] = ${JSON.stringify(
      [...tags]
        .sort((a, b) => b.repos.length - a.repos.length)
        .map(({ name }) => name)
    )};
`,
    { parser: "typescript" }
  )
);

const reposIndex = Fuse.createIndex(fuseKeys, repos);
await writeFile(
  resolve(__dirname, "../src/reposIndex.json"),
  prettier.format(JSON.stringify(reposIndex), { parser: "json" })
);
