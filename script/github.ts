import axios from "axios";
import { writeFile } from "fs/promises";
import _ from "lodash";
import { dirname, resolve } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const repos: {
  name: string;
  owner: string;
  description: string | null;
  tags: string[];
}[] = [];

function toOptionalString(val: unknown) {
  return val ? String(val) : null;
}

function toStrArr(val: unknown) {
  return !Array.isArray(val) ? [] : val.map((item) => String(item));
}

async function getStarred(page = 1) {
  const res = await axios(
    `https://api.github.com/users/vdustr/starred?per_page=100&page=${page}`
  );
  if (!Array.isArray(res.data)) throw new Error("not an array");
  res.data.map((repo: unknown) => {
    const name = _.flow(() => _.get(repo, "name"), String)();
    const fullName = _.flow(() => _.get(repo, "full_name"), String)();
    const [owner] = fullName.split("/");
    const description = _.flow(
      () => _.get(repo, "description"),
      toOptionalString
    )();
    const tags = _.flow(() => _.get(repo, "topics"), toStrArr)();
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
  resolve(__dirname, "../src/github.ts"),
  prettier.format(
    `const github: {
  name: string;
  owner: string;
  description: string | null;
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
