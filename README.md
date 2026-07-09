# Meta Drill

Spaced-repetition flashcards for learning the current VGC meta, built on
nightly Pikalytics usage data. Supports Scarlet & Violet and Pokémon
Champions, configurable by number of top Pokémon, base stats (all or a
single stat), common moves, natures, items, and abilities.

## How it works

- `index.html` + `app.jsx` — the whole app. No build step: React and Babel
  load from CDNs, so GitHub Pages serves it as-is.
- `data.json` — the meta snapshot the app reads at load time.
- `scripts/fetch-data.mjs` — pulls fresh usage data from Pikalytics'
  AI-readable endpoints and rewrites `data.json`.
- `.github/workflows/refresh-data.yml` — runs that script nightly
  (03:00 UTC) and commits the result. Pages redeploys automatically.

If a pull fails (site change, format rotation), the workflow fails loudly
and the last good `data.json` keeps serving — the app never breaks.

## Deploy (one time, ~3 minutes)

1. Create a GitHub repo and push these files (or upload them via the web UI).
2. **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. **Actions tab** → enable workflows → open *Refresh meta data* →
   **Run workflow** once manually. This replaces the seed snapshot with a
   fresh pull that includes exact usage percentages.
4. Done. Your app lives at `https://<you>.github.io/<repo>/` and the data
   refreshes itself every evening.

## When a regulation rotates

Format slugs live in the `FORMATS` array at the top of
`scripts/fetch-data.mjs`. Current slugs are listed at
`https://www.pikalytics.com/llms.txt`. Update the slug and label, commit,
and the next nightly run picks it up. (Or just ask Claude to do it.)

## Modes

**Flashcards** — spaced-repetition drilling of one category at a time:
a single base stat (default Speed), natures, items, abilities, the
format-independent **Nature chart** (25 cards covering every nature's
+10%/−10% effects), or the **Moves game** — the mon's tracked moves are
shown shuffled and you select every move with over 30% usage. This game
requires real usage percentages, so it stays locked until the first
data pull populates them. The nightly pull covers the top 50
Pokémon per format; the study slider sizes itself to the data.

**Speed Game** — pick a win target (5/10/15/25), then choose a variant:
*1v1 Duel* (two random mons from your top-N pool, pick the faster by
base Speed — speed ties are a legal answer) or *2v2 Turn Order* (a full
doubles field of four; tap them in move order, fastest first, with tied
Pokémon accepted in either order). Turn Order has a **Hard Mode** that
layers on real speed control — Choice Scarf (×1.5), Tailwind (×2 for one
side), paralysis (×0.5), weather with speed abilities (Swift Swim in
rain, Chlorophyll in sun, Sand Rush in sandstorm, Slush Rush in snow —
all ×2), and Trick Room, which reverses the whole order. Weather can
also be put up by a setter on the field — Drizzle, Drought, Snow
Warning, Sand Stream/Spit, Orichalcum Pulse — and the banner credits
them (e.g. "Snow · Ninetales-Alola's Snow Warning"), so sandstorm and
snow rounds appear organically whenever setters or abusers are in your
studied pool. A fielded setter's weather is only up 50% of the time —
weather goes down in real games too.

Hard Mode also has an optional **± Speed natures** sub-toggle. Only
speed-relevant natures are dealt, so every chip on the field changes
the answer: roughly a third of Pokémon get a +Spe nature (Jolly, Timid,
Hasty, Naive — ×1.1), a third get a −Spe nature (Brave, Quiet, Relaxed,
Sassy — ×0.9), and the rest show no chip (neutral). The multiplier
applies to the stat before item/field multipliers. (Snow is Gen 9's replacement for hail — same blizzard
weather.) Every modifier is shown on the
field, the reveal shows the math per Pokémon, and the round generator
guarantees at least one modifier that actually changes the answer.
(Not modeled: Protosynthesis/Quark Drive speed boosts, Unburden, and
stat stages.) Wrong answers don't count toward your total, and streaks
are tracked.

Pokémon Champions is the default format; switch to Scarlet & Violet on
the config screen.

Both modes share the study pool config, including a **Mega toggle**
(shown for formats where top Pokémon carry Mega Stones) that includes or
excludes Mega users from the pool. Category availability is data-driven:
if a snapshot lacks, say, natures for a format, that category shows
"no data yet" until a nightly pull fills it in.

## Sprites

Pokémon artwork loads at runtime from [PokéAPI](https://pokeapi.co)
(free, CORS-enabled, no key needed) with a small form-name override map
for tricky slugs like Calyrex-Shadow → calyrex-shadow-rider. Results are
cached in memory, and anywhere a sprite can't load, the app falls back
to type-colored orbs — so the app works fully offline from PokéAPI too.

## Spaced repetition

In-session Anki-style learning steps, measured in cards rather than days:

| Grade | Effect |
|-------|--------|
| Again | Resets the card, returns in ~2 cards, counts a lapse |
| Hard  | Returns in ~5 cards, no progress |
| Good  | Advances a step, returns in ~10 cards; second Good graduates it |
| Easy  | Graduates immediately |

Tuning lives in the `SRS` constant at the top of `app.jsx`.
Keyboard: space/enter to flip, 1–4 to grade.

## A note on being a good citizen

Pikalytics' API is unofficial and the site is community-run and
ad-supported. This project pulls once per day at ~1 request/second with an
identifying user-agent, and caches everything. Please keep it that way,
and consider supporting them.

## Local development

```
python3 -m http.server 8000
# open http://localhost:8000
```
