<script lang="ts">
  import About from "./About.svelte";
  import Background from "./Background.svelte";
  import Filter from "./filter/Filter.svelte";
  import List from "./list/List.svelte";
  import Title from "./Title.svelte";
</script>

<Background />
<main class="flex flex-col mx-auto flex-1 mt-16 max-w-7xl z-0 gap-6">
  <Title />
  <Filter />
  <List />
  <About />
</main>
