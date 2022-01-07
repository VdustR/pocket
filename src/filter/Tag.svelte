<script lang="ts">
  import useQs from "@/qs/useQs";
  import type { Tag } from "@/tags";
  const qs = useQs();
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
  class="block px-2 cursor-pointer border rounded-xl border-white bg-opacity-70 hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  role="button"
  class:bg-black={!active}
  class:bg-emerald-800={active}
  tabindex={0}
  on:click={toggle}
>
  {tag.tag}
</li>
