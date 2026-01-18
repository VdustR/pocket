export interface Repo {
  // Basic info
  owner: string;
  name: string;
  fullName: string;
  description: string;
  homepage: string;

  // Statistics
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;

  // Classification
  language: string | null;
  topics: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  starredAt: string;

  // Computed fields
  score: number;
}

export interface RepoStats {
  totalRepos: number;
  totalStars: number;
  languageDistribution: Record<string, number>;
  topActiveRepos: Repo[];
  recentlyStarred: Repo[];
}

export type Theme = "light" | "dark" | "system";

export type LayoutMode = "card" | "list" | "compact";

export type SortField = "score" | "stars" | "starredAt" | "updatedAt" | "name";

export type SortOrder = "asc" | "desc";

export interface FilterState {
  query: string;
  languages: string[];
  topics: string[];
  sortField: SortField;
  sortOrder: SortOrder;
}
