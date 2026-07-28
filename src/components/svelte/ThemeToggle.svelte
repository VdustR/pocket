<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import type { Theme } from "../../lib/types";

  let theme = $state<Theme>("system");
  let isOpen = $state(false);
  let isMounted = $state(false);
  let prefersDark = $state(false);

  const themes: { value: Theme; icon: string; label: string }[] = [
    { value: "light", icon: "ph:sun-bold", label: "Light" },
    { value: "dark", icon: "ph:moon-bold", label: "Dark" },
    { value: "system", icon: "ph:desktop-bold", label: "System" },
  ];

  // SSR-safe derived icon
  let currentIcon = $derived(() => {
    if (!isMounted) return "ph:sun-bold"; // Default for SSR
    if (theme === "system") {
      return prefersDark ? "ph:moon-bold" : "ph:sun-bold";
    }
    return themes.find((t) => t.value === theme)?.icon || "ph:sun-bold";
  });

  onMount(() => {
    isMounted = true;
    theme = (localStorage.getItem("theme") as Theme) || "system";
    prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      prefersDark = e.matches;
      applyTheme();
    };
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  });

  function applyTheme() {
    const isDark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  }

  function setTheme(newTheme: Theme) {
    theme = newTheme;
    localStorage.setItem("theme", newTheme);
    applyTheme();
    isOpen = false;
  }
</script>

<div class="relative">
  <button
    onclick={() => (isOpen = !isOpen)}
    class="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-primary-300"
    title="Toggle theme"
  >
    <Icon icon={currentIcon()} class="w-5 h-5" />
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 z-[60] mt-2 w-40 rounded-xl border border-zinc-200 bg-white py-1 dark:border-zinc-700 dark:bg-zinc-900"
    >
      {#each themes as t}
        <button
          onclick={() => setTheme(t.value)}
          class="flex min-h-11 w-full items-center gap-2 px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors {theme ===
          t.value
            ? 'text-primary-600 dark:text-primary-400'
            : ''}"
        >
          <Icon icon={t.icon} class="w-4 h-4" />
          <span class="text-sm">{t.label}</span>
          {#if theme === t.value}
            <Icon icon="ph:check-bold" class="w-4 h-4 ml-auto" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<svelte:window onclick={(e) => {
  if (isOpen && !(e.target as Element).closest('.relative')) {
    isOpen = false;
  }
}} />
