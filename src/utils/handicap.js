/**
 * WHS (World Handicap System) calculations
 */

/**
 * Compute a single score differential.
 * @param {number} adjustedScore
 * @param {number} courseRating
 * @param {number} slopeRating
 * @returns {number}
 */
export function scoreDifferential(adjustedScore, courseRating, slopeRating) {
  return (adjustedScore - courseRating) * (113 / slopeRating);
}

/**
 * Compute handicap index from an array of round objects.
 * Each round must have a numeric `scoreDifferential` field.
 * Returns null when fewer than 8 qualifying rounds exist.
 *
 * @param {Array<{scoreDifferential: number, date: string}>} rounds
 * @returns {number|null}
 */
export function handicapIndex(rounds) {
  const qualifying = rounds
    .filter((r) => typeof r.scoreDifferential === 'number' && !isNaN(r.scoreDifferential))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  if (qualifying.length < 8) return null;

  const best8 = [...qualifying]
    .sort((a, b) => a.scoreDifferential - b.scoreDifferential)
    .slice(0, 8);

  const avg = best8.reduce((sum, r) => sum + r.scoreDifferential, 0) / 8;
  return Math.round(avg * 0.96 * 10) / 10;
}
