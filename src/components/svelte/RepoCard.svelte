<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Repo, LayoutMode } from "../../lib/types";
  import { getLanguageColor } from "../../lib/colors";
  import { parseEmoji } from "../../lib/emoji";

  interface Props {
    repo: Repo;
    layoutMode: LayoutMode;
  }

  let { repo, layoutMode }: Props = $props();

  let isExpanded = $state(false);

  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isHot(pushedAt: string): boolean {
    const daysSincePush = (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSincePush <= 30; // Active if updated in the last 30 days
  }
</script>

{#if layoutMode === "compact"}
  <!-- Compact mode -->
  <a
    href={`https://github.com/${repo.fullName}`}
    target="_blank"
    rel="noopener noreferrer"
    data-repo-card
    class="flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-[rgba(6,182,212,0.08)] rounded-lg transition-all duration-200 group"
  >
    {#if repo.language}
      <span
        class="w-3 h-3 rounded-full flex-shrink-0"
        style="background-color: {getLanguageColor(repo.language)}"
        title={repo.language}
      ></span>
    {:else}
      <span class="w-3 h-3 flex-shrink-0"></span>
    {/if}
    <span class="font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
      {repo.fullName}
    </span>
    <span class="text-zinc-500 text-sm truncate flex-1">
      {parseEmoji(repo.description)}
    </span>
    <span class="flex items-center gap-1 text-sm text-zinc-500 flex-shrink-0">
      {#if isHot(repo.pushedAt)}
        <Icon icon="ph:fire-bold" class="w-4 h-4 text-orange-500" title="Active in last 30 days" />
      {/if}
      <Icon icon="ph:star-fill" class="w-4 h-4 text-yellow-500" />
      {formatNumber(repo.stars)}
    </span>
  </a>
{:else if layoutMode === "list"}
  <!-- List mode -->
  <div data-repo-card class="card p-4 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all duration-300 dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
    <div class="flex items-start gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            {repo.fullName}
          </a>
          {#if repo.language}
            <span class="flex items-center gap-1 text-xs text-zinc-500">
              <span
                class="w-2 h-2 rounded-full"
                style="background-color: {getLanguageColor(repo.language)}"
              ></span>
              {repo.language}
            </span>
          {/if}
        </div>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
          {parseEmoji(repo.description) || "No description"}
        </p>
      </div>
      <div class="flex items-center gap-4 text-sm text-zinc-500 flex-shrink-0">
        {#if isHot(repo.pushedAt)}
          <Icon icon="ph:fire-bold" class="w-4 h-4 text-orange-500" title="Active in last 30 days" />
        {/if}
        <span class="flex items-center gap-1">
          <Icon icon="ph:star-fill" class="w-4 h-4 text-yellow-500" />
          {formatNumber(repo.stars)}
        </span>
        <span class="flex items-center gap-1">
          <Icon icon="ph:git-fork-bold" class="w-4 h-4" />
          {formatNumber(repo.forks)}
        </span>
      </div>
    </div>
  </div>
{:else}
  <!-- Card mode -->
  <div data-repo-card class="card p-4 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all duration-300 dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col">
    <div class="flex items-start justify-between gap-2 mb-2">
      <a
        href={`https://github.com/${repo.fullName}`}
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-primary-600 dark:text-primary-400 hover:underline line-clamp-1"
      >
        {repo.fullName}
      </a>
      <button
        onclick={() => (isExpanded = !isExpanded)}
        class="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
        title={isExpanded ? "Collapse" : "Expand"}
      >
        <Icon
          icon={isExpanded ? "ph:caret-up-bold" : "ph:caret-down-bold"}
          class="w-4 h-4"
        />
      </button>
    </div>

    <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-3 {isExpanded ? '' : 'line-clamp-2'} flex-1">
      {parseEmoji(repo.description) || "No description"}
    </p>

    <div class="flex items-center gap-4 text-sm text-zinc-500 mb-3">
      {#if isHot(repo.pushedAt)}
        <Icon icon="ph:fire-bold" class="w-4 h-4 text-orange-500" title="Active in last 30 days" />
      {/if}
      <span class="flex items-center gap-1">
        <Icon icon="ph:star-fill" class="w-4 h-4 text-yellow-500" />
        {formatNumber(repo.stars)}
      </span>
      <span class="flex items-center gap-1">
        <Icon icon="ph:git-fork-bold" class="w-4 h-4" />
        {formatNumber(repo.forks)}
      </span>
      {#if repo.language}
        <span class="flex items-center gap-1">
          <span
            class="w-2 h-2 rounded-full"
            style="background-color: {getLanguageColor(repo.language)}"
          ></span>
          {repo.language}
        </span>
      {/if}
    </div>

    {#if isExpanded}
      <div class="border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-auto space-y-2 text-sm">
        <div class="flex items-center gap-2 text-zinc-500">
          <Icon icon="ph:calendar-bold" class="w-4 h-4" />
          <span>Starred: {formatDate(repo.starredAt)}</span>
        </div>
        <div class="flex items-center gap-2 text-zinc-500">
          <Icon icon="ph:clock-bold" class="w-4 h-4" />
          <span>Updated: {formatDate(repo.updatedAt)}</span>
        </div>
        {#if repo.homepage}
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Icon icon="ph:globe-bold" class="w-4 h-4" />
            <span class="truncate">{repo.homepage}</span>
          </a>
        {/if}
        {#if repo.topics.length > 0}
          <div class="flex flex-wrap gap-1 pt-1">
            {#each repo.topics.slice(0, 5) as topic}
              <span class="tag text-xs">{topic}</span>
            {/each}
            {#if repo.topics.length > 5}
              <span class="tag text-xs">+{repo.topics.length - 5}</span>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
