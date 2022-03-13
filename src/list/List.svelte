<script lang="ts" context="module">
  import fuseKeys from "@/fuseKeys";
  import qs from "@/qs";
  import repos from "@/repos";
  import fuseIndex from "@/reposIndex.json";
  import shuffledSites from "@/shuffledRepos";
  import type { Repo } from "@/type";
  import Fuse from "fuse.js";
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import Item from "./Item.svelte";

  const myIndex = Fuse.parseIndex(fuseIndex);

  const fuse = new Fuse<Repo>(
    repos,
    {
      keys: fuseKeys,
    },
    myIndex
  );
</script>

<script lang="ts">
  const sliceSize = 20;
  const duration = 200;

  $: filterRepos = (() => {
    const q = $qs.qs.q;
    if (q.trim().length === 0) return $shuffledSites;
    return fuse.search(q).map(({ item }) => item);
  })()
    .filter((site) => {
      if ($qs.qs.tags.length === 0) return true;
      return $qs.qs.tags.every((tag) =>
        site.tags?.some((target) => target === tag)
      );
    })
    .slice(0, sliceSize);
  $: noResult = filterRepos.length === 0;
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
    {#each filterRepos as repo (`${repo.owner}/${repo.name}`)}
      <li
        class="mb-4 w-full inline-block"
        in:scale={{ duration }}
        animate:flip={{ duration }}
      >
        <Item {repo} />
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
