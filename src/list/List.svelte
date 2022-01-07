<script lang="ts">
  import allSites from "@/allSites";
  import useQs from "@/qs/useQs";
  import Fuse from "fuse.js";
  import shuffle from "lodash/shuffle";
  import { derived } from "svelte/store";
  import Item from "./Item.svelte";
  const qs = useQs();
  const shuffledSites = shuffle(allSites);
  const filteredSites = derived(qs, ({ qs }) =>
    shuffledSites.filter((site) => {
      if (qs.tags.length === 0) return true;
      return qs.tags.every((tag) =>
        site.tags?.some((target) => target === tag)
      );
    })
  );
  const fuse = derived(filteredSites, ($filteredSites) => {
    return new Fuse($filteredSites, {
      keys: ["title", "description", "url"],
    });
  });
  const filterSites = derived(
    [qs, fuse, filteredSites],
    ([
      {
        qs: { q },
      },
      $fuse,
      $filteredSites,
    ]) => {
      if (q.trim().length === 0) return $filteredSites;
      return $fuse.search(q).map(({ item }) => item);
    }
  );
  const noResult = derived(
    filterSites,
    ($filterSites) => $filterSites.length === 0
  );
</script>

<div class="flex-1 w-full px-4 flex flex-col items-stretch gap-4">
  {#if ($qs.qs.q.trim() || $qs.qs.tags.length > 0) && $noResult}
    <div
      class="text-red-200 border-red-200 border py-20 px-4 border-solid rounded-lg text-center bg-red-800 bg-opacity-50 backdrop-blur-md backdrop-filter text-3xl"
    >
      {"No Matched Results"}
    </div>
  {/if}
  <ul class="ul block mx-auto">
    {#each $noResult ? allSites : $filterSites as site}
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
