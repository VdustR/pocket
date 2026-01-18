import Fuse from "fuse.js";
import type { Repo, FilterState } from "./types";

let fuseInstance: Fuse<Repo> | null = null;

const fuseOptions: Fuse.IFuseOptions<Repo> = {
  keys: [
    { name: "owner", weight: 1 },
    { name: "name", weight: 2 },
    { name: "fullName", weight: 1.5 },
    { name: "description", weight: 1 },
    { name: "homepage", weight: 0.5 },
    { name: "topics", weight: 1.5 },
    { name: "language", weight: 1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
};

export function initFuse(repos: Repo[]): void {
  fuseInstance = new Fuse(repos, fuseOptions);
}

export function searchRepos(repos: Repo[], query: string): Repo[] {
  if (!query.trim()) {
    return repos;
  }

  if (!fuseInstance) {
    fuseInstance = new Fuse(repos, fuseOptions);
  }

  const results = fuseInstance.search(query);
  return results.map((r) => r.item);
}

export function filterByLanguages(repos: Repo[], languages: string[]): Repo[] {
  if (languages.length === 0) {
    return repos;
  }
  return repos.filter(
    (repo) => repo.language && languages.includes(repo.language)
  );
}

export function filterByTopics(repos: Repo[], topics: string[]): Repo[] {
  if (topics.length === 0) {
    return repos;
  }
  return repos.filter((repo) =>
    topics.some((topic) => repo.topics.includes(topic))
  );
}

export function sortRepos(
  repos: Repo[],
  field: FilterState["sortField"],
  order: FilterState["sortOrder"]
): Repo[] {
  const sorted = [...repos].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "score":
        comparison = a.score - b.score;
        break;
      case "stars":
        comparison = a.stars - b.stars;
        break;
      case "starredAt":
        comparison =
          new Date(a.starredAt).getTime() - new Date(b.starredAt).getTime();
        break;
      case "updatedAt":
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });

  return sorted;
}

export function filterAndSortRepos(repos: Repo[], filter: FilterState): Repo[] {
  let result = repos;

  // Apply search query
  if (filter.query) {
    result = searchRepos(result, filter.query);
  }

  // Apply language filter
  result = filterByLanguages(result, filter.languages);

  // Apply topic filter
  result = filterByTopics(result, filter.topics);

  // Apply sorting (only if not searching, as Fuse.js already sorts by relevance)
  if (!filter.query) {
    result = sortRepos(result, filter.sortField, filter.sortOrder);
  }

  return result;
}
