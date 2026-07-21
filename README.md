# VFA eFootball

The official website for the **Virtual Football Alliance (VFA)** — a competitive eFootball community hosting leagues and tournaments including the VFA Premier League (VPL), VFA Champions League (VCL), and the VFA Super Shield (VSS).

The site serves as a "Control Tower" for the community: live fixtures, standings, team squads, player database, a season player auction tracker, World Cup fantasy hub, and an AI-powered rulebook assistant.

## Tech Stack

- **Frontend:** Static HTML, CSS, and vanilla JavaScript (multi-page site)
- **Backend / Data:** [Supabase](https://supabase.com/) (Postgres) accessed directly from the browser via the JS client
- **AI Chatbot:** Serverless function (`/api/chat`) powered by Google Gemini 2.5 Flash
- **Hosting:** [Vercel](https://vercel.com/) (serverless functions + static hosting with clean URLs)

## Features

- **Home / Control Tower** — league overview, team logo ticker, theme song teaser, and dynamic "Last Season Champions" block pulled from Supabase.
- **Leagues** — VPL and VCL standings and fixtures.
- **Teams Directory** — profile pages for all 12 clubs with logos and squads.
- **Player Database** — searchable, filterable pool of all league players.
- **Season Player Auction Tracker** — live view of managers building their squads.
- **World Cup 2026 Fantasy Hub** — fantasy league registration and leaderboard info.
- **Stats Center / Archive** — team stats, head-to-head comparisons, and Hall of Fame.
- **RuleBot** — an AI chatbot that answers questions strictly from the official VFA Rulebook.

## Project Structure

```
.
├── api/
│   └── chat.js              # Serverless RuleBot endpoint (Gemini)
├── assets/
│   ├── css/main.css         # Global styles
│   ├── js/main.js           # Component loader + chatbot logic
│   ├── images/logos/        # Team and league logos
│   └── video/               # Theme song teaser
├── components/              # Shared header, footer, chatbot widget
├── fantasy/                 # World Cup fantasy hub
├── teams/                   # Team directory + individual club pages
├── vpl/                     # VPL points table & schedule
├── vcl/                     # VCL points table & schedule
├── Rules/                   # VFA Rulebook (source of truth for RuleBot)
├── config.js                # Supabase client initialization
├── vercel.json              # Vercel config (clean URLs)
├── index.html               # Home page
├── auction.html             # Auction tracker
├── players.html             # Player database
├── matchday.html            # Live matchday hub
├── archive.html             # Stats center / Hall of Fame
└── rules.html               # Rulebook page
```

Shared `header`, `footer`, and `chatbot` components are injected into each page at runtime by `assets/js/main.js`.

## Configuration

### Supabase
Public Supabase URL and anon key are set in [`config.js`](config.js) and used client-side to read league data (seasons, tournaments, teams, hall of fame, etc.).

### Gemini (RuleBot)
The chatbot endpoint reads the API key from an environment variable — set this in your Vercel project settings:

```
GEMINI_API_KEY=your_google_gemini_api_key
```

RuleBot answers exclusively from `Rules/VFA - eFootball Rulebook.md`, which is bundled with the deployment and read at request time.

## Local Development

Because pages fetch shared components and call the Supabase/`/api/chat` endpoints, serve the site over HTTP rather than opening files directly.

- **Static pages** can be served with any static server (e.g. `python -m http.server`), but note the `/api/chat` route requires the Vercel runtime.
- **Full experience (incl. RuleBot)** is best run with the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

Set `GEMINI_API_KEY` in your environment or a local `.env` for the chatbot to work.

## Deployment

The site is deployed on Vercel. Pushing to the connected repository triggers a deployment. Ensure `GEMINI_API_KEY` is configured in the Vercel project's environment variables.
