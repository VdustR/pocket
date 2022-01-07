# Pocket

👀 Stay awhile and listen.

<https://vdustr.github.io/pocket>

## Maintain

Requirement:

- node@17.x
- pnpm@6.x

To fetch title and description:

```ts
JSON.stringify({
  title: document
    .querySelector("head title")
    .innerText.replace(/\n/g, " ")
    .trim(),
  description: (
    document.querySelector('head meta[name="description"]') ||
    document.querySelector('head meta[property="og:description"]')
  )
    ?.getAttribute("content")
    .replace(/\n/g, " ")
    .trim(),
});
```

Sort sites:

```ts
JSON.stringify(
  Object.fromEntries(
    Object.entries(sites).sort(([a], [b]) => a.localeCompare(b))
  )
);
```

Update starred repos:

```sh
pnpm github
```

## LICENSE

MIT
