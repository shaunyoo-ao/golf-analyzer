// ─── Club lists ─────────────────────────────────────────────────────────────
export const WOODS = ['3 Wood', '5 Wood'];
export const HYBRIDS = ['2 Hybrid', '3 Hybrid', '4 Hybrid'];
export const IRONS = ['3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron'];
export const WEDGES = [
  { key: 'pw', label: 'PW (Pitching Wedge)' },
  { key: 'gw', label: 'GW (Gap Wedge)' },
  { key: 'sw', label: 'SW (Sand Wedge)' },
  { key: 'lw', label: 'LW (Lob Wedge)' },
];

export const ALL_CLUBS = [
  ...WOODS,
  ...HYBRIDS,
  ...IRONS,
  ...WEDGES.map((w) => w.label),
];

// 5-category club direction groups (used in ClubDirectionPanel)
export const DIRECTION_CLUB_GROUPS = [
  { key: 'driver',      label: 'Driver' },
  { key: 'woodHybrid',  label: 'Wood / Hybrid' },
  { key: 'longIron',    label: 'Long Iron (3–5)' },
  { key: 'middleIron',  label: 'Middle Iron (6–9)' },
  { key: 'wedge',       label: 'Wedge (P–S)' },
];

// ─── Swing stage marker configuration ───────────────────────────────────────
// x/y are percentages relative to the image container (left/top)
export const SWING_STAGES = ['address', 'backswing', 'impact', 'finish'];

export const SWING_STAGE_LABELS = {
  address: 'Address',
  backswing: 'Backswing',
  impact: 'Impact',
  finish: 'Finish',
};

export const SWING_MARKERS = [
  { key: 'head',      label: 'Head' },
  { key: 'leftArm',  label: 'L. Arm' },
  { key: 'rightArm', label: 'R. Arm' },
  { key: 'waist',    label: 'Waist' },
  { key: 'leftKnee', label: 'L. Knee' },
  { key: 'rightKnee',label: 'R. Knee' },
];

// Marker positions (percentage of image width/height) per stage
export const MARKER_POSITIONS = {
  address: {
    head:      { x: 50, y: 12 },
    leftArm:   { x: 36, y: 33 },
    rightArm:  { x: 64, y: 33 },
    waist:     { x: 50, y: 48 },
    leftKnee:  { x: 40, y: 66 },
    rightKnee: { x: 60, y: 66 },
  },
  backswing: {
    head:      { x: 46, y: 10 },
    leftArm:   { x: 26, y: 24 },
    rightArm:  { x: 66, y: 24 },
    waist:     { x: 52, y: 44 },
    leftKnee:  { x: 42, y: 64 },
    rightKnee: { x: 60, y: 64 },
  },
  impact: {
    head:      { x: 50, y: 11 },
    leftArm:   { x: 38, y: 30 },
    rightArm:  { x: 62, y: 28 },
    waist:     { x: 50, y: 46 },
    leftKnee:  { x: 40, y: 64 },
    rightKnee: { x: 60, y: 64 },
  },
  finish: {
    head:      { x: 44, y: 8 },
    leftArm:   { x: 34, y: 20 },
    rightArm:  { x: 60, y: 20 },
    waist:     { x: 50, y: 42 },
    leftKnee:  { x: 42, y: 62 },
    rightKnee: { x: 58, y: 62 },
  },
};

// ─── Countries ───────────────────────────────────────────────────────────────
export const COUNTRIES = [
  'South Korea', 'South Africa', 'United States', 'Japan', 'Australia', 'United Kingdom',
  'Canada', 'Germany', 'France', 'Spain', 'Thailand', 'Singapore',
  'China', 'Taiwan', 'Philippines', 'Indonesia', 'Vietnam', 'Malaysia',
  'New Zealand', 'Ireland', 'Sweden', 'Other',
];

// ─── AI System Instructions ──────────────────────────────────────────────────
export const SYSTEM_INSTRUCTION_KO = `Analyze the provided golf data. If previous round data exists in this chat session's history, synthesize the new data with the past records to provide comprehensive, cumulative feedback tracking the user's progress or recurring issues. Output MUST be a single JSON object. JSON keys MUST be in English. JSON values MUST be written in Korean.

CRITICAL RULES:
1. Return ONLY a raw JSON object — no markdown fences, no explanation text, no preamble.
2. Every key listed in expected_output_format MUST be present in your response.
3. If you cannot provide meaningful content for a field, use an empty string "" or empty array [].
4. "highlighted_markers" should reference specific swing form markers from the data when available.
5. "club_practice_plan" must be specific to the clubs showing directional issues.
6. All Korean text must be natural, conversational, and actionable.
7. 제공된 국가의 일반적인 골프 코스 난이도, 홀별 파 구성, 코스 레이아웃 특성을 참고하여 분석에 활용하라.
8. "analyzed_by" must be filled with your AI model name, version, and type (e.g. "Gemini 2.5 Pro", "GPT-4o", "Claude Opus 4").`;

export const SYSTEM_INSTRUCTION_EN = `Analyze the provided golf data. If previous round data exists in this chat session's history, synthesize the new data with the past records to provide comprehensive, cumulative feedback tracking the user's progress or recurring issues. Output MUST be a single JSON object. JSON keys MUST be in English. JSON values MUST be written in English.

CRITICAL RULES:
1. Return ONLY a raw JSON object — no markdown fences, no explanation text, no preamble.
2. Every key listed in expected_output_format MUST be present in your response.
3. If you cannot provide meaningful content for a field, use an empty string "" or empty array [].
4. "highlighted_markers" should reference specific swing form markers from the data when available.
5. "club_practice_plan" must be specific to the clubs showing directional issues.
6. All text must be natural, conversational, and actionable.
7. Reference the typical course difficulty, hole par distribution, and layout characteristics of golf courses in the provided country when relevant to your analysis.
8. "analyzed_by" must be filled with your AI model name, version, and type (e.g. "Gemini 2.5 Pro", "GPT-4o", "Claude Opus 4").`;

export const EXPECTED_OUTPUT_FORMAT_KO = {
  overall_assessment: '<전반적인 라운드 평가 (문자열)>',
  strengths: ['<잘한 점 1>', '<잘한 점 2>'],
  weaknesses: ['<개선할 점 1>', '<개선할 점 2>'],
  course_management: '<코스 매니지먼트 조언 (문자열 또는 "")>',
  club_practice_plan: '<클럽별 연습 계획 (문자열 또는 "")>',
  next_round_checkpoints: ['<다음 라운드 체크포인트 1>'],
  highlighted_markers: [],
  analyzed_by: '<AI 모델명, 버전, 종류 — 예: Gemini 2.5 Pro>',
};

export const EXPECTED_OUTPUT_FORMAT_EN = {
  overall_assessment: '<Overall round assessment (string)>',
  strengths: ['<Strength 1>', '<Strength 2>'],
  weaknesses: ['<Area to improve 1>', '<Area to improve 2>'],
  course_management: '<Course management advice (string or "")>',
  club_practice_plan: '<Club-specific practice plan (string or "")>',
  next_round_checkpoints: ['<Next round checkpoint 1>'],
  highlighted_markers: [],
  analyzed_by: '<AI model name, version, type — e.g. Gemini 2.5 Pro>',
};
