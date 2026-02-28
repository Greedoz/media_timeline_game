import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="panel">
        <h1>Media Timeline Party Game</h1>
        <p className="subtle">
          Build a timeline from photos, GIFs, and short videos. Challenge friends and steal cards with correct
          chronology.
        </p>
        <div className="row">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/room">Game Room</Link>
          <Link href="/deck-builder">Deck Builder</Link>
        </div>
      </section>

      <section className="panel">
        <h2>MVP Status</h2>
        <ul>
          <li>Server-authoritative game action endpoints</li>
          <li>Deterministic game engine package with tests</li>
          <li>Deck and room API contracts scaffolded</li>
          <li>Supabase schema and RLS migrations included</li>
        </ul>
      </section>
    </main>
  );
}

