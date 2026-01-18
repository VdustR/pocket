# Pocket

> 🗡️ It's dangerous to go alone! Take this.

A curated collection of my GitHub starred repositories — searchable, filterable, and beautifully organized.

**[Live Demo →](https://vdustr.dev/pocket)**

## Features

- **Full-text search** — Find repos by name, description, topics, or language
- **Smart sorting** — By score, stars, starred date, last updated, or name
- **Multiple views** — Card, list, or compact layout
- **Dashboard** — Stats, language distribution chart, top repos
- **Dark mode** — System-aware theme switching
- **Keyboard shortcuts** — Navigate like a pro
- **RSS feed** — Subscribe to new stars

## Tech Stack

- [Astro](https://astro.build) + [Svelte 5](https://svelte.dev) + [Tailwind CSS 4](https://tailwindcss.com)
- [Fuse.js](https://fusejs.io) for fuzzy search
- [Chart.js](https://www.chartjs.org) for visualizations

## Development

Requirements:

- Node.js >= 22
- pnpm >= 9

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Update starred repos data
pnpm updateRepos

# Build for production
pnpm build
```

## License

[MIT](https://github.com/VdustR/pocket/blob/main/LICENSE)
