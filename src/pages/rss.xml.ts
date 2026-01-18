import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import type { Repo } from "../lib/types";

export async function GET(context: APIContext) {
  // In production, this would be imported from the data file
  // For build time, we read the JSON file
  let repos: Repo[] = [];

  try {
    const response = await fetch(
      new URL("/pocket/data/repos.json", context.site)
    );
    if (response.ok) {
      repos = await response.json();
    }
  } catch {
    // Fallback: try to import the file directly during build
    try {
      const data = await import("../data/repos.json");
      repos = data.default as Repo[];
    } catch {
      console.warn("Could not load repos data for RSS feed");
    }
  }

  // Sort by starred date (most recent first)
  const sortedRepos = [...repos]
    .sort(
      (a, b) =>
        new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime()
    )
    .slice(0, 50); // Only include 50 most recent

  return rss({
    title: "ViPro's Pocket",
    description: "It's dangerous to go alone! Take this. Curated GitHub stars for your coding adventure.",
    site: context.site || "https://vdustr.dev",
    items: sortedRepos.map((repo) => ({
      title: repo.fullName,
      pubDate: new Date(repo.starredAt),
      description: repo.description || "No description",
      link: `https://github.com/${repo.fullName}`,
      categories: [repo.language, ...repo.topics].filter(Boolean) as string[],
      customData: `
        <stars>${repo.stars}</stars>
        <forks>${repo.forks}</forks>
        <language>${repo.language || "Unknown"}</language>
      `,
    })),
    customData: `<language>en-us</language>`,
  });
}
