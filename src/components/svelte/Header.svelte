<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import Icon from "@iconify/svelte";

  interface Props {
    onToggleDashboard: () => void;
    showDashboard: boolean;
  }

  let { onToggleDashboard, showDashboard }: Props = $props();
</script>

<header class="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-[#12161d]/95">
  <div class="container mx-auto max-w-6xl px-4 py-3 sm:px-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/pocket/" class="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
          <img src="/pocket/favicon.png" alt="Pocket" class="h-8 w-8 rounded-lg" />
          <div class="leading-none">
            <h1 class="font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Pocket</h1>
            <p class="mt-1 hidden text-[11px] font-medium text-zinc-500 dark:text-zinc-400 sm:block">A starred repository library</p>
          </div>
        </a>
      </div>

      <div class="flex items-center gap-1 sm:gap-2">
        <button
          onclick={onToggleDashboard}
          class="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-primary-300"
          title={showDashboard ? "Show List" : "Show Dashboard"}
        >
          <Icon
            icon={showDashboard ? "ph:list-bold" : "ph:chart-pie-bold"}
            class="w-5 h-5"
          />
        </button>

        <a
          href="/pocket/rss.xml"
          class="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-primary-300"
          title="RSS Feed"
        >
          <Icon icon="ph:rss-bold" class="w-5 h-5" />
        </a>

        <a
          href="https://github.com/VdustR/pocket"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-primary-300"
          title="GitHub"
        >
          <Icon icon="ph:github-logo-bold" class="w-5 h-5" />
        </a>

        <ThemeToggle />
      </div>
    </div>
  </div>
</header>
