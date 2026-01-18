import { writable, get } from "svelte/store";
import type { Repo, FilterState } from "../lib/types";
import { filterAndSortRepos } from "../lib/search";

// Writable stores for raw data
export const repos = writable<Repo[]>([]);
export const languages = writable<string[]>([]);
export const topics = writable<string[]>([]);
export const isLoading = writable(true);

// Writable store for filtered repos
export const filteredRepos = writable<Repo[]>([]);

// Filter state store
export const filter = writable<FilterState>({
  query: "",
  languages: [],
  topics: [],
  sortField: "score",
  sortOrder: "desc",
});

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
    
    // Initial filter and sort
    const currentFilter = get(filter);
    const allRepos = get(repos);
    filteredRepos.set(filterAndSortRepos(allRepos, currentFilter));

  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    isLoading.set(false);
  }
}

// When the filter changes, update the filtered repos
filter.subscribe(newFilter => {
    const allRepos = get(repos);
    // only run if repos have been loaded
    if (allRepos.length > 0) {
        filteredRepos.set(filterAndSortRepos(allRepos, newFilter));
    }
});
