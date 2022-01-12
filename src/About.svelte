<script lang="ts" type="module">
  const credits: Record<string, string> = {
    Svelte: "https://github.com/sveltejs/svelte",
    "Windi CSS": "https://github.com/windicss/windicss",
    Vite: "https://github.com/vitejs/vite",
    Twemoji: "https://github.com/twitter/twemoji",
    "Cedarville Cursive":
      "https://fonts.google.com/specimen/Cedarville+Cursive",
    Kurale: "https://fonts.google.com/specimen/Kurale",
    "Noto Sans Traditional Chinese":
      "https://fonts.google.com/noto/specimen/Noto+Sans+TC",
    "Material Icons": "https://fonts.google.com/icons",
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
  class="flex text-center text-xl px-1 pb-4 gap-2 filter items-end justify-center drop-shadow-md"
>
  {"Copyright © "}
  <a
    class="transition-all ease-in-out text-emerald-200 duration-200 hover:text-emerald-800"
    href="https://vdustr.github.io"
    target="_blank"
    rel="noopener noreferrer"
  >
    {"ViPro"}
  </a>
  <a
    class="transition-all ease-in-out text-emerald-200 duration-200 hover:text-emerald-800"
    href="https://github.com/vdustr/pocket"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg role="img" viewBox="0 0 24 24" width="1.5em" height="1.5em">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  </a>
</footer>

<style>
  section,
  footer {
    --tw-drop-shadow: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.7))
      drop-shadow(0 2px 2px rgba(0, 0, 0, 0.6));
  }
</style>
