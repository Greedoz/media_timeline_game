import Link from "next/link";

export default function DashboardPage() {
  return (
    <main>
      <section className="panel">
        <h1>Dashboard</h1>
        <p className="subtle">Manage decks and start rooms.</p>
        <div className="row">
          <Link href="/deck-builder">Create Deck</Link>
          <Link href="/room">Create Room</Link>
        </div>
      </section>
    </main>
  );
}

