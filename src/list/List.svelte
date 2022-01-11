<script lang="ts">
  import allSites from "@/allSites";
  import qs from "@/qs";
  import Fuse from "fuse.js";
  import shuffle from "lodash/shuffle";
  import Item from "./Item.svelte";
  const shuffledSites = shuffle(allSites);
  $: filteredSites = shuffledSites.filter((site) => {
    if ($qs.qs.tags.length === 0) return true;
    return $qs.qs.tags.every((tag) =>
      site.tags?.some((target) => target === tag)
    );
  });
  $: fuse = new Fuse(filteredSites, {
    keys: ["title", "description", "url"],
  });
  $: filterSites = (() => {
    const q = $qs.qs.q;
    if (q.trim().length === 0) return filteredSites;
    return fuse.search(q).map(({ item }) => item);
  })();
  $: noResult = filterSites.length === 0;
  $: searching = $qs.qs.q.trim().length > 0 || $qs.qs.tags.length > 0;
</script>

<div class="flex flex-col flex-1 w-full px-4 gap-4 items-stretch">
  {#if searching && noResult}
    <div
      class="border border-solid rounded-lg bg-red-800 bg-opacity-50 border-red-200 text-center py-20 px-4 text-red-200 text-3xl backdrop-blur-md backdrop-filter"
    >
      {"No Matched Results"}
    </div>
  {/if}
  <ul class="mx-auto ul block">
    {#each !searching ? allSites : filterSites as site}
      <Item {site} />
    {/each}
  </ul>
</div>

<style>
  ul.ul {
    --size: 3;
    --gap: 0rem;
    column-gap: var(--gap);
    column-width: 280px;
  }

  ul.ul > :global(*) {
    max-width: 120rem;
    margin: 0 var(--gap) var(--gap) 0;
  }

  @media (max-width: 720px) {
    ul.ul > :global(*) {
      width: 100%;
    }
  }
</style>
