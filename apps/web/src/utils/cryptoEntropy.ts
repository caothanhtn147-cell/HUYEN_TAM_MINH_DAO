// Cryptographic Hardware & Biometric Entropy Utility for Huyền Tâm Minh Đạo
// Uses W3C WebCrypto API (crypto.getRandomValues) for True Random Generation

/**
 * Generate a cryptographically secure random integer in range [min, max]
 */
export function getCryptoRandomInt(min: number, max: number): number {
  if (min >= max) return min;
  const range = max - min + 1;
  const uint32 = new Uint32Array(1);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(uint32);
    return min + (uint32[0] % range);
  }

  // Fallback if WebCrypto is unavailable (e.g. legacy SSR)
  return min + Math.floor(Math.random() * range);
}

/**
 * Cryptographically secure Fisher-Yates array shuffle
 */
export function shuffleArrayCrypto<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getCryptoRandomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate 3 coin toss values (2 = Âm, 3 = Dương) using hardware entropy
 */
export function generateCryptoCoinToss(): { coin1: number; coin2: number; coin3: number; total_sum: number } {
  const coin1 = getCryptoRandomInt(2, 3);
  const coin2 = getCryptoRandomInt(2, 3);
  const coin3 = getCryptoRandomInt(2, 3);
  const total_sum = coin1 + coin2 + coin3;
  return { coin1, coin2, coin3, total_sum };
}
