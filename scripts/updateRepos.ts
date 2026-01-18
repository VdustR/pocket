import { writeFile, mkdir } from "fs/promises";
import { Octokit } from "@octokit/rest";
import Fuse from "fuse.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { calculateScore } from "../src/lib/scoring";
import type { Repo, RepoStats, LanguageWithCount, TopicWithCount } from "../src/lib/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../public/data");

// Initialize Octokit with optional token for higher rate limits
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const USERNAME = "vdustr";

interface StarredRepoResponse {
  starred_at: string;
  repo: {
    owner: { login: string };
    name: string;
    full_name: string;
    description: string | null;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
    language: string | null;
    topics: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
  };
}

async function fetchStarredRepos(): Promise<Repo[]> {
  console.log(`Fetching starred repos for ${USERNAME}...`);
  const repos: Repo[] = [];

  // Use pagination to fetch all starred repos
  // The star+json media type returns starred_at timestamp
  // @ts-expect-error mediaType is valid at runtime but not in the paginate.iterator type definitions
  for await (const response of octokit.paginate.iterator(
    "GET /users/{username}/starred",
    {
      username: USERNAME,
      per_page: 100,
      mediaType: {
        format: "star+json",
      },
    }
  )) {
    for (const item of response.data as StarredRepoResponse[]) {
      const { repo, starred_at } = item;

      const repoData: Repo = {
        owner: repo.owner.login,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        homepage: repo.homepage || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openIssues: repo.open_issues_count,
        language: repo.language,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        starredAt: starred_at,
        score: 0, // Will be calculated below
      };

      // Calculate comprehensive score
      repoData.score = calculateScore(repoData);

      repos.push(repoData);
    }

    console.log(`Fetched ${repos.length} repos so far...`);
  }

  return repos;
}

function calculateStats(repos: Repo[]): RepoStats {
  const languageDistribution: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.language) {
      languageDistribution[repo.language] =
        (languageDistribution[repo.language] || 0) + 1;
    }
  }

  // Sort by score for top active
  const sortedByScore = [...repos].sort((a, b) => b.score - a.score);

  // Sort by starred time for recently starred
  const sortedByStarred = [...repos].sort(
    (a, b) => new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime()
  );

  return {
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
    languageDistribution,
    topActiveRepos: sortedByScore.slice(0, 10),
    recentlyStarred: sortedByStarred.slice(0, 10),
  };
}

async function main() {
  try {
    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Fetch all starred repos
    const repos = await fetchStarredRepos();

    // Sort by score (descending)
    repos.sort((a, b) => b.score - a.score);

    console.log(`Total repos: ${repos.length}`);

    // Write repos data
    await writeFile(
      resolve(OUTPUT_DIR, "repos.json"),
      JSON.stringify(repos, null, 2)
    );
    console.log("Written repos.json");

    // Create and write Fuse.js search index
    const fuseKeys = [
      { name: "owner", weight: 1 },
      { name: "name", weight: 2 },
      { name: "fullName", weight: 1.5 },
      { name: "description", weight: 1 },
      { name: "homepage", weight: 0.5 },
      { name: "topics", weight: 1.5 },
      { name: "language", weight: 1 },
    ];
    const fuseIndex = Fuse.createIndex(fuseKeys, repos);
    await writeFile(
      resolve(OUTPUT_DIR, "searchIndex.json"),
      JSON.stringify(fuseIndex.toJSON())
    );
    console.log("Written searchIndex.json");

    // Calculate and write stats
    const stats = calculateStats(repos);
    await writeFile(
      resolve(OUTPUT_DIR, "stats.json"),
      JSON.stringify(stats, null, 2)
    );
    console.log("Written stats.json");

    // Use stats.languageDistribution to create sorted LanguageWithCount array
    const languages: LanguageWithCount[] = Object.entries(stats.languageDistribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate topic usage counts and sort by popularity
    const topicCounts: Record<string, number> = {};
    for (const repo of repos) {
      for (const topic of repo.topics) {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      }
    }
    const topics: TopicWithCount[] = Object.entries(topicCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    await writeFile(
      resolve(OUTPUT_DIR, "filters.json"),
      JSON.stringify({ languages, topics }, null, 2)
    );
    console.log("Written filters.json");

    console.log("\n✅ Update complete!");
    console.log(`   - ${repos.length} repositories`);
    console.log(`   - ${languages.length} languages`);
    console.log(`   - ${topics.length} topics`);
  } catch (error) {
    console.error("Error updating repos:", error);
    process.exit(1);
  }
}

main();
