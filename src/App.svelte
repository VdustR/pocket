<script lang="ts">
  import About from "./About.svelte";
  import Background from "./Background.svelte";
  import Filter from "./filter/Filter.svelte";
  import List from "./list/List.svelte";
  import QsProvider from "./qs/QsProvider.svelte";
  import Title from "./Title.svelte";
</script>

<Background />
<QsProvider>
  <main class="flex-1 flex flex-col mt-16 max-w-7xl mx-auto gap-6 z-0">
    <Title />
    <Filter />
    <List />
    <About />
  </main>
</QsProvider>
