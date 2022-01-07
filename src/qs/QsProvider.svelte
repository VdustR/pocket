<script lang="ts">
  import { setContext } from "svelte";
  import store from "./store";
  setContext("qs", store);
</script>

<slot />
