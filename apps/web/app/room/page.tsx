export default function RoomPage() {
  return (
    <main>
      <section className="panel">
        <h1>Room Lobby</h1>
        <p className="subtle">
          Host creates room via `POST /api/rooms`, players join with `POST /api/rooms/:roomRef/join`, then host starts
          with `POST /api/rooms/:id/start`.
        </p>
      </section>
    </main>
  );
}
