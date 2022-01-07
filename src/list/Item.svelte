<script lang="ts">
  import type { Site } from "@/sites";
  import Tags from "./Tags.svelte";
  export let site: Site;
</script>

<li class="inline-flex relative w-full">
  <a
    class="w-full h-full py-1.5 flex flex-col flex-1 border-width-2 rounded transition-all ease-in-out duration-200 transform bg-black bg-opacity-70 scale-95 hover:bg-emerald-800 hover:bg-opacity-50 hover:text-emerald-200 hover:scale-100 hover:backdrop-filter hover:backdrop-blur-md gap-2"
    href={site.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 class="px-2 text-lg">
      <a
        class="text-sm block leading-tight text-emerald-200 mb-1 font-bold"
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {site.url}
      </a>
      {site.title}
    </h3>
    <Tags {site} />
    <hr />
    <p class="px-2">
      {site.description}
    </p>
  </a>
</li>
