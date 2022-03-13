<script lang="ts">
  import Shuffle from "@/icon/phosphor/Shuffle.svelte";
  import { shuffleRepos } from "@/shuffledRepos";
</script>

<button
  class="bg-black border border-white rounded-xl cursor-pointer flex bg-opacity-70 pr-1 pl-2 gap-0.5 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  on:click={shuffleRepos}
>
  {"Shuffle"}
  <span class="text-size-1.5em">
    <Shuffle />
  </span>
</button>
