<script lang="ts">
  import qs from "@/qs";
</script>

<button
  class="bg-black border border-white rounded-xl cursor-pointer flex bg-opacity-70 pr-1 pl-2 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  tabindex={0}
  on:click={() => {
    $qs.setQs({
      tags: [],
    });
  }}
>
  {"Clear All Tags"}
  <svg width="1.5em" height="1.5em" viewBox="0 0 24 24"
    ><path
      d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"
      fill="currentColor"
    /></svg
  >
</button>
