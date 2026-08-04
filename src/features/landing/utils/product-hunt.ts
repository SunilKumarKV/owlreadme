export function formatVoteCount(votesCount: number): string {
  if (votesCount >= 1000) {
    return `${(votesCount / 1000).toFixed(1)}k`;
  }
  return votesCount.toString();
}
