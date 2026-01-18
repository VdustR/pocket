<script lang="ts">
  import { onMount } from "svelte";

  let showHelp = $state(false);

  const shortcuts = [
    { key: "/", description: "Focus search" },
    { key: "j", description: "Next item" },
    { key: "k", description: "Previous item" },
    { key: "Enter", description: "Open repository" },
    { key: "?", description: "Show shortcuts" },
    { key: "Esc", description: "Close / Clear" },
  ];

  function handleKeydown(e: KeyboardEvent) {
    // Don't trigger shortcuts when typing in input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      if (e.key === "Escape") {
        (e.target as HTMLElement).blur();
      }
      return;
    }

    switch (e.key) {
      case "/":
        e.preventDefault();
        const searchInput = document.getElementById("search-input");
        searchInput?.focus();
        break;

      case "?":
        e.preventDefault();
        showHelp = !showHelp;
        break;

      case "Escape":
        showHelp = false;
        break;

      case "j":
        e.preventDefault();
        navigateItems(1);
        break;

      case "k":
        e.preventDefault();
        navigateItems(-1);
        break;

      case "Enter":
        e.preventDefault();
        openFocusedItem();
        break;
    }
  }

  let focusedIndex = $state(-1);

  function navigateItems(direction: number) {
    const items = document.querySelectorAll("[data-repo-card]");
    if (items.length === 0) return;

    focusedIndex = Math.max(
      0,
      Math.min(items.length - 1, focusedIndex + direction)
    );

    const item = items[focusedIndex] as HTMLElement;
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    item.focus();
    item.classList.add("ring-2", "ring-primary-500");

    // Remove ring from other items
    items.forEach((el, i) => {
      if (i !== focusedIndex) {
        el.classList.remove("ring-2", "ring-primary-500");
      }
    });
  }

  function openFocusedItem() {
    const items = document.querySelectorAll("[data-repo-card]");
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      const item = items[focusedIndex];
      const link = item.tagName === "A" ? (item as HTMLAnchorElement) : item.querySelector("a");
      if (link) {
        window.open(link.href, "_blank");
      }
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

{#if showHelp}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onclick={() => (showHelp = false)}
    onkeydown={(e) => e.key === "Escape" && (showHelp = false)}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <h2 class="text-lg font-medium mb-4">Keyboard Shortcuts</h2>
      <div class="space-y-2">
        {#each shortcuts as shortcut}
          <div class="flex items-center justify-between">
            <span class="text-zinc-600 dark:text-zinc-400">
              {shortcut.description}
            </span>
            <kbd
              class="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono"
            >
              {shortcut.key}
            </kbd>
          </div>
        {/each}
      </div>
      <button
        onclick={() => (showHelp = false)}
        class="mt-6 w-full btn btn-secondary"
      >
        Close
      </button>
    </div>
  </div>
{/if}

<!-- Hint for shortcuts -->
<div class="fixed bottom-4 right-4 text-sm text-zinc-400 hidden md:block">
  Press <kbd class="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">?</kbd> for shortcuts
</div>
