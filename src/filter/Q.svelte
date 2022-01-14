<script lang="ts" context="module">
  import qs from "@/qs";
  import { onDestroy } from "svelte";
  import { writable } from "svelte/store";

  export const q = writable("");
</script>

<script lang="ts">
  let updateQTimeout: ReturnType<typeof setTimeout> | null = null;
  function clearQTimtout() {
    if (updateQTimeout) {
      clearTimeout(updateQTimeout);
      updateQTimeout = null;
    }
  }
  q.subscribe(() => {
    clearQTimtout();
    updateQTimeout = setTimeout(() => {
      $qs.setQs({ q: $q });
      updateQTimeout = null;
    }, 300);
  });
  qs.subscribe(() => {
    clearQTimtout();
    $q = $qs.qs.q;
  });
  onDestroy(() => {
    $q = "";
  });
</script>

<input
  type="search"
  class="bg-black border-solid border rounded-xl bg-opacity-70 py-1 px-2 placeholder-cool-gray-300 text-2xl q focus:border-emerald-200 focus:placeholder-transparent focus:text-emerald-200"
  bind:value={$q}
  on:blur={() => {
    clearQTimtout();
    $qs.setQs({ q: $q });
  }}
  placeholder="Search"
/>

<style>
  .q {
    width: min(100%, 480px);
  }
</style>
