<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<footer class="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
  <div class="container mx-auto px-4 max-w-7xl">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
      <div class="flex items-center gap-2">
        <span>Built with</span>
        <a
          href="https://astro.build"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Astro
        </a>
        <span>+</span>
        <a
          href="https://svelte.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Svelte 5
        </a>
        <span>+</span>
        <a
          href="https://claude.ai/code"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Claude Code
        </a>
      </div>

      <div class="flex items-center gap-4">
        <a
          href="https://github.com/VdustR"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <Icon icon="ph:github-logo-bold" class="w-4 h-4" />
          <span>VdustR</span>
        </a>
        <a
          href="https://github.com/VdustR/pocket/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <Icon icon="ph:scales-bold" class="w-4 h-4" />
          <span>MIT License</span>
        </a>
        <a
          href="/pocket/rss.xml"
          class="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <Icon icon="ph:rss-bold" class="w-4 h-4" />
          <span>RSS</span>
        </a>
      </div>

      <div class="text-zinc-400">
        Stay awhile and listen 👀
      </div>
    </div>
  </div>
</footer>
