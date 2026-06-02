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
    role={ariaHidden ? undefined : "img"}
    aria-label={ariaHidden ? undefined : `Language: ${language}`}
    aria-hidden={ariaHidden ? "true" : undefined}
  >
    {#if icon}
      <Icon icon={icon} class="h-full w-full" />
    {:else}
      <span
        class="rounded-full {dotClass}"
        style="background-color: {getLanguageColor(language) || '#8b949e'}"
      ></span>
    {/if}
  </span>
{/if}
