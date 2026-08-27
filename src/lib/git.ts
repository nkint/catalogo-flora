import { execSync } from 'child_process';

/**
 * Get git commit information at build time
 */
export function getGitInfo(): { date: string; dateTime: string; sha: string } {
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
    }).trim();
    const timestamp = execSync('git log -1 --format=%ci', {
      encoding: 'utf-8',
    }).trim();

    // Parse and format date in Italian format
    const commitDate = new Date(timestamp);

    const date = commitDate.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const dateTime = commitDate.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return { date, dateTime, sha };
  } catch {
    return { date: 'N/A', dateTime: 'N/A', sha: 'N/A' };
  }
}
