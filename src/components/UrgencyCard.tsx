import type { UrgencyResult } from '../data/preparation';

interface UrgencyCardProps {
  urgency: UrgencyResult;
}

export default function UrgencyCard({ urgency }: UrgencyCardProps) {
  return (
    <section className={`panel urgency-card urgency-${urgency.level}`} aria-labelledby="urgency-heading">
      <div className="urgency-top">
        <div className="traffic-light" aria-hidden="true">
          <span className={urgency.level === 'red' ? 'active' : undefined} />
          <span className={urgency.level === 'yellow' ? 'active' : undefined} />
          <span className={urgency.level === 'green' ? 'active' : undefined} />
        </div>
        <div>
          <p className="eyebrow">Dringlichkeit: {urgency.label}</p>
          <h3 id="urgency-heading">{urgency.headline}</h3>
        </div>
      </div>
      <p>{urgency.summary}</p>
      <ul>
        {urgency.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </section>
  );
}
