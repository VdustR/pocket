<script lang="ts">
  import type { Site } from "@/sites";
  import { inview } from "svelte-inview";
  import OpenOutIcon from "./OpenOutIcon.svelte";
  import Tags from "./Tags.svelte";

  export let site: Site;
  let isInView: boolean;
</script>

<div
  use:inview
  on:change={(e) => {
    isInView = e.detail.inView;
  }}
  class="- bg-black rounded flex-col flex border-width-2 w-full py-1.5 ease-in-out gap-2 scale-x-95 duration-200 relative hover:bg-black hover:border-white hover:bg-opacity-10 hover:border-opacity-20 hover:scale-100 hover:backdrop-filter hover:backdrop-blur-md"
  class:bg-opacity-65={isInView}
  class:transform={isInView}
  class:transition-all={isInView}
>
  <a
    class="flex flex-col px-2 gap-2 hover:text-emerald-200"
    href={site.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="flex text-xs leading-tight gap-2 justify-between items-top">
      <div>
        <h3 class="font-bold text-xl">
          {site.title}
        </h3>
        <div>{site.url}</div>
      </div>
      <div><OpenOutIcon /></div>
    </div>
  </a>
  {#if site.tags && site.tags.length > 0}
    <hr class="opacity-80" />
    <Tags {site} />
  {/if}
  {#if site.description}
    <hr class="opacity-80" />
    <p class="px-2">
      {site.description}
    </p>
  {/if}
</div>

<style>
  .\-:hover hr {
    opacity: 0.2;
  }
</style>
