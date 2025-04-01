/**
 * Normalize song titles for comparison:
 * - Lowercase
 * - Remove punctuation
 * - Remove (Remastered), [Live], feat., etc.
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // Remove (Remastered), etc.
    .replace(/\[.*?\]/g, '') // Remove [Live], etc.
    .replace(/feat\..*/g, '') // Remove feat. ...
    .replace(/\bthe\b/g, '') // Remove 'the' as a word
    .replace(/[^a-z0-9 ]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Levenshtein Distance: measures how many single-character edits
 * (insertions, deletions, substitutions) to change one string to another
 */
function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[a.length][b.length];
}

/**
 * Check if user's guess matches the actual song title.
 * Allows for small typos and ignores irrelevant metadata.
 */
export function isCorrectGuess(actualTitle: string, userGuess: string): boolean {
  const normalizedActual = normalizeTitle(actualTitle);
  const normalizedGuess = normalizeTitle(userGuess);

  const distance = levenshtein(normalizedActual, normalizedGuess);

  const typoTolerance = Math.max(2, Math.floor(normalizedActual.length * 0.2));

  return distance <= typoTolerance;
}
