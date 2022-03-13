<script lang="ts">
  import type { Repo } from "@/type";
  import { inview } from "svelte-inview";
  import Tags from "./Tags.svelte";

  export let repo: Repo;
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
  <div class="flex text-xs leading-tight px-2 gap-2 justify-start items-top">
    <span class="text-lg">
      <a
        class="hover:text-emerald-200"
        href={`https://github.com/${encodeURIComponent(repo.owner)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repo.owner}
      </a>
      {" / "}
      <a
        class="hover:text-emerald-200"
        href={`https://github.com/${encodeURIComponent(
          repo.owner
        )}/${encodeURIComponent(repo.name)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repo.name}
      </a>
    </span>
  </div>
  {#if repo.homepage}
    <p class="text-sm px-2">
      <a
        class="hover:text-emerald-200"
        href={repo.homepage}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repo.homepage}
      </a>
    </p>
  {/if}
  {#if repo.tags && repo.tags.length > 0}
    <hr class="opacity-80" />
    <Tags {repo} />
  {/if}
  {#if repo.description}
    <hr class="opacity-80" />
    <p class="px-2">
      {repo.description}
    </p>
  {/if}
</div>

<style>
  .\-:hover hr {
    opacity: 0.2;
  }
</style>
