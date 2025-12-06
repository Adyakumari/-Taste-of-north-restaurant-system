export function formatCurrencyINR(cents: number) {
  return `₹${(cents / 100).toFixed(2)}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


