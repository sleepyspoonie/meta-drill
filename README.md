# VGC Meta Blitz

Spaced-repetition flashcards and quiz games for learning the Pokémon
Champions competitive meta, built on nightly Pikalytics usage data.

## How it works

- `index.html` + `app.jsx` — the whole app. No build step: React and Babel
  load from CDNs, so GitHub Pages serves it as-is.
- `data.json` — the meta snapshot the app reads at load time.
- `scripts/fetch-data.mjs` — pulls fresh usage data from Pikalytics'
  AI-readable endpoints and rewrites `data.json`. Covers the top 50
  Pokémon per regulation; the study slider sizes itself to the data.
  Types always come from PokéAPI (the AI pages' matchup sections aren't a
  reliable source of a mon's own typing).
  It also checks every ranked Pokémon for Mega form varieties on PokéAPI
  and attaches their stats, types, and ability, so Megas appear as their
  own entries in the drills. Champions-exclusive Megas that PokéAPI
  doesn't know yet are skipped with a warning and retried nightly.
- `.github/workflows/refresh-data.yml` — runs that script nightly
  (03:00 UTC) and commits the result. Pages redeploys automatically.

The current-regulation slug rotates with seasons (e.g.
`battledataregmbs3`), so the script auto-detects it from
`/ai/pokedex` on every run. Each regulation is pulled independently: if
one fails, its previous data is carried forward and the others still
refresh. The run only fails outright if nothing could be refreshed.

## Deploy (one time, ~3 minutes)

1. Create a public GitHub repo and push these files.
2. **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. **Settings → Actions → General → Workflow permissions** → *Read and
   write permissions*.
4. **Actions tab** → *Refresh meta data* → **Run workflow** once. This
   replaces the seed snapshot with a fresh pull including exact usage
   percentages, natures, Reg M-A, and the top 50.
5. Your app lives at `https://<you>.github.io/<repo>/` and refreshes
   itself every evening.

## What to drill

All drills share the pool config: regulation, top-N slider, and a
**Mega selector** (Include Megas / No Megas / Megas only, detected from
Mega Stones in the item data).

| Drill | How it plays |
|-------|--------------|
| Base Stat Quiz | Flip cards for one stat (default Speed, with speed-tier context on reveal) |
| Speed Tier Simulator | 1v1 duels, 2v2 turn order, or Find the Scarf (the move order is shown — drag the Scarf onto the hidden holder; rounds regenerate until the answer is unique). Win targets, streaks, and an optional Hard Mode (Scarf ×1.5, Tailwind ×2, PAR ×0.5, weather + Swift Swim/Chlorophyll/Sand Rush/Slush Rush ×2, Trick Room reversal, optional ±Spe natures). Weather setters put their weather up 50% of the time. |
| Common Movesets Quiz | The mon's tracked moves, shuffled — select every move over 30% usage |
| Common Items Quiz | 8 items (the mon's own + distractors from other mons) — select everything over 10% usage |
| Common Builds Quiz | Multiple choice — pick the mon's real most-common build (nature + EV spread) among builds borrowed from other meta mons. While Pikalytics' nature field is blank (reported bug), options show the EV spread alone and natures slot in automatically once fixed |
| Preferred Abilities Quiz | Multiple choice — pick the mon's most common ability. Reveals a description of the ability (from PokéAPI). Pokémon with only one tracked ability are skipped by default (toggleable) |
| Preferred Natures Quiz | Flip cards from ladder data |
| Physically or Specially Offensive Quiz | Physical, special, or mixed attacker? (within 10 base points = mixed) |
| Physically or Specially Defensive Quiz | Physically or specially bulkier? |
| Type Matchup Quiz | Generic monotype drill with two sub-modes: Supereffective (given an attacking type, select every type it hits hard) and Resisted (given a defending type, select every attacking type it resists, immunities included) |
| Nature Types Quiz | All 25 natures' +10%/−10% effects |

Quizzes with checkable answers grade themselves: a correct answer clears
the card, a miss requeues it until you get it right. Only the flip-card
drills (Base Stat, Preferred Natures, Nature Types) use Anki-style
self-rating.

The Mega selector expands the pool with actual Mega forms (Include
Megas), hides them (No Megas), or drills only them (Megas only).

Games that need usage percentages (moves, items) stay locked until the
first data pull populates them.

## Spaced repetition (flip cards)

In-session Anki-style learning steps, measured in cards rather than days:

| Grade | Effect |
|-------|--------|
| Again | Resets the card, returns in ~2 cards, counts a lapse |
| Hard  | Returns in ~5 cards, no progress |
| Good  | Advances a step, returns in ~10 cards; second Good graduates it |
| Easy  | Graduates immediately |

Tuning lives in the `SRS` constant at the top of `app.jsx`.
Keyboard: space/enter to flip, 1–4 to grade.

## Sprites

Pokémon artwork loads at runtime from [PokéAPI](https://pokeapi.co)
(free, CORS-enabled, no key needed) with a form-name override map for
tricky slugs. Anywhere a sprite can't load, the app falls back to
type-colored orbs.

## Testing the data pull

- **Locally**: `node scripts/fetch-data.mjs` (Node 18+) rewrites
  `data.json` on demand.
- **On GitHub**: Actions tab → *Refresh meta data* → *Run workflow*.
- When a new regulation drops, add its slug to `FORMATS` in the script —
  current slugs are listed at https://www.pikalytics.com/llms-full.txt

## A note on being a good citizen

Pikalytics' AI endpoints are designed for machine consumption, but the
site is community-run. This project pulls once per day at ~1
request/second with an identifying user-agent, and caches everything.
Please keep it that way, and consider supporting them.

## Local development

```
python3 -m http.server 8000
# open http://localhost:8000
```
