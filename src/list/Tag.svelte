<script lang="ts">
  import qs from "@/qs";
  export let tag: string;
  $: active = $qs.qs.tags.includes(tag);
</script>

<li
  class="border border-white rounded-xl cursor-pointer flex text-xs px-1 block items-center justify-items-start hover:border-emerald-200 hover:text-emerald-200 focus:border-emerald-200 focus:text-emerald-200"
  role="button"
  class:bg-emerald-800={active}
  tabindex={0}
  on:click={(e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    $qs.setQs({
      tags: $qs.qs.tags.includes(tag)
        ? $qs.qs.tags.filter((target) => target !== tag)
        : [...$qs.qs.tags, tag].sort((a, b) => a.localeCompare(b)),
    });
  }}
>
  {tag}
</li>
