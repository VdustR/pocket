<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import Header from "./Header.svelte";
  import SearchFilter from "./SearchFilter.svelte";
  import RepoList from "./RepoList.svelte";
  import Dashboard from "./Dashboard.svelte";
  import Footer from "./Footer.svelte";
  import KeyboardShortcuts from "./KeyboardShortcuts.svelte";
  import type { FilterState, LayoutMode, SortField, SortOrder } from "../../lib/types";
  
  import {
    repos,
    filteredRepos,
    languages,
    topics,
    isLoading,
    filter as filterStore,
    loadData,
    top3FullNames
  } from "../../stores/repos";

  // State using Svelte 5 runes, but sourced from stores
  let showDashboard = $state(false);
  let layoutMode = $state<LayoutMode>("card");
  let totalStars = $derived($repos.reduce((sum, repo) => sum + repo.stars, 0));
  let topLanguage = $derived($languages[0]?.name ?? "many languages");
  const compactFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  // Load data on mount
  onMount(async () => {
    // Initialize from URL params first
    initFromURL();
    await loadData();
  });

  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const lang = params.getAll("lang");
    const topic = params.getAll("topic");
    const sort = params.get("sort") as SortField | null;
    const order = params.get("order") as SortOrder | null;
    const layout = params.get("layout") as LayoutMode | null;

    const newFilter: Partial<FilterState> = {};
    if (q) newFilter.query = q;
    if (lang.length) newFilter.languages = lang;
    if (topic.length) newFilter.topics = topic;
    if (sort) newFilter.sortField = sort;
    if (order) newFilter.sortOrder = order;
    
    // Update the store with the initial filter state
    filterStore.update(f => ({...f, ...newFilter}));

    if (layout) layoutMode = layout;
  }

  function updateURL() {
    const params = new URLSearchParams();
    const currentFilter = $filterStore;

    if (currentFilter.query) params.set("q", currentFilter.query);
    currentFilter.languages.forEach((l) => params.append("lang", l));
    currentFilter.topics.forEach((t) => params.append("topic", t));
    if (currentFilter.sortField !== "score") params.set("sort", currentFilter.sortField);
    if (currentFilter.sortOrder !== "desc") params.set("order", currentFilter.sortOrder);
    if (layoutMode !== "card") params.set("layout", layoutMode);

    const newURL = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;

    window.history.replaceState({}, "", newURL);
  }

  function handleFilterChange(newFilter: Partial<FilterState>) {
    filterStore.update(f => ({ ...f, ...newFilter }));
    updateURL();
  }

  function handleLayoutChange(mode: LayoutMode) {
    layoutMode = mode;
    updateURL();
  }

  function clearFilters() {
    handleFilterChange({
      query: "",
      languages: [],
      topics: [],
      sortField: "score",
      sortOrder: "desc",
    });
  }

  function toggleDashboard() {
    showDashboard = !showDashboard;
  }

  function formatCompactNumber(num: number): string {
    return compactFormatter.format(num);
  }

  let hasActiveFilters = $derived(Boolean(
    $filterStore.query ||
      $filterStore.languages.length > 0 ||
      $filterStore.topics.length > 0 ||
      $filterStore.sortField !== "score" ||
      $filterStore.sortOrder !== "desc"
  ));
</script>

<div class="min-h-screen flex flex-col">
  <Header onToggleDashboard={toggleDashboard} {showDashboard} />

  <main class="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
    {#if showDashboard}
      <Dashboard repos={$repos} languages={$languages} />
    {:else}
      <section class="mb-6 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <p class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              GitHub stars, ranked and searchable
            </p>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
              Find the repo worth opening next.
            </h2>
            <p class="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 text-pretty">
              Browse {$isLoading ? "curated" : formatCompactNumber($repos.length)} saved projects across {topLanguage} and beyond.
            </p>
          </div>

          <div class="flex flex-wrap gap-2 text-sm" aria-label="Collection summary">
            <span class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <Icon icon="ph:archive-bold" class="w-4 h-4 text-primary-600 dark:text-primary-300" />
              {$isLoading ? "Loading" : formatCompactNumber($repos.length)} repos
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <Icon icon="ph:star-fill" class="w-4 h-4 text-yellow-500" />
              {formatCompactNumber(totalStars)} stars
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <Icon icon="vscode-icons:default-file" class="w-4 h-4" />
              {$languages.length || "Many"} languages
            </span>
          </div>
        </div>
      </section>

      <SearchFilter
        filter={$filterStore}
        languages={$languages}
        topics={$topics}
        {layoutMode}
        onFilterChange={handleFilterChange}
        onLayoutChange={handleLayoutChange}
        totalCount={$repos.length}
        filteredCount={$filteredRepos.length}
      />

      {#if $isLoading}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite" aria-label="Loading repositories">
          {#each Array.from({ length: 6 }) as _}
            <div class="card p-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-2 flex-1">
                  <div class="skeleton h-5 w-2/3 rounded-md"></div>
                  <div class="skeleton h-3 w-1/3 rounded-md"></div>
                </div>
                <div class="skeleton h-8 w-8 rounded-lg"></div>
              </div>
              <div class="space-y-2">
                <div class="skeleton h-3 w-full rounded-md"></div>
                <div class="skeleton h-3 w-5/6 rounded-md"></div>
              </div>
              <div class="flex gap-3">
                <div class="skeleton h-4 w-14 rounded-md"></div>
                <div class="skeleton h-4 w-14 rounded-md"></div>
                <div class="skeleton h-4 w-20 rounded-md"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <RepoList
          repos={$filteredRepos}
          {layoutMode}
          top3FullNames={$top3FullNames}
          {hasActiveFilters}
          onClearFilters={clearFilters}
        />
      {/if}
    {/if}
  </main>

  <Footer />

  <KeyboardShortcuts />
</div>
