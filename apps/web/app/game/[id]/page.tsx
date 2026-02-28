interface Props {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  return (
    <main>
      <section className="panel">
        <h1>Game {id}</h1>
        <p className="subtle">
          Use action endpoints under `POST /api/games/{id}/actions/*` for place/challenge/skip/buy/recognition/reveal.
        </p>
      </section>
    </main>
  );
}

