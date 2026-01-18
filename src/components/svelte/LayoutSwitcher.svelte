<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { LayoutMode } from "../../lib/types";

  interface Props {
    layoutMode: LayoutMode;
    onLayoutChange: (mode: LayoutMode) => void;
  }

  let { layoutMode, onLayoutChange }: Props = $props();

  const layouts: { value: LayoutMode; icon: string; label: string }[] = [
    { value: "card", icon: "ph:squares-four-bold", label: "Cards" },
    { value: "list", icon: "ph:list-bold", label: "List" },
    { value: "compact", icon: "ph:list-dashes-bold", label: "Compact" },
  ];
</script>

<div class="flex border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
  {#each layouts as layout}
    <button
      onclick={() => onLayoutChange(layout.value)}
      class="p-2 transition-colors {layoutMode === layout.value
        ? 'bg-primary-500 text-white'
        : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
      title={layout.label}
    >
      <Icon icon={layout.icon} class="w-5 h-5" />
    </button>
  {/each}
</div>
