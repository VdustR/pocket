<script lang="ts">
  import type { Repo } from "@/type";
  import Tag from "./Tag.svelte";
  export let repo: Repo;
</script>

{#if repo.tags && repo.tags.length > 0}
  <ul class="flex flex-wrap px-2 gap-1 items-center">
    {#each repo.tags as tag}
      <Tag {tag} />
    {/each}
  </ul>
{/if}
