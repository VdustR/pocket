<script lang="ts">
  import Icon from "@iconify/svelte";
  import RepoCard from "./RepoCard.svelte";
  import type { Repo, LayoutMode } from "../../lib/types";

  interface Props {
    repos: Repo[];
    layoutMode: LayoutMode;
    top3FullNames: Set<string>;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
  }

  let { repos, layoutMode, top3FullNames, hasActiveFilters, onClearFilters }: Props = $props();

  // Limit display for performance (can implement virtual scroll later)
  const DISPLAY_LIMIT = 100;
  let displayedRepos = $derived(repos.slice(0, DISPLAY_LIMIT));
  let hasMore = $derived(repos.length > DISPLAY_LIMIT);

  let gridClass = $derived(() => {
    switch (layoutMode) {
      case "card":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
      case "list":
        return "flex flex-col gap-3";
      case "compact":
        return "flex flex-col gap-1";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    }
  });
</script>

{#if repos.length === 0}
  <div class="mx-auto max-w-md text-center py-16 sm:py-20">
    <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
      <Icon icon="ph:magnifying-glass-bold" class="w-7 h-7" />
    </div>
    <h3 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
      No repositories found
    </h3>
    <p class="text-zinc-600 dark:text-zinc-400">
      Try adjusting your search or filter criteria
    </p>
    {#if hasActiveFilters}
      <button
        onclick={onClearFilters}
        class="btn btn-primary mt-5 inline-flex items-center gap-2"
      >
        <Icon icon="ph:x-bold" class="w-4 h-4" />
        <span>Clear filters</span>
      </button>
    {/if}
  </div>
{:else}
  <div class={gridClass()}>
    {#each displayedRepos as repo (repo.fullName)}
      <RepoCard {repo} {layoutMode} isHot={top3FullNames.has(repo.fullName)} />
    {/each}
  </div>

  {#if hasMore}
    <div class="text-center py-8 text-zinc-500">
      Showing {DISPLAY_LIMIT} of {repos.length} repositories
    </div>
  {/if}
{/if}
