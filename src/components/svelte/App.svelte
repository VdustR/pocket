<script lang="ts">
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import SearchFilter from "./SearchFilter.svelte";
  import RepoList from "./RepoList.svelte";
  import Dashboard from "./Dashboard.svelte";
  import Footer from "./Footer.svelte";
  import KeyboardShortcuts from "./KeyboardShortcuts.svelte";
  import type { Repo, FilterState, LayoutMode, SortField, SortOrder } from "../../lib/types";
  import { filterAndSortRepos } from "../../lib/search";

  // State using Svelte 5 runes
  let repos = $state<Repo[]>([]);
  let filteredRepos = $state<Repo[]>([]);
  let languages = $state<string[]>([]);
  let topics = $state<string[]>([]);
  let isLoading = $state(true);
  let showDashboard = $state(false);
  let layoutMode = $state<LayoutMode>("card");

  let filter = $state<FilterState>({
    query: "",
    languages: [],
    topics: [],
    sortField: "score",
    sortOrder: "desc",
  });

  // Load data on mount
  onMount(async () => {
    try {
      // Use hardcoded base URL - Astro sets this at build time
      const baseUrl = "/pocket/";
      console.log("Fetching data from:", baseUrl);

      const [reposRes, filtersRes] = await Promise.all([
        fetch(baseUrl + "data/repos.json"),
        fetch(baseUrl + "data/filters.json"),
      ]);

      console.log("Repos response status:", reposRes.status);
      console.log("Filters response status:", filtersRes.status);

      const reposData = await reposRes.json();
      const filtersData = await filtersRes.json();

      console.log("Loaded repos:", reposData.length);
      console.log("Loaded languages:", filtersData.languages?.length);

      // Initialize from URL params first
      initFromURL();

      // Set data
      repos = reposData;
      languages = filtersData.languages;
      topics = filtersData.topics;

      // Initialize filteredRepos
      filteredRepos = filterAndSortRepos(reposData, filter);
      console.log("Filtered repos:", filteredRepos.length);

      isLoading = false;
    } catch (error) {
      console.error("Failed to load data:", error);
      isLoading = false;
    }
  });

  // Filter repos when filter state changes
  $effect(() => {
    // Access filter properties to track them as dependencies
    const { query, languages: filterLangs, topics: filterTopics, sortField, sortOrder } = filter;
    if (repos.length > 0) {
      filteredRepos = filterAndSortRepos(repos, { query, languages: filterLangs, topics: filterTopics, sortField, sortOrder });
    }
  });

  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const lang = params.getAll("lang");
    const topic = params.getAll("topic");
    const sort = params.get("sort") as SortField | null;
    const order = params.get("order") as SortOrder | null;
    const layout = params.get("layout") as LayoutMode | null;

    if (q) filter.query = q;
    if (lang.length) filter.languages = lang;
    if (topic.length) filter.topics = topic;
    if (sort) filter.sortField = sort;
    if (order) filter.sortOrder = order;
    if (layout) layoutMode = layout;
  }

  function updateURL() {
    const params = new URLSearchParams();

    if (filter.query) params.set("q", filter.query);
    filter.languages.forEach((l) => params.append("lang", l));
    filter.topics.forEach((t) => params.append("topic", t));
    if (filter.sortField !== "score") params.set("sort", filter.sortField);
    if (filter.sortOrder !== "desc") params.set("order", filter.sortOrder);
    if (layoutMode !== "card") params.set("layout", layoutMode);

    const newURL = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;

    window.history.replaceState({}, "", newURL);
  }

  function handleFilterChange(newFilter: Partial<FilterState>) {
    filter = { ...filter, ...newFilter };
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
      <Dashboard {repos} {languages} />
    {:else}
      <SearchFilter
        {filter}
        {languages}
        {topics}
        {layoutMode}
        onFilterChange={handleFilterChange}
        onLayoutChange={handleLayoutChange}
        totalCount={repos.length}
        filteredCount={filteredRepos.length}
      />

      {#if isLoading}
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      {:else}
        <RepoList repos={filteredRepos} {layoutMode} />
      {/if}
    {/if}
  </main>

  <Footer />

  <KeyboardShortcuts />
</div>
