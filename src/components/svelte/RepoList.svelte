<script lang="ts">
  import RepoCard from "./RepoCard.svelte";
  import type { Repo, LayoutMode } from "../../lib/types";

  interface Props {
    repos: Repo[];
    layoutMode: LayoutMode;
  }

  let { repos, layoutMode }: Props = $props();

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
  <div class="text-center py-20">
    <div class="text-6xl mb-4">🔍</div>
    <h3 class="text-xl font-medium text-zinc-700 dark:text-zinc-300 mb-2">
      No repositories found
    </h3>
    <p class="text-zinc-500">
      Try adjusting your search or filter criteria
    </p>
  </div>
{:else}
  <div class={gridClass()}>
    {#each displayedRepos as repo, index (repo.fullName)}
      <RepoCard {repo} {layoutMode} isHot={index < 3} />
    {/each}
  </div>

  {#if hasMore}
    <div class="text-center py-8 text-zinc-500">
      Showing {DISPLAY_LIMIT} of {repos.length} repositories
    </div>
  {/if}
{/if}
