import Card from '../ui/Card';

function Section({ title, children }) {
  return (
    <Card>
      <h3 className="font-bold text-golf-800 text-sm mb-2">{title}</h3>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </Card>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-golf-500 mt-0.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function FeedbackSections({ parsed }) {
  if (!parsed) return null;

  const {
    overall_assessment,
    strengths,
    weaknesses,
    course_management,
    club_practice_plan,
    next_round_checkpoints,
    highlighted_markers,
    analyzed_by,
  } = parsed;

  return (
    <div className="flex flex-col gap-3">
      {overall_assessment && (
        <Section title="Overall Assessment">
          <p>{overall_assessment}</p>
        </Section>
      )}

      {strengths?.length > 0 && (
        <Section title="Strengths">
          <BulletList items={strengths} />
        </Section>
      )}

      {weaknesses?.length > 0 && (
        <Section title="Areas to Improve">
          <BulletList items={weaknesses} />
        </Section>
      )}

      {course_management && (
        <Section title="Course Management">
          <p>{course_management || 'No data provided'}</p>
        </Section>
      )}

      {club_practice_plan && (
        <Section title="Practice Plan">
          <p>{club_practice_plan || 'No data provided'}</p>
        </Section>
      )}

      {next_round_checkpoints?.length > 0 && (
        <Section title="Next Round Checkpoints">
          <BulletList items={next_round_checkpoints} />
        </Section>
      )}

      {highlighted_markers?.length > 0 && (
        <Section title="Swing Markers">
          <BulletList items={highlighted_markers} />
        </Section>
      )}

      {analyzed_by && (
        <p className="text-[10px] text-golf-400 text-right pt-1">
          Analysis by {analyzed_by}
        </p>
      )}
    </div>
  );
}
