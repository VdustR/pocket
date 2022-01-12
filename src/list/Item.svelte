<script lang="ts">
  import type { Site } from "@/sites";
  import OpenOutIcon from "./OpenOutIcon.svelte";
  import Tags from "./Tags.svelte";
  export let site: Site;
</script>

<div
  class="bg-black rounded flex-col flex bg-opacity-85 border-width-2 w-full py-1.5 transform transition-all ease-in-out gap-2 scale-x-95 duration-200 relative hover:bg-black hover:bg-opacity-50 hover:scale-100 hover:backdrop-filter hover:backdrop-blur-md"
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
