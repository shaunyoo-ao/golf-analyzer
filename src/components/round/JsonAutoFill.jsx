import { useState, useRef } from 'react';
import Button from '../ui/Button';

const JSON_TEMPLATE = JSON.stringify({
  date: "YYYY.MM.DD also supported",
  country: "",
  course_name: "",
  total_score: "",
  tee_box: null,
  course_rating: "Search course/slope rating for this tee_box; if null, use White",
  slope_rating: "Search course/slope rating for this tee_box; if null, use White",
  longest_drive_m: null,
  lost_balls: null,
  avg_gir_pct: "",
  hole_parsing_guide: "Extract hole-by-hole data starting from the Front or Out nine as hole 1.",
  holes: Object.fromEntries(
    Array.from({ length: 18 }, (_, i) => [String(i + 1), { putts: "", score: "" }])
  ),
}, null, 2);

function normalizeDate(raw) {
  if (typeof raw === 'string' && /^\d{4}\.\d{2}\.\d{2}$/.test(raw.trim()))
    return raw.trim().replace(/\./g, '-');
  return raw;
}

export function parseJsonIntoForm(jsonStr) {
  const d = JSON.parse(jsonStr);
  const patch = {};
  if (d.date) patch.date = normalizeDate(d.date);
  if (d.course_name) patch.courseName = d.course_name;
  if (d.country) patch.country = d.country;
  if (d.tee_box != null) patch.teeBox = String(d.tee_box);
  if (d.total_score != null && d.total_score !== '') patch.totalScore = String(d.total_score);
  if (d.course_rating != null && d.course_rating !== '' && !isNaN(Number(d.course_rating))) patch.courseRating = String(d.course_rating);
  if (d.slope_rating != null && d.slope_rating !== '' && !isNaN(Number(d.slope_rating))) patch.slopeRating = String(d.slope_rating);
  if (d.longest_drive_m != null) patch.longestDriveMeter = String(d.longest_drive_m);
  if (typeof d.lost_balls === 'number') patch.lostBalls = String(d.lost_balls);
  if (d.avg_gir_pct != null && d.avg_gir_pct !== '')
    patch.avgGir = String(d.avg_gir_pct).replace(/%$/, '').trim();
  if (d.holes && typeof d.holes === 'object') {
    patch.holes = Object.fromEntries(
      Object.entries(d.holes).map(([k, v]) => [
        k,
        { score: v.score != null ? String(v.score) : '', putts: v.putts != null ? String(v.putts) : '' },
      ])
    );
  }
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
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-golf-200 bg-white text-golf-700 text-sm font-medium py-2.5 min-h-[44px] active:bg-golf-50"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? '✓ Copied!' : 'Copy Import Template'}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-golf-600 uppercase tracking-wide">
          Paste JSON to Auto-fill
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handlePaste}
          placeholder='Paste JSON here…'
          rows={4}
          className="w-full rounded-xl border border-golf-200 bg-white px-3 py-2.5 text-base text-golf-900 placeholder:text-golf-300 focus:outline-none focus:ring-2 focus:ring-golf-500 font-mono text-xs leading-relaxed resize-none"
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
