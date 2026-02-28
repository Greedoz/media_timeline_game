import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Panel } from "../../../components/ui/panel";
import { TimelineCard } from "../../../components/ui/timeline-card";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="page-enter">
      <Panel>
        <div className="hero-actions" style={{ justifyContent: "space-between" }}>
          <span className="muted-chip">Game #{id}</span>
          <Badge tone="warning">Challenge window: 00:09</Badge>
        </div>
        <h1 className="screen-title">Gameplay</h1>
        <p className="subtle">
          Use action endpoints under `POST /api/games/{id}/actions/*` for place/challenge/skip/buy/recognition/reveal.
        </p>
      </Panel>

      <section className="game-grid" style={{ marginTop: "var(--space-5)" }}>
        <Panel className="turn-pulse">
          <h2 className="section-title">Turn State</h2>
          <div className="hud-list">
            <div className="player-row">
              <span>Active player</span>
              <strong>Tim</strong>
            </div>
            <div className="player-row">
              <span>Tokens</span>
              <Badge>Challenge x2</Badge>
            </div>
            <div className="player-row">
              <span>Recognition</span>
              <Badge tone="success">Ready</Badge>
            </div>
            <div className="player-row">
              <span>Mode</span>
              <Badge>Exact date</Badge>
            </div>
          </div>
        </Panel>

        <div className="card-stack">
          <TimelineCard
            title="Festival Crowd at Sunset"
            mediaType="Photo"
            guess="June 2018"
            actual="May 2019"
            outcome="incorrect"
          />
          <Panel>
            <h2 className="section-title">Current Card</h2>
            <p style={{ marginTop: 0, fontSize: "var(--text-xl)", fontFamily: "var(--font-display), Trebuchet MS, sans-serif" }}>
              VHS Camcorder Reveal Clip
            </p>
            <p className="subtle">Place between 2015 and 2018, then lock your position before the challenge timer ends.</p>
            <div className="hero-actions">
              <Button>Place Card</Button>
              <Button variant="danger">Challenge</Button>
              <Button variant="ghost">Skip</Button>
            </div>
          </Panel>
        </div>

        <Panel>
          <h2 className="section-title">Score Race</h2>
          <div className="hud-list">
            <div className="player-row">
              <span>Tim</span>
              <strong>7</strong>
            </div>
            <div className="player-row">
              <span>Alex</span>
              <strong>6</strong>
            </div>
            <div className="player-row">
              <span>Jordan</span>
              <strong>5</strong>
            </div>
            <div className="player-row">
              <span>Mina</span>
              <strong>4</strong>
            </div>
          </div>
          <p className="subtle" style={{ marginBottom: 0 }}>
            First to 10 points wins.
          </p>
        </Panel>
      </section>
    </main>
  );
}
