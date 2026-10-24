import { useState, useRef } from 'react';
import Button from '../ui/Button';

const JSON_TEMPLATE = JSON.stringify({
  date: "YYYY-MM-DD (YYYY.MM.DD also supported)",
  country: "Use English name, e.g. South Korea",
  course_name: "",
  total_score: "",
  tee_box: null,
  course_rating: "Search course/slope rating for this tee_box; if null, use White",
  slope_rating: "Search course/slope rating for this tee_box; if null, use White",
  longest_drive_m: null,
  lost_balls: null,
  avg_gir_pct: "",
  score_format: "absolute | relative_to_par",
  parsing_guide: [
    "Hole 1-9 = the first nine played (Front/OUT, or the first sub-course such as 동코스/A코스); hole 10-18 = the second nine (Back/IN).",
    "par: read the PAR (파) row of the scorecard for each hole (3, 4, 5). Leave \"\" if not shown.",
    "If scores are written relative to par (0 = par, 1 = bogey, -1 = birdie, common on Korean scorecards), set score_format to relative_to_par and copy the numbers as-is.",
    "If a cell shows score/putts together (e.g. 5/2), split into score and putts.",
    "Return JSON only, keeping this structure."
  ],
  holes: Object.fromEntries(
    Array.from({ length: 18 }, (_, i) => [String(i + 1), { par: "", score: "", putts: "" }])
  ),
}, null, 2);

function normalizeDate(raw) {
  if (typeof raw === 'string' && /^\d{4}\.\d{1,2}\.\d{1,2}\.?$/.test(raw.trim())) {
    const [y, m, d] = raw.trim().replace(/\.$/, '').split('.');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return raw;
}

const toNum = (v) => {
  if (v == null || v === '') return null;
  const n = Number(String(v).trim().replace(/^\+/, ''));
  return Number.isFinite(n) ? n : null;
};

export function parseJsonIntoForm(jsonStr) {
  const d = JSON.parse(jsonStr);
  const patch = {};
  if (d.date) patch.date = normalizeDate(d.date);
  if (d.course_name) patch.courseName = d.course_name;
  if (d.country) patch.country = d.country;
  if (d.tee_box != null) patch.teeBox = String(d.tee_box);
  if (d.course_rating != null && d.course_rating !== '' && !isNaN(Number(d.course_rating))) patch.courseRating = String(d.course_rating);
  if (d.slope_rating != null && d.slope_rating !== '' && !isNaN(Number(d.slope_rating))) patch.slopeRating = String(d.slope_rating);
  if (d.longest_drive_m != null) patch.longestDriveMeter = String(d.longest_drive_m);
  if (typeof d.lost_balls === 'number') patch.lostBalls = String(d.lost_balls);
  if (d.avg_gir_pct != null && d.avg_gir_pct !== '')
    patch.avgGir = String(d.avg_gir_pct).replace(/%$/, '').trim();

  let holeSum = 0;
  let holeCount = 0;
  let parSum = 0;
  let parCount = 0;
  if (d.holes && typeof d.holes === 'object') {
    // Accept both { "1": {...} } and [ {...}, ... ]
    const entries = Array.isArray(d.holes)
      ? d.holes.map((v, i) => [String(v?.hole ?? i + 1), v])
      : Object.entries(d.holes);
    const relative = d.score_format === 'relative_to_par';
    patch.holes = Object.fromEntries(
      entries.map(([k, v = {}]) => {
        const par = toNum(v.par);
        let score = toNum(v.score);
        // Relative score (0 = par, +1 = bogey) → absolute strokes, only when par is known
        if (score != null && par != null && (relative || /^[+-]/.test(String(v.score).trim()))) score = par + score;
        if (score != null) { holeSum += score; holeCount += 1; }
        if (par != null) { parSum += par; parCount += 1; }
        return [k, {
          par: par != null ? String(par) : '',
          score: score != null ? String(score) : '',
          putts: toNum(v.putts) != null ? String(toNum(v.putts)) : '',
        }];
      })
    );
  }

  const total = toNum(d.total_score);
  const relativeTotal = total != null
    && (/^[+-]/.test(String(d.total_score).trim()) || (d.score_format === 'relative_to_par' && total < 50));
  if (total != null && !relativeTotal) patch.totalScore = String(total);
  else if (holeCount === 18) patch.totalScore = String(holeSum);
  else if (relativeTotal && parCount === 18) patch.totalScore = String(parSum + total);
  return patch;
}

export default function JsonAutoFill({ onApply }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null); // null | 'ok' | 'err'
  const [errMsg, setErrMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef();

  const handleCopyTemplate = async () => {
    await navigator.clipboard.writeText(JSON_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tryApply = (str) => {
    try {
      const patch = parseJsonIntoForm(str);
      onApply(patch);
      setStatus('ok');
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus('err');
      setErrMsg('JSON 형식 오류. 템플릿을 복사하여 다시 시도하세요.');
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    setText(pasted);
    setTimeout(() => tryApply(pasted), 0);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyTemplate}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-2.5 min-h-[44px] btn-glass"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? '✓ Copied!' : 'Copy Import Template'}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-green)' }}>
          Paste JSON to Auto-fill
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handlePaste}
          placeholder='Paste JSON here…'
          rows={4}
          className="glass-input font-mono text-xs leading-relaxed resize-none"
        />
        {status === 'ok' && (
          <p className="text-xs text-green-600 font-medium">✓ Auto-fill applied successfully</p>
        )}
        {status === 'err' && (
          <p className="text-xs text-red-500">{errMsg}</p>
        )}
      </div>
      {text.trim() && status !== 'ok' && (
        <Button fullWidth variant="secondary" onClick={() => tryApply(text)}>
          Apply JSON
        </Button>
      )}
    </div>
  );
}
