<script lang="ts">
  import qs from "@/qs";
  import shuffledSites from "@/shuffledSites";
  import Fuse from "fuse.js";
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import Item from "./Item.svelte";
  const sliceSize = 20;
  const duration = 200;
  $: filteredSites = $shuffledSites.filter((site) => {
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
  })().slice(0, sliceSize);
  $: noResult = filterSites.length === 0;
  $: searching = $qs.qs.q.trim().length > 0 || $qs.qs.tags.length > 0;
</script>

<section class="flex flex-col flex-1 w-full px-4 gap-4 items-stretch">
  {#if searching && noResult}
    <div
      class="border border-solid rounded-lg flex flex-col bg-red-800 bg-opacity-50 border-red-200 text-center py-20 px-4 text-3xl gap-4 backdrop-blur-md backdrop-filter items-center justify-center"
    >
      <span>{"No Matched Results"}</span>
      <button
        class="border border-white rounded-xl cursor-pointer flex bg-opacity-70 text-base px-2 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
        on:click={() => $qs.setQs({ q: "", tags: [] })}
      >
        {"Clear Filters"}
      </button>
    </div>
  {/if}
  <ul class="mx-auto block">
    {#each filterSites as site (site.url)}
      <li
        class="mb-4 w-full inline-block"
        in:scale={{ duration }}
        animate:flip={{ duration }}
      >
        <Item {site} />
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    --size: 3;
    --gap: 0rem;
    column-gap: var(--gap);
    column-width: 280px;
  }

  ul > :global(*) {
    max-width: 120rem;
  }

  @media (max-width: 720px) {
    ul > :global(*) {
      width: 100%;
    }
  }
</style>
