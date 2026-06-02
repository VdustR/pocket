import assert from "node:assert/strict";
import test from "node:test";
import { filterAndSortRepos, searchRepos } from "./search";
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

test("filterAndSortRepos keeps Fuse relevance order while searching", () => {
  const repos = [
    makeRepo({
      name: "sqlite-helper",
      fullName: "owner/sqlite-helper",
      stars: 5000,
      score: 5000,
    }),
    makeRepo({
      name: "sqlite",
      fullName: "owner/sqlite",
      stars: 1,
      score: 1,
    }),
  ];

  const result = filterAndSortRepos(repos, {
    query: "sqlite",
    languages: [],
    topics: [],
    sortField: "stars",
    sortOrder: "desc",
  });

  assert.deepEqual(
    result.map((repo) => repo.fullName),
    ["owner/sqlite", "owner/sqlite-helper"]
  );
});

test("filterAndSortRepos treats whitespace-only queries as no search", () => {
  const repos = [
    makeRepo({
      name: "low-score",
      fullName: "owner/low-score",
      score: 1,
    }),
    makeRepo({
      name: "high-score",
      fullName: "owner/high-score",
      score: 10,
    }),
  ];

  const result = filterAndSortRepos(repos, {
    query: "   ",
    languages: [],
    topics: [],
    sortField: "score",
    sortOrder: "desc",
  });

  assert.deepEqual(
    result.map((repo) => repo.fullName),
    ["owner/high-score", "owner/low-score"]
  );
});
