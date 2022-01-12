<script lang="ts">
  import qs from "@/qs";
  import tags from "@/tags";
  import Fuse from "fuse.js";
  import Tag from "./Tag.svelte";
  const sortedTags = tags.sort((a, b) => b.sites.length - a.sites.length);
  let fuse = new Fuse(sortedTags, { keys: ["tag"] });
  $: filteredTags = (() => {
    const filteredTags = (
      $qs.qs.q.trim().length === 0
        ? tags
        : fuse.search($qs.qs.q).map(({ item }) => item)
    ).slice(0, 20);
    // always show if selected
    $qs.qs.tags.forEach((tag) => {
      if (!filteredTags.some((target) => target.tag === tag)) {
        const newTag = sortedTags.find((target) => target.tag === tag);
        if (!newTag) return;
        filteredTags.push(newTag);
      }
    });
    return filteredTags;
  })();
</script>

{#if filteredTags.length > 0}
  <ul class="flex flex-wrap gap-2 items-center justify-center">
    {#each filteredTags as tag}
      <Tag {tag} />
    {/each}
  </ul>
{/if}
