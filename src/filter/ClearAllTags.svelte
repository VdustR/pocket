<script lang="ts">
  import Eraser from "@/icon/phosphor/Eraser.svelte";
  import qs from "@/qs";
</script>

<button
  class="bg-black border border-white rounded-xl cursor-pointer flex bg-opacity-70 pr-1 pl-2 gap-0.5 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  tabindex={0}
  on:click={() => {
    $qs.setQs({
      tags: [],
    });
  }}
>
  {"Clear All Tags"}
  <span class="text-size-1.5em"> <Eraser /></span>
</button>
