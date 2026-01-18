<script lang="ts">
  import Icon from "@iconify/svelte";
  import LayoutSwitcher from "./LayoutSwitcher.svelte";
  import type { FilterState, LayoutMode, SortField, SortOrder } from "../../lib/types";

  interface Props {
    filter: FilterState;
    languages: string[];
    topics: string[];
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
    <div class="relative">
      <button
        onclick={() => {
          showLanguages = !showLanguages;
          showTopics = false;
          showSort = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
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
        <div class="absolute left-0 mt-2 w-64 max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2 z-50">
          <div class="grid grid-cols-2 gap-1">
            {#each languages as lang}
              <button
                onclick={() => toggleLanguage(lang)}
                class="tag {filter.languages.includes(lang) ? 'tag-active' : ''} truncate"
              >
                {lang}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Topic filter -->
    <div class="relative">
      <button
        onclick={() => {
          showTopics = !showTopics;
          showLanguages = false;
          showSort = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
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
        <div class="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2 z-50">
          <div class="flex flex-wrap gap-1">
            {#each topics.slice(0, 50) as topic}
              <button
                onclick={() => toggleTopic(topic)}
                class="tag {filter.topics.includes(topic) ? 'tag-active' : ''}"
              >
                {topic}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Sort -->
    <div class="relative">
      <button
        onclick={() => {
          showSort = !showSort;
          showLanguages = false;
          showTopics = false;
        }}
        class="btn btn-secondary flex items-center gap-2"
      >
        <Icon icon="ph:sort-ascending-bold" class="w-4 h-4" />
        <span>{sortOptions.find((s) => s.value === filter.sortField)?.label}</span>
        <Icon
          icon={filter.sortOrder === "desc" ? "ph:caret-down-bold" : "ph:caret-up-bold"}
          class="w-3 h-3"
        />
      </button>

      {#if showSort}
        <div class="absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
          {#each sortOptions as opt}
            <button
              onclick={() => setSort(opt.value)}
              class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors {filter.sortField === opt.value ? 'text-primary-600 dark:text-primary-400' : ''}"
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
  if (!target.closest('.relative')) {
    showLanguages = false;
    showTopics = false;
    showSort = false;
  }
}} />
