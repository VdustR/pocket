<script lang="ts">
  import useQs from "@/qs/useQs";
  import tags from "@/tags";
  import Fuse from "fuse.js";
  import { derived } from "svelte/store";
  import Tag from "./Tag.svelte";
  const qs = useQs();
  const sortedTags = tags.sort((a, b) => b.sites.length - a.sites.length);
  const fuse = derived(qs, ({ qs }) => {
    const fuse = new Fuse(sortedTags, { keys: ["tag"] });
    return fuse;
  });
  $: filteredTags = (() => {
    const filteredTags =
      $qs.qs.q.trim().length === 0
        ? tags.slice(0, 100)
        : $fuse
            .search($qs.qs.q)
            .slice(0, 100)
            .map(({ item }) => item);
    $qs.qs.tags.forEach((tag) => {
      if (!filteredTags.some((target) => target.tag === tag)) {
        filteredTags.push(sortedTags.find((target) => target.tag === tag));
      }
    });
    return filteredTags;
  })();
</script>

{#if filteredTags.length > 0}
  <ul class="flex gap-2 flex-wrap items-center justify-center">
    {#each filteredTags as tag}
      <Tag {tag} />
    {/each}
  </ul>
{/if}
