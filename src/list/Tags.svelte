<script lang="ts">
  import type { Site } from "@/sites";
  import Tag from "./Tag.svelte";
  export let site: Site;
</script>

{#if site.tags && site.tags.length > 0}
  <ul class="flex gap-1 flex-wrap items-center px-2">
    {#each site.tags as tag}
      <Tag {tag} />
    {/each}
  </ul>
{/if}
