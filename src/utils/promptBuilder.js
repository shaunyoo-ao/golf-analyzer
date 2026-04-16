import {
  SYSTEM_INSTRUCTION_KO,
  SYSTEM_INSTRUCTION_EN,
  EXPECTED_OUTPUT_FORMAT_KO,
  EXPECTED_OUTPUT_FORMAT_EN,
} from './constants';

/**
 * Build the JSON prompt object to be copied into an external AI chat session.
 *
 * @param {object} profile  - Firestore profile document
 * @param {object} round    - Current round data
 * @param {{
 *   includePastRecords?: boolean,
 *   language?: 'ko' | 'en',
 *   allRounds?: object[]
 * }} options
 * @returns {object} - The prompt object (serialize with JSON.stringify)
 */
export function buildPrompt(profile, round, options = {}) {
  const { includePastRecords = false, language = 'ko', allRounds = [] } = options;

  const systemInstruction = language === 'en' ? SYSTEM_INSTRUCTION_EN : SYSTEM_INSTRUCTION_KO;
  const outputFormat = language === 'en' ? EXPECTED_OUTPUT_FORMAT_EN : EXPECTED_OUTPUT_FORMAT_KO;

  const userProfile = {
    name: profile?.name || '',
    age: profile?.age || null,
    gender: profile?.gender || '',
    height_cm: profile?.heightCm || null,
    weight_kg: profile?.weightKg || null,
    handedness: profile?.handedness || '',
    handicap_index: profile?.handicapIndex ?? null,
    club_distances_unit: 'm',
    club_distances: profile?.clubDistances || {},
  };

  const currentRound = {
    date: round?.date || '',
    course_name: round?.courseName || '',
    country: round?.country || '',
    tee_box: round?.teeBox || null,
    total_score: round?.totalScore || null,
    course_rating: round?.courseRating || null,
    slope_rating: round?.slopeRating || null,
    longest_drive_m: round?.longestDriveMeter || null,
    lost_balls: round?.lostBalls || null,
    avg_gir_pct: round?.avgGir || null,
    holes: round?.holes || [],
    club_directions: round?.clubDirections || {},
    swing_form: round?.swingForm || {},
  };

  const prompt = {
    system_instruction: systemInstruction,
    expected_output_format: outputFormat,
    user_profile: userProfile,
    current_round: currentRound,
    user_data: {},
  };

  if (includePastRecords && allRounds.length > 0) {
    prompt.user_data.past_records = allRounds
      .filter((r) => r.id !== round?.id)
      .map((r) => ({
        date: r.date,
        course_name: r.courseName,
        country: r.country,
        total_score: r.totalScore,
        score_differential: r.scoreDifferential != null ? Number(r.scoreDifferential.toFixed(3)) : null,
        longest_drive_m: r.longestDriveMeter ?? null,
        lost_balls: r.lostBalls ?? null,
      }));
  }

  return prompt;
}
