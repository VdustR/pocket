<script lang="ts">
  import ArrowSquareOut from "@/icon/phosphor/ArrowSquareOut.svelte";
  import GithubLogoFill from "@/icon/phosphor/GithubLogoFill.svelte";
  import type { Site } from "@/type";
  import { inview } from "svelte-inview";
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
      <div class="leading-snug">
        <h3 class="font-bold text-xl leading-tight">
          {site.title}
        </h3>
        <div class="leading-tight">{site.url}</div>
      </div>
      <div class="text-size-2em"><ArrowSquareOut /></div>
    </div>
  </a>
  {#if site.github}
    <div class="flex text-xs leading-tight px-2 gap-2 justify-start items-top">
      <span class="text-size-1.5em">
        <GithubLogoFill />
      </span>
      <span class="pt-0.25em">
        <a
          class="hover:text-emerald-200"
          href={`https://github.com/${encodeURIComponent(site.github.owner)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.github.owner}
        </a>
        {" / "}
        <a
          class="hover:text-emerald-200"
          href={`https://github.com/${encodeURIComponent(
            site.github.owner
          )}/${encodeURIComponent(site.github.name)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.github.name}
        </a>
      </span>
    </div>
  {/if}
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
