import assert from "node:assert/strict";
import test from "node:test";
import { searchRepos } from "./search";
import type { Repo } from "./types";

function makeRepo(overrides: Partial<Repo>): Repo {
  return {
    owner: "owner",
    name: "repo",
    fullName: "owner/repo",
    description: "",
    homepage: "",
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    language: null,
    topics: [],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    pushedAt: "2026-01-01T00:00:00Z",
    starredAt: "2026-01-01T00:00:00Z",
    score: 0,
    ...overrides,
  };
}

test("searchRepos searches descriptions after the repo collection changes", () => {
  const initialRepos = [
    makeRepo({
      name: "title-only",
      fullName: "owner/title-only",
    }),
  ];

  assert.equal(searchRepos(initialRepos, "title-only")[0]?.fullName, "owner/title-only");

  const updatedRepos = [
    makeRepo({
      name: "unrelated",
      fullName: "owner/description-match",
      description: "Native AI capabilities for self-hosted workflow automation.",
    }),
  ];

  assert.equal(
    searchRepos(updatedRepos, "self-hosted workflow automation")[0]?.fullName,
    "owner/description-match"
  );
});
