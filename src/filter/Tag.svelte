<script lang="ts">
  import qs from "@/qs";
  import type { Tag } from "@/tags";
  export let tag: Tag;
  $: active = $qs.qs.tags.includes(tag.tag);
  const toggle = () => {
    $qs.setQs({
      tags: $qs.qs.tags.includes(tag.tag)
        ? $qs.qs.tags.filter((target) => target !== tag.tag)
        : [...$qs.qs.tags, tag.tag].sort((a, b) => a.localeCompare(b)),
    });
  };
</script>

<li
  class="border border-white rounded-xl cursor-pointer flex bg-opacity-70 px-2 items-center justify-start block hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  role="button"
  class:bg-black={!active}
  class:bg-emerald-800={active}
  tabindex={0}
  on:click={toggle}
>
  {tag.tag}
</li>
