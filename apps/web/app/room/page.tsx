import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Panel } from "../../components/ui/panel";

export default function RoomPage() {
  return (
    <main className="page-enter">
      <Panel>
        <span className="muted-chip">Room lobby</span>
        <h1 className="screen-title">Room Lobby</h1>
        <p className="subtle">
          Host creates room via `POST /api/rooms`, players join with `POST /api/rooms/:roomRef/join`, then host starts
          with `POST /api/rooms/:id/start`.
        </p>
      </Panel>

      <section className="room-grid" style={{ marginTop: "var(--space-5)" }}>
        <Panel>
          <h2 className="section-title">Room Code</h2>
          <p className="stat-value">K7M4Q</p>
          <p className="subtle">Share this code on the same screen. New joiners are listed instantly.</p>
          <div className="hero-actions">
            <Button variant="ghost">Copy Code</Button>
            <Button variant="secondary">Share Link</Button>
          </div>
          <hr style={{ borderColor: "rgb(255 255 255 / 0.12)", margin: "var(--space-5) 0" }} />
          <h3 className="section-title">Players</h3>
          <div className="players-list">
            <div className="player-row turn-pulse">
              <strong>Tim (Host)</strong>
              <Badge tone="success">Ready</Badge>
            </div>
            <div className="player-row">
              <strong>Alex</strong>
              <Badge tone="success">Ready</Badge>
            </div>
            <div className="player-row">
              <strong>Jordan</strong>
              <Badge tone="warning">Selecting deck</Badge>
            </div>
            <div className="player-row">
              <strong>Mina</strong>
              <Badge>Joined</Badge>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="section-title">Host Settings</h2>
          <div className="hud-list">
            <div className="player-row">
              <span>Game mode</span>
              <Badge>Exact date</Badge>
            </div>
            <div className="player-row">
              <span>Challenge lock</span>
              <Badge tone="success">On</Badge>
            </div>
            <div className="player-row">
              <span>Target score</span>
              <Badge>10 points</Badge>
            </div>
            <div className="player-row">
              <span>Deck privacy</span>
              <Badge tone="warning">Members only</Badge>
            </div>
          </div>
          <div className="card-stack" style={{ marginTop: "var(--space-5)" }}>
            <Button size="lg">Start Match</Button>
            <Button variant="ghost">Switch to Year-only Mode</Button>
          </div>
        </Panel>
      </section>
    </main>
  );
}
