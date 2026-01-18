<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import Icon from "@iconify/svelte";

  interface Props {
    onToggleDashboard: () => void;
    showDashboard: boolean;
  }

  let { onToggleDashboard, showDashboard }: Props = $props();
</script>

<header class="sticky top-0 z-50 bg-white/80 dark:bg-[rgba(13,17,23,0.8)] backdrop-blur-md border-b border-zinc-200 dark:border-[rgba(48,54,61,0.5)]">
  <div class="container mx-auto px-4 py-4 max-w-7xl">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a href="/pocket/" class="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <img src="/pocket/favicon.png" alt="Pocket" class="w-8 h-8 rounded-full transition-transform group-hover:scale-110" />
          <h1 class="text-2xl font-display font-bold text-primary-600 dark:text-primary-400 dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] tracking-wide">
            ViPro's Picks
          </h1>
        </a>
      </div>

      <div class="flex items-center gap-2">
        <button
          onclick={onToggleDashboard}
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[rgba(6,182,212,0.1)] transition-all dark:hover:text-primary-400"
          title={showDashboard ? "Show List" : "Show Dashboard"}
        >
          <Icon
            icon={showDashboard ? "ph:list-bold" : "ph:chart-pie-bold"}
            class="w-5 h-5"
          />
        </button>

        <a
          href="/pocket/rss.xml"
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[rgba(6,182,212,0.1)] transition-all dark:hover:text-primary-400"
          title="RSS Feed"
        >
          <Icon icon="ph:rss-bold" class="w-5 h-5" />
        </a>

        <a
          href="https://github.com/VdustR/pocket"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[rgba(6,182,212,0.1)] transition-all dark:hover:text-primary-400"
          title="GitHub"
        >
          <Icon icon="ph:github-logo-bold" class="w-5 h-5" />
        </a>

        <ThemeToggle />
      </div>
    </div>
  </div>
</header>
