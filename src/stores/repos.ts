import { writable, derived } from "svelte/store";
import type { Repo, FilterState } from "../lib/types";
import { filterAndSortRepos } from "../lib/search";

// Writable stores for raw data
export const repos = writable<Repo[]>([]);
export const languages = writable<string[]>([]);
export const topics = writable<string[]>([]);
export const isLoading = writable(true);

// Filter state store
export const filter = writable<FilterState>({
  query: "",
  languages: [],
  topics: [],
  sortField: "score",
  sortOrder: "desc",
});

// Derived store for filtered repos - automatically updates when repos or filter changes
export const filteredRepos = derived(
  [repos, filter],
  ([$repos, $filter]) => {
    if ($repos.length === 0) {
      return [];
    }
    return filterAndSortRepos($repos, $filter);
  }
);

export async function loadData() {
  isLoading.set(true);
  try {
    // Use hardcoded base URL - Astro sets this at build time
    const baseUrl = "/pocket/";
    const [reposRes, filtersRes] = await Promise.all([
      fetch(baseUrl + "data/repos.json"),
      fetch(baseUrl + "data/filters.json"),
    ]);

    const reposData = await reposRes.json();
    const filtersData = await filtersRes.json();

    repos.set(reposData);
    languages.set(filtersData.languages);
    topics.set(filtersData.topics);
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    isLoading.set(false);
  }
}
