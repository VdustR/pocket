<script lang="ts">
  import type { Site } from "@/sites";
  import Tag from "./Tag.svelte";
  export let site: Site;
</script>

{#if site.tags && site.tags.length > 0}
  <ul class="flex flex-wrap px-2 gap-1 items-center">
    {#each site.tags as tag}
      <Tag {tag} />
    {/each}
  </ul>
{/if}
