<script lang="ts">
  import useQs from "@/qs/useQs";
  import { writable } from "svelte/store";

  let value = writable("");
  const qs = useQs();
  let updateQTimeout: ReturnType<typeof setTimeout> | null = null;
  function clearQTimtout() {
    if (updateQTimeout) {
      clearTimeout(updateQTimeout);
      updateQTimeout = null;
    }
  }
  value.subscribe(() => {
    clearQTimtout();
    updateQTimeout = setTimeout(() => {
      $qs.setQs({ q: $value });
      updateQTimeout = null;
    }, 300);
  });
  qs.subscribe(() => {
    clearQTimtout();
    $value = $qs.qs.q;
  });
</script>

<input
  type="search"
  class="bg-black border-solid border rounded-xl bg-opacity-70 py-1 px-2 placeholder-cool-gray-300 text-2xl q focus:border-emerald-200 focus:placeholder-transparent focus:text-emerald-200"
  bind:value={$value}
  on:blur={() => {
    clearQTimtout();
    $qs.setQs({ q: $value });
  }}
  placeholder="Search"
/>

<style>
  .q {
    width: min(100%, 480px);
  }
</style>
