<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import type { Repo } from "../../lib/types";
  import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
  import { getLanguageColor } from "../../lib/colors";

  interface Props {
    repos: Repo[];
    languages: string[];
  }

  let { repos, languages }: Props = $props();

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart<"pie"> | null = null;

  // Computed stats
  let totalStars = $derived(repos.reduce((sum, r) => sum + r.stars, 0));
  let totalForks = $derived(repos.reduce((sum, r) => sum + r.forks, 0));
  let avgStars = $derived(Math.round(totalStars / (repos.length || 1)));

  let languageDistribution = $derived(() => {
    const dist: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        dist[repo.language] = (dist[repo.language] || 0) + 1;
      }
    });
    return Object.entries(dist)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  });

  let topRepos = $derived(
    [...repos].sort((a, b) => b.stars - a.stars).slice(0, 10)
  );

  let recentlyStarred = $derived(
    [...repos]
      .sort(
        (a, b) =>
          new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime()
      )
      .slice(0, 10)
  );

  onMount(() => {
    Chart.register(PieController, ArcElement, Tooltip, Legend);

    const data = languageDistribution();
    if (data.length > 0 && chartCanvas) {
      chart = new Chart(chartCanvas, {
        type: "pie",
        data: {
          labels: data.map(([lang]) => lang),
          datasets: [
            {
              data: data.map(([, count]) => count),
              backgroundColor: data.map(([lang]) => getLanguageColor(lang)),
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                usePointStyle: true,
                padding: 12,
              },
            },
          },
        },
      });
    }

    return () => {
      chart?.destroy();
    };
  });

  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<div class="space-y-8">
  <!-- Stats Overview -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="card p-4 text-center">
      <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
        {repos.length}
      </div>
      <div class="text-sm text-zinc-500">Repositories</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-3xl font-bold text-yellow-500">
        {formatNumber(totalStars)}
      </div>
      <div class="text-sm text-zinc-500">Total Stars</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-3xl font-bold text-blue-500">
        {formatNumber(totalForks)}
      </div>
      <div class="text-sm text-zinc-500">Total Forks</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-3xl font-bold text-purple-500">
        {languages.length}
      </div>
      <div class="text-sm text-zinc-500">Languages</div>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-8">
    <!-- Language Distribution Chart -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
        <Icon icon="ph:chart-pie-bold" class="w-5 h-5" />
        Language Distribution
      </h3>
      <div class="h-64">
        <canvas bind:this={chartCanvas}></canvas>
      </div>
    </div>

    <!-- Top Starred -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
        <Icon icon="ph:star-bold" class="w-5 h-5 text-yellow-500" />
        Most Starred
      </h3>
      <div class="space-y-2">
        {#each topRepos as repo, i}
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span class="text-zinc-400 w-6 text-right">{i + 1}</span>
            <span class="flex-1 truncate text-sm">{repo.fullName}</span>
            <span class="flex items-center gap-1 text-sm text-zinc-500">
              <Icon icon="ph:star-fill" class="w-4 h-4 text-yellow-500" />
              {formatNumber(repo.stars)}
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <!-- Recently Starred -->
  <div class="card p-6">
    <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
      <Icon icon="ph:clock-bold" class="w-5 h-5" />
      Recently Starred
    </h3>
    <div class="grid md:grid-cols-2 gap-2">
      {#each recentlyStarred as repo}
        <a
          href={`https://github.com/${repo.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span class="flex-1 truncate text-sm">{repo.fullName}</span>
          <span class="text-xs text-zinc-500">
            {formatDate(repo.starredAt)}
          </span>
        </a>
      {/each}
    </div>
  </div>
</div>
