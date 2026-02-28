import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Panel } from "../components/ui/panel";

export default function HomePage() {
  return (
    <main className="page-enter">
      <section className="hero-grid">
        <Panel>
          <span className="muted-chip">Original Media Mode (en-GB) ruleset</span>
          <h1 className="screen-title">Media Timeline Party Game</h1>
          <p className="subtle">
            Place moments in chronological order, challenge risky plays, and race to the finish as a shared-screen
            group.
          </p>
          <div className="hero-actions">
            <Button href="/deck-builder" size="lg">
              Create Deck
            </Button>
            <Button href="/room" variant="secondary" size="lg">
              Start Room
            </Button>
            <Button href="/room" variant="ghost" size="lg">
              Join Room
            </Button>
          </div>
        </Panel>
        <Panel>
          <h2 className="section-title">MVP Highlights</h2>
          <div className="card-stack">
            <Badge tone="success">Server-authoritative resolution</Badge>
            <Badge>Exact date and year-only modes</Badge>
            <Badge>Private-by-default deck access</Badge>
            <Badge tone="warning">Shared-screen first UX</Badge>
          </div>
        </Panel>
      </section>

      <Panel className="card-stack" style={{ marginTop: "var(--space-5)" }}>
        <h2 className="section-title">How a Round Works</h2>
        <div className="info-grid">
          <article>
            <p className="stat-value">1</p>
            <p className="stat-label">Draw and place</p>
            <p className="subtle">Active player places a hidden-date card onto the timeline.</p>
          </article>
          <article>
            <p className="stat-value">2</p>
            <p className="stat-label">Challenge window</p>
            <p className="subtle">Opponents decide whether to challenge before reveal lock closes.</p>
          </article>
          <article>
            <p className="stat-value">3</p>
            <p className="stat-label">Reveal and score</p>
            <p className="subtle">Correct placements keep momentum; steals and misses shift score pace.</p>
          </article>
        </div>
      </Panel>

      <section style={{ marginTop: "var(--space-5)" }}>
        <Panel>
          <h2 className="section-title">MVP Status</h2>
        <p className="subtle">
            Build a timeline from photos, GIFs, and short videos. Challenge friends and steal cards with correct
            chronology.
        </p>
          <ul>
            <li>Server-authoritative game action endpoints</li>
            <li>Deterministic game engine package with tests</li>
            <li>Deck and room API contracts scaffolded</li>
            <li>Supabase schema and RLS migrations included</li>
          </ul>
        </Panel>
      </section>
    </main>
  );
}
