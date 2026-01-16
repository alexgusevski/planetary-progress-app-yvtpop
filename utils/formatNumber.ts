
// Format large numbers with K, M, B, T suffixes
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(1);
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num < 1000000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else {
    return (num / 1000000000000).toFixed(1) + 'T';
  }
}

// Format numbers for display with commas
export function formatNumberWithCommas(num: number): string {
  return Math.floor(num).toLocaleString();
}
