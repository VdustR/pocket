<script lang="ts">
  import type { Site } from "@/sites";
  import OpenOutIcon from "./OpenOutIcon.svelte";
  import Tags from "./Tags.svelte";
  export let site: Site;
</script>

<li
  class="inline-flex relative w-full py-1.5 flex-col border-width-2 rounded transition-all ease-in-out duration-200 transform bg-black bg-opacity-75 scale-95 hover:scale-100 hover:backdrop-filter hover:backdrop-blur-md gap-2"
>
  <a
    class="px-2 flex flex-col gap-2 hover:text-emerald-200"
    href={site.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="text-xs leading-tight flex justify-between items-top gap-2">
      <div>
        <h3 class="text-xl font-bold ">
          {site.title}
        </h3>
        <div>{site.url}</div>
      </div>
      <div><OpenOutIcon /></div>
    </div>
  </a>
  <hr />
  <Tags {site} />
  <hr />
  <p class="px-2">
    {site.description}
  </p>
</li>
