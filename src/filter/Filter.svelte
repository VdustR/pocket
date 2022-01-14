<script lang="ts">
  import qs from "@/qs";
  import ClearAllTags from "./ClearAllTags.svelte";
  import Q, { q } from "./Q.svelte";
  import Shuffle from "./Shuffle.svelte";
  import Tags from "./Tags.svelte";

  $: showShuffle = $qs.qs.tags.length === 0 && $q.trim().length === 0;
  $: showClearAllTags = $qs.qs.tags.length > 0;
</script>

<section class="flex flex-col p-4 gap-4 items-center">
  <Q />
  {#if showShuffle || showClearAllTags}
    <div class="flex gap-3 items-stretch">
      {#if showShuffle}
        <Shuffle />
      {/if}
      {#if showClearAllTags}
        <ClearAllTags />
      {/if}
    </div>
  {/if}
  <Tags />
</section>
