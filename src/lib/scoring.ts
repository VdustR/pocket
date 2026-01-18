import type { Repo } from "./types";

export interface ScoringWeights {
  stars: number;
  activity: number;
  starredAt: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  stars: 0.4,
  activity: 0.3,
  starredAt: 0.3,
};

/**
 * Calculate days since a given date
 */
export function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate comprehensive score for a repository
 * Using balanced weights: stars 40% + activity 30% + starred time 30%
 */
export function calculateScore(
  repo: Pick<Repo, "stars" | "pushedAt" | "starredAt">,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  // 1. Stars score (log scale to avoid extreme values dominating)
  // log10(1) = 0, log10(10) = 1, log10(100) = 2, log10(10000) = 4, log10(100000) = 5
  const starsScore = Math.min(1, Math.log10(repo.stars + 1) / 5);

  // 2. Activity score (based on last push time, 365-day decay)
  const daysSinceUpdate = daysSince(repo.pushedAt);
  const activityScore = Math.max(0, 1 - daysSinceUpdate / 365);

  // 3. Starred time score (newer stars score higher, 730-day decay)
  const daysSinceStarred = daysSince(repo.starredAt);
  const starredAtScore = Math.max(0, 1 - daysSinceStarred / 730);

  return (
    weights.stars * starsScore +
    weights.activity * activityScore +
    weights.starredAt * starredAtScore
  );
}

/**
 * Calculate activity score for dashboard display
 */
export function calculateActivityScore(
  repo: Pick<Repo, "pushedAt" | "updatedAt" | "openIssues">
): number {
  const daysSincePush = daysSince(repo.pushedAt);
  const daysSinceUpdate = daysSince(repo.updatedAt);

  // Combine push activity and update activity
  const pushScore = Math.max(0, 1 - daysSincePush / 180);
  const updateScore = Math.max(0, 1 - daysSinceUpdate / 90);

  // Bonus for active issues (indicates active community)
  const issueBonus = Math.min(0.2, repo.openIssues * 0.01);

  return pushScore * 0.5 + updateScore * 0.3 + issueBonus;
}
