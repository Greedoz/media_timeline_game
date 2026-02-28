import { Badge } from "./badge";

interface TimelineCardProps {
  title: string;
  mediaType: "Photo" | "GIF" | "Video";
  guess: string;
  actual: string;
  outcome: "correct" | "incorrect" | "steal";
}

const outcomeCopy = {
  correct: { label: "Correct", tone: "success" as const },
  incorrect: { label: "Incorrect", tone: "danger" as const },
  steal: { label: "Steal", tone: "warning" as const }
};

export function TimelineCard({ title, mediaType, guess, actual, outcome }: TimelineCardProps) {
  return (
    <article className={`timeline-card outcome-${outcome} outcome-reveal`}>
      <div className="timeline-topline">
        <Badge>{mediaType}</Badge>
        <Badge tone={outcomeCopy[outcome].tone}>{outcomeCopy[outcome].label}</Badge>
      </div>
      <h3>{title}</h3>
      <div className="timeline-meta">
        <p>
          <span className="subtle">Placed:</span> {guess}
        </p>
        <p>
          <span className="subtle">Actual:</span> {actual}
        </p>
      </div>
    </article>
  );
}
