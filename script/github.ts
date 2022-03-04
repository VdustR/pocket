import { writeFile } from "fs/promises";
import flow from "lodash/flow";
import get from "lodash/get";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import formatStr from "./utils/formatStr";
import request from "./utils/request";

const __dirname = dirname(fileURLToPath(import.meta.url));

const repos: {
  name: string;
  owner: string;
  description: string | undefined;
  tags: string[];
}[] = [];

function toOptionalString(val: unknown) {
  return val ? formatStr(String(val)) : undefined;
}

function toStrArr(val: unknown) {
  return !Array.isArray(val) ? [] : val.map((item) => formatStr(String(item)));
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
    const name = flow(() => get(repo, "name"), String, formatStr)();
    const fullName = flow(() => get(repo, "full_name"), String, formatStr)();
    const [owner] = fullName.split("/").map(formatStr);
    const description = flow(
      () => get(repo, "description"),
      toOptionalString
    )();
    const tags = flow(() => get(repo, "topics"), toStrArr)();
    repos.push({ owner, name, description, tags });
  });
  if (res.data.length > 0) {
    await getStarred(page + 1);
  }
}

await getStarred();

repos.forEach((repo) => {
  repo.tags.sort((a, b) => a.localeCompare(b));
});

await writeFile(
  resolve(__dirname, "../data/github.ts"),
  prettier.format(
    `const github: {
  name: string;
  owner: string;
  description?: string;
  tags: string[];
}[] = ${JSON.stringify(
      repos.sort((a, b) => {
        const ownerResult = a.owner.localeCompare(b.owner);
        if (ownerResult != 0) return ownerResult;
        return a.name.localeCompare(b.name);
      })
    )}; export default github;`,
    { parser: "typescript" }
  )
);
