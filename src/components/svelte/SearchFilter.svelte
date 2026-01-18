<script lang="ts">
  import Icon from "@iconify/svelte";
  import LayoutSwitcher from "./LayoutSwitcher.svelte";
  import type { FilterState, LanguageWithCount, LayoutMode, SortField, SortOrder, TopicWithCount } from "../../lib/types";

  interface Props {
    filter: FilterState;
    languages: LanguageWithCount[];
    topics: TopicWithCount[];
    layoutMode: LayoutMode;
    onFilterChange: (filter: Partial<FilterState>) => void;
    onLayoutChange: (mode: LayoutMode) => void;
    totalCount: number;
    filteredCount: number;
  }

  let {
    filter,
    languages,
    topics,
    layoutMode,
    onFilterChange,
    onLayoutChange,
    totalCount,
    filteredCount,
  }: Props = $props();

  let showLanguages = $state(false);
  let showTopics = $state(false);
  let showSort = $state(false);

  let languageSearchQuery = $state("");
  let topicSearchQuery = $state("");

  let filteredLanguages = $derived(
    !languageSearchQuery.trim()
      ? languages
      : languages.filter((l) => l.name.toLowerCase().includes(languageSearchQuery.toLowerCase()))
  );

  let filteredTopics = $derived(
    !topicSearchQuery.trim()
      ? topics
      : topics.filter((t) => t.name.toLowerCase().includes(topicSearchQuery.toLowerCase()))
  );

  const sortOptions: { value: SortField; label: string }[] = [
    { value: "score", label: "Relevance" },
    { value: "stars", label: "Stars" },
    { value: "starredAt", label: "Recently Starred" },
    { value: "updatedAt", label: "Recently Updated" },
    { value: "name", label: "Name" },
  ];

  function handleQueryChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    onFilterChange({ query: value });
  }

  function toggleLanguage(lang: string) {
    const newLanguages = filter.languages.includes(lang)
      ? filter.languages.filter((l) => l !== lang)
      : [...filter.languages, lang];
    onFilterChange({ languages: newLanguages });
  }

  function toggleTopic(topic: string) {
    const newTopics = filter.topics.includes(topic)
      ? filter.topics.filter((t) => t !== topic)
      : [...filter.topics, topic];
    onFilterChange({ topics: newTopics });
  }

  function setSort(field: SortField) {
    const newOrder: SortOrder =
      filter.sortField === field && filter.sortOrder === "desc" ? "asc" : "desc";
    onFilterChange({ sortField: field, sortOrder: newOrder });
    showSort = false;
  }

  function clearFilters() {
    onFilterChange({
      query: "",
      languages: [],
      topics: [],
      sortField: "score",
      sortOrder: "desc",
    });
  }

  let hasActiveFilters = $derived(
    filter.query ||
      filter.languages.length > 0 ||
      filter.topics.length > 0 ||
      filter.sortField !== "score"
  );
</script>

<div class="space-y-4 mb-8">
  <!-- Search bar -->
  <div class="flex gap-4 flex-wrap">
    <div class="relative flex-1 min-w-0 sm:min-w-64">
      <Icon
        icon="ph:magnifying-glass-bold"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
      />
      <input
        type="text"
        value={filter.query}
        oninput={handleQueryChange}
        placeholder="Search repositories..."
        class="input pl-10"
        id="search-input"
      />
      {#if filter.query}
        <button
          onclick={() => onFilterChange({ query: "" })}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
        >
          <Icon icon="ph:x-bold" class="w-4 h-4" />
        </button>
      {/if}
    </div>

    <LayoutSwitcher {layoutMode} {onLayoutChange} />
  </div>

  <!-- Filter buttons -->
  <div class="flex gap-2 flex-wrap items-center">
    <!-- Language filter -->
    <div class="relative" data-dropdown>
      <button
        onclick={() => {
          showLanguages = !showLanguages;
          showTopics = false;
          showSort = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={showLanguages}
      >
        <Icon icon="ph:code-bold" class="w-4 h-4" />
        <span>Language</span>
        {#if filter.languages.length > 0}
          <span class="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {filter.languages.length}
          </span>
        {/if}
        <Icon icon="ph:caret-down-bold" class="w-3 h-3" />
      </button>

      {#if showLanguages}
        <div
          class="absolute left-0 mt-2 w-64 max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50"
          role="listbox"
          aria-label="Filter by language"
        >
          <div class="sticky top-0 z-10 bg-white dark:bg-zinc-900 p-2 pb-2 mb-0 border-b border-zinc-200 dark:border-zinc-700">
            <div class="relative">
              <Icon
                icon="ph:magnifying-glass"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              />
              <input
                type="text"
                bind:value={languageSearchQuery}
                placeholder="Search languages..."
                class="w-full pl-8 pr-8 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {#if languageSearchQuery}
                <button
                  onclick={() => (languageSearchQuery = "")}
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <Icon icon="ph:x" class="w-3 h-3" />
                </button>
              {/if}
            </div>
            {#if filter.languages.length > 0}
              <button
                onclick={() => onFilterChange({ languages: [] })}
                class="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Icon icon="ph:x" class="w-3 h-3" />
                Clear all ({filter.languages.length})
              </button>
            {/if}
          </div>
          <div class="grid grid-cols-2 gap-1 p-2 pt-0">
            {#each filteredLanguages as lang}
              <button
                onclick={() => toggleLanguage(lang.name)}
                class="tag {filter.languages.includes(lang.name) ? 'tag-active' : ''} truncate"
                title="{lang.count} repositories"
                role="option"
                aria-selected={filter.languages.includes(lang.name)}
              >
                {lang.name}
                <span class="ml-1 text-xs opacity-60">({lang.count})</span>
              </button>
            {/each}
            {#if filteredLanguages.length === 0}
              <p class="col-span-2 text-sm text-zinc-500 py-2 text-center">No languages found</p>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Topic filter -->
    <div class="relative" data-dropdown>
      <button
        onclick={() => {
          showTopics = !showTopics;
          showLanguages = false;
          showSort = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={showTopics}
      >
        <Icon icon="ph:tag-bold" class="w-4 h-4" />
        <span>Topics</span>
        {#if filter.topics.length > 0}
          <span class="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {filter.topics.length}
          </span>
        {/if}
        <Icon icon="ph:caret-down-bold" class="w-3 h-3" />
      </button>

      {#if showTopics}
        <div
          class="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50"
          role="listbox"
          aria-label="Filter by topic"
        >
          <div class="sticky top-0 z-10 bg-white dark:bg-zinc-900 p-2 pb-2 mb-0 border-b border-zinc-200 dark:border-zinc-700">
            <div class="relative">
              <Icon
                icon="ph:magnifying-glass"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              />
              <input
                type="text"
                bind:value={topicSearchQuery}
                placeholder="Search topics..."
                class="w-full pl-8 pr-8 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {#if topicSearchQuery}
                <button
                  onclick={() => (topicSearchQuery = "")}
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <Icon icon="ph:x" class="w-3 h-3" />
                </button>
              {/if}
            </div>
            {#if filter.topics.length > 0}
              <button
                onclick={() => onFilterChange({ topics: [] })}
                class="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Icon icon="ph:x" class="w-3 h-3" />
                Clear all ({filter.topics.length})
              </button>
            {/if}
          </div>
          <div class="flex flex-wrap gap-1 p-2 pt-0">
            {#each filteredTopics.slice(0, 50) as topic}
              <button
                onclick={() => toggleTopic(topic.name)}
                class="tag {filter.topics.includes(topic.name) ? 'tag-active' : ''}"
                title="{topic.count} repositories"
                role="option"
                aria-selected={filter.topics.includes(topic.name)}
              >
                {topic.name}
                <span class="ml-1 text-xs opacity-60">({topic.count})</span>
              </button>
            {/each}
            {#if filteredTopics.length === 0}
              <p class="text-sm text-zinc-500 py-2">No topics found</p>
            {:else if filteredTopics.length > 50}
              <p class="w-full text-xs text-zinc-400 pt-2 text-center">
                Showing 50 of {filteredTopics.length} topics
              </p>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Sort -->
    <div class="relative" data-dropdown>
      <button
        onclick={() => {
          showSort = !showSort;
          showLanguages = false;
          showTopics = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={showSort}
      >
        <Icon icon="ph:sort-ascending-bold" class="w-4 h-4" />
        <span>{sortOptions.find((s) => s.value === filter.sortField)?.label}</span>
        <Icon
          icon={filter.sortOrder === "desc" ? "ph:caret-down-bold" : "ph:caret-up-bold"}
          class="w-3 h-3"
        />
      </button>

      {#if showSort}
        <div
          class="absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50"
          role="listbox"
          aria-label="Sort repositories"
        >
          {#each sortOptions as opt}
            <button
              onclick={() => setSort(opt.value)}
              class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors {filter.sortField === opt.value ? 'text-primary-600 dark:text-primary-400' : ''}"
              role="option"
              aria-selected={filter.sortField === opt.value}
            >
              <span class="text-sm">{opt.label}</span>
              {#if filter.sortField === opt.value}
                <Icon
                  icon={filter.sortOrder === "desc" ? "ph:caret-down-bold" : "ph:caret-up-bold"}
                  class="w-3 h-3 ml-auto"
                />
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Clear filters -->
    {#if hasActiveFilters}
      <button
        onclick={clearFilters}
        class="btn btn-secondary flex items-center gap-2 text-red-600 dark:text-red-400"
      >
        <Icon icon="ph:x-bold" class="w-4 h-4" />
        <span>Clear</span>
      </button>
    {/if}

    <!-- Results count -->
    <div class="ml-auto text-sm text-zinc-500">
      {filteredCount} of {totalCount} repositories
    </div>
  </div>

  <!-- Active filters display -->
  {#if filter.languages.length > 0 || filter.topics.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each filter.languages as lang}
        <button
          onclick={() => toggleLanguage(lang)}
          class="tag tag-active flex items-center gap-1"
        >
          <span>{lang}</span>
          <Icon icon="ph:x-bold" class="w-3 h-3" />
        </button>
      {/each}
      {#each filter.topics as topic}
        <button
          onclick={() => toggleTopic(topic)}
          class="tag tag-active flex items-center gap-1"
        >
          <span>{topic}</span>
          <Icon icon="ph:x-bold" class="w-3 h-3" />
        </button>
      {/each}
    </div>
  {/if}
</div>

<svelte:window onclick={(e) => {
  const target = e.target as Element;
  if (!target.closest('[data-dropdown]')) {
    showLanguages = false;
    showTopics = false;
    showSort = false;
    languageSearchQuery = "";
    topicSearchQuery = "";
  }
}} />
