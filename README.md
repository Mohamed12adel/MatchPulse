# MatchPulse

A real-time sports match API with live scores, match commentary, and WebSocket updates.

## Features

- Create and list matches
- Add and list match commentary
- Receive match and commentary events over WebSockets
- Validate request data with Zod
- Store data in PostgreSQL with Drizzle ORM
- Protect HTTP and WebSocket requests with Arcjet

## Requirements

- Node.js and npm
- A PostgreSQL database (Neon is supported)
- An Arcjet API key

## Setup

```bash
git clone <repository-url>
cd sports
npm install
```

Create a `.env` file in the project root:

```env
PORT=4000
DB_URL=your_postgresql_connection_string
ARCJET_KEY=your_arcjet_key
ARCJET_MODE=DRY_RUN
```

`ARCJET_MODE` is optional. It defaults to `LIVE`; set it to `DRY_RUN` to observe Arcjet decisions without enforcing them. Keep `.env` and API keys out of version control.

Apply the database migrations and start the development server from the project root:

```bash
npm run db:migrate
npm run dev
```

The API is available at `http://localhost:4000` by default.

## REST API

### Matches

| Method | Endpoint            | Description                                                   |
| ------ | ------------------- | ------------------------------------------------------------- |
| `GET`  | `/matches?limit=50` | List matches. The limit defaults to 50 and cannot exceed 100. |
| `POST` | `/matches`          | Create a match.                                               |

Example match request:

```json
{
  "sport": "football",
  "homeTeam": "Harbor FC",
  "awayTeam": "Riverside United",
  "startTime": "2026-10-07T18:00:00.000Z",
  "endTime": "2026-10-07T20:00:00.000Z"
}
```

### Commentary

Replace `:id` with the match ID.

| Method | Endpoint                            | Description                                                                                 |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `GET`  | `/matches/:id/commentary?limit=100` | List commentary for a match, newest first. The limit defaults to 100 and cannot exceed 100. |
| `POST` | `/matches/:id/commentary`           | Create commentary for a match.                                                              |

Example commentary request:

```json
{
  "minutes": 12,
  "sequence": 1,
  "period": "first_half",
  "eventType": "goal",
  "actor": "Jordan Lee",
  "team": "Harbor FC",
  "message": "Jordan Lee scores for Harbor FC.",
  "metadata": {
    "assist": "Taylor Kim"
  },
  "tags": ["goal", "home"]
}
```

`minutes`, `sequence`, `period`, `eventType`, and `message` are required. `actor`, `team`, `metadata`, and `tags` are optional.

## WebSocket API

Connect to `ws://localhost:4000/ws`, then subscribe to a match by sending a JSON message with an integer match ID:

```json
{ "type": "subscribe", "matchId": 1 }
```

The server acknowledges with `subscribed`. Commentary for that match is sent only to its subscribers:

```json
{
  "type": "Commentary",
  "data": {
    "id": 1,
    "matchId": 1,
    "minute": 12,
    "message": "Jordan Lee scores for Harbor FC."
  }
}
```

New matches are broadcast to all connected clients with the `match_created` event. To stop receiving updates for a match, send:

```json
{ "type": "unsubscribe", "matchId": 1 }
```

## Database Commands

```bash
npm run db:generate  # Generate migrations after schema changes
npm run db:migrate   # Apply pending migrations
npm run db:studio    # Open Drizzle Studio
```
