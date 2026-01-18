<script lang="ts">
  import { onMount } from "svelte";
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

  function toggleDashboard() {
    showDashboard = !showDashboard;
  }
</script>

<div class="min-h-screen flex flex-col">
  <Header onToggleDashboard={toggleDashboard} {showDashboard} />

  <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">
    {#if showDashboard}
      <Dashboard repos={$repos} languages={$languages} />
    {:else}
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
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      {:else}
        <RepoList repos={$filteredRepos} {layoutMode} top3FullNames={$top3FullNames} />
      {/if}
    {/if}
  </main>

  <Footer />

  <KeyboardShortcuts />
</div>
