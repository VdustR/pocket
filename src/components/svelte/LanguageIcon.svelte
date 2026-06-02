<script lang="ts">
  import Icon from "@iconify/svelte";
  import { getLanguageColor } from "../../lib/colors";
  import { getLanguageIcon } from "../../lib/languageIcons";

  interface Props {
    language: string | null;
    class?: string;
    dotClass?: string;
    ariaHidden?: boolean;
  }

  let {
    language,
    class: className = "h-4 w-4",
    dotClass = "h-2 w-2",
    ariaHidden = true,
  }: Props = $props();

  let icon = $derived(getLanguageIcon(language));
</script>

{#if language}
  <span
    class="inline-flex shrink-0 items-center justify-center {className}"
    title={language}
    aria-label={ariaHidden ? undefined : language}
    aria-hidden={ariaHidden}
  >
    {#if icon}
      <Icon icon={icon} class="h-full w-full" />
    {:else}
      <span
        class="rounded-full {dotClass}"
        style="background-color: {getLanguageColor(language)}"
      ></span>
    {/if}
  </span>
{/if}
