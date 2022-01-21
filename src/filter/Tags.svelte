<script lang="ts">
  import { q } from "@/filter/Q.svelte";
  import getTransitionIdMap from "@/getTransitionIdMap";
  import qs from "@/qs";
  import { tags } from "@/sites";
  import Fuse from "fuse.js";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  const maxCount = 20;
  let fuse = new Fuse(tags, { keys: ["tag"] });
  $: filteredTags = (() => {
    const filteredTags = (
      $q.trim().length === 0 ? tags : fuse.search($q).map(({ item }) => item)
    ).slice(0, maxCount);
    // always show if selected
    let spliceIndex = filteredTags.length - 1;
    $qs.qs.tags.forEach((tag) => {
      if (!filteredTags.some((target) => target === tag)) {
        const newTag = tags.find((target) => target === tag);
        if (!newTag) return;
        filteredTags.splice(spliceIndex, 1, newTag);
        spliceIndex--;
      }
    });
    return filteredTags;
  })();
  $: activeArr = filteredTags.map((tag) => $qs.qs.tags.includes(tag));

  const transitionIdMap = getTransitionIdMap<string>();
  $: {
    transitionIdMap.syncMap(filteredTags);
  }
</script>

{#if filteredTags.length > 0}
  <ul class="flex flex-wrap gap-2 items-center justify-center">
    {#each filteredTags as tag, i (transitionIdMap.getItemId(tag))}
      <li
        animate:flip={{ duration: 200 }}
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
        class="border border-white rounded-xl cursor-pointer flex bg-opacity-70 px-2 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
        class:bg-black={!activeArr[i]}
        class:bg-emerald-800={activeArr[i]}
        role="button"
        tabindex={0}
        on:click={() => {
          $qs.setQs({
            tags: $qs.qs.tags.includes(tag)
              ? $qs.qs.tags.filter((target) => target !== tag)
              : [...$qs.qs.tags, tag].sort((a, b) => a.localeCompare(b)),
          });
        }}
      >
        {tag}
      </li>
    {/each}
  </ul>
{/if}
