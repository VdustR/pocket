<script lang="ts" type="module">
  import LogoGithub from "./icon/carbon/LogoGithub.svelte";

  const credits: Record<string, string> = {
    "Cedarville Cursive":
      "https://fonts.google.com/specimen/Cedarville+Cursive",
    "Corbon Design Icons":
      "https://www.carbondesignsystem.com/guidelines/icons/library/",
    Kurale: "https://fonts.google.com/specimen/Kurale",
    "Noto Sans Traditional Chinese":
      "https://fonts.google.com/noto/specimen/Noto+Sans+TC",
    "Phosphor Icons": "https://phosphoricons.com/",
    Svelte: "https://github.com/sveltejs/svelte",
    Twemoji: "https://github.com/twitter/twemoji",
    Vite: "https://github.com/vitejs/vite",
    "Windi CSS": "https://github.com/windicss/windicss",
  };
</script>

<section
  class="flex flex-col text-center px-2 gap-2 filter justify-center items-center"
>
  <h3 class="text-2xl">Credits</h3>
  <div>Big thanks to:</div>
  <div class="flex flex-wrap max-w-2xl gap-4 justify-center items-center">
    <ul class="flex flex-wrap gap-4 justify-center items-center">
      {#each Object.entries(credits) as [name, url]}
        <li
          class="leading-none transform transition-colors ease-in-out text-emerald-200 hover:text-emerald-800"
        >
          <a target="_blank" rel="noopener noreferrer" href={url}>
            {name}
          </a>
        </li>
      {/each}
    </ul>
    <div>
      {"and "}
      <a
        class="leading-none transform transition-colors ease-in-out text-emerald-200 inline-block hover:text-emerald-800"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/VdustR/pocket/blob/main/package.json"
      >
        {"more"}
      </a>
      {"..."}
    </div>
  </div>
</section>

<footer
  class="flex text-center text-xl px-1 pb-4 gap-2 filter items-center justify-center drop-shadow-md"
>
  {"Copyright © "}
  <a
    class="transition-all ease-in-out text-emerald-200 duration-200 hover:text-emerald-800"
    href="https://vdustr.dev"
    target="_blank"
    rel="noopener noreferrer"
  >
    {"ViPro"}
  </a>
  <a
    class="transition-all ease-in-out text-emerald-200 text-size-2em duration-200 hover:text-emerald-800"
    href="https://github.com/vdustr/pocket"
    target="_blank"
    rel="noopener noreferrer"
  >
    <LogoGithub />
  </a>
</footer>

<style>
  section,
  footer {
    --tw-drop-shadow: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.7))
      drop-shadow(0 2px 2px rgba(0, 0, 0, 0.6));
  }
</style>
