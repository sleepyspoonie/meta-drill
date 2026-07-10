#!/usr/bin/env node
/**
 * Nightly Pikalytics snapshot for Meta Drill (Pokémon Champions).
 *
 * Endpoints (documented at https://www.pikalytics.com/llms-full.txt):
 *   GET /ai/pokedex                    -> ranked list, site's current default format
 *   GET /ai/pokedex/[format]           -> ranked list for a format
 *   GET /ai/pokedex/[format]/[pokemon] -> per-Pokémon markdown (moves/items/abilities/
 *                                         natures with %s, base stats, win rate)
 *
 * The "current" format slug rotates with seasons (e.g. battledataregmbs3),
 * so it is auto-detected from /ai/pokedex on every run.
 *
 * Mega Evolutions: Pikalytics tracks base forms only, so after each pull
 * the script checks EVERY ranked Pokémon against PokéAPI for Mega form
 * varieties and attaches their stats, types, and ability as mon.megas.
 * (Item lists can't be trusted to reveal stone holders — Pikalytics only
 * stores each mon's top few items.) Champions-exclusive Megas that
 * PokéAPI doesn't know yet are skipped with a warning and retried on
 * the next run. Species lookups are cached within a run.
 *
 * Resilience: each format is fetched independently. If one fails, its
 * previous data.json block is carried forward untouched and the run still
 * succeeds. The run only fails if NO format could be refreshed.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const OUT = fileURLToPath(new URL("../data.json", import.meta.url));
const BASE = "https://www.pikalytics.com";
const TOP_N = 50;
const DELAY_MS = 900; // be polite: ~1 request/second

const FORMATS = [
  {
    id: "champions-current", game: "Pokémon Champions", label: "Current regulation",
    slug: "auto", // resolved from /ai/pokedex at runtime — tracks season rotations
    hasNatures: true, hasWinrate: true,
    source: "Pikalytics ranked battle data · Pokémon Champions (current regulation)",
    noteText: "Stats shown are base-form values — Megas change stats in battle.",
  },
  {
    id: "champions-regma", game: "Pokémon Champions", label: "Reg M-A",
    slug: "gen9championsvgc2026regma",
    hasNatures: true, hasWinrate: true,
    source: "Pikalytics ranked battle data · Champions Reg M-A",
    noteText: "Stats shown are base-form values — Megas change stats in battle.",
  },
  // Add more regulations here as they release — current slugs are listed
  // in the "Supported Formats" table at https://www.pikalytics.com/llms-full.txt
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "MetaDrill/1.0 (personal study tool; nightly cached pull)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** The default-format index links to /ai/pokedex/<slug>/<mon>; extract <slug>.
    Falls back to the "Format Code" line if link counting finds nothing. */
async function resolveCurrentSlug() {
  const md = await get(`${BASE}/ai/pokedex`);
  const counts = {};
  for (const m of md.matchAll(/\/ai\/pokedex\/([a-z0-9]+)\//gi)) {
    counts[m[1]] = (counts[m[1]] || 0) + 1;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (best) return best[0];
  const fc = md.match(/Format Code\*{0,2}[^a-z0-9]*`?([a-z0-9]+)`?/i);
  if (fc) return fc[1];
  throw new Error("Could not detect the current format slug from /ai/pokedex");
}

/* The ranked list is a markdown table under a "## Best N Pokemon by Usage"
   heading:  | 1 | **Garchomp** | N/A% | 50.543% | 13846-13548-28 | [View] | [AI] |
   Usage can be "N/A" (tournament-derived formats); win rate is column 4.
   Other tables on the page (team cores, top teams) also have numeric rank
   columns, so parsing is gated to the usage-table section. */
function parseList(text) {
  const mons = [];
  let inRankTable = false;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^#{1,6}\s*(.+)/);
    if (heading) {
      inRankTable = /best\s+\d+\s+pokemon/i.test(heading[1]);
      continue;
    }
    if (!inRankTable) continue;
    const m = line.match(
      /^\|\s*(\d+)\s*\|\s*\*{0,2}([^|*]+?)\*{0,2}\s*\|\s*(N\/A|\d+(?:\.\d+)?)\s*%?\s*\|\s*(N\/A|\d+(?:\.\d+)?)\s*%?\s*\|/
    );
    if (!m) continue;
    const name = m[2].trim();
    if (!name || name.includes(",")) continue;
    mons.push({
      rank: +m[1],
      name,
      usage: m[3] === "N/A" ? null : +m[3],
      winrate: m[4] === "N/A" ? null : +m[4],
    });
  }
  if (mons.length) return mons;
  // Fallback: numbered-list style, in case another format renders that way
  for (const line of text.split("\n")) {
    const m = line.match(
      /^\s*(\d+)[.)]\s*\[?([A-Za-z0-9 .'’%\-]+?)\]?\s*(?:\([^)%]*\))?\s*[—:–-]?\s*\(?(\d+(?:\.\d+)?)\s*%\)?/
    );
    if (m) mons.push({ rank: +m[1], name: m[2].trim(), usage: +m[3], winrate: null });
  }
  return mons;
}

const TYPE_WORDS = /normal|fire|water|electric|grass|ice|fighting|poison|ground|flying|psychic|bug|rock|ghost|dragon|dark|steel|fairy/g;
const STAT_MAP = {
  hp: "hp", atk: "atk", attack: "atk", def: "def", defense: "def",
  spa: "spa", "sp. atk": "spa", "sp atk": "spa", "special attack": "spa",
  spd: "spd", "sp. def": "spd", "sp def": "spd", "special defense": "spd",
  spe: "spe", speed: "spe",
};

function parseDetail(text) {
  const out = { moves: [], items: [], abilities: [], natures: [], stats: null, types: null, winrate: null };
  let section = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^#{1,4}\s*(.+)/);
    if (heading) {
      const t = heading[1].toLowerCase();
      section =
        t.includes("move") ? "moves" :
        t.includes("item") ? "items" :
        t.includes("abilit") ? "abilities" :
        t.includes("nature") ? "natures" :
        (t.includes("type") && !t.includes("tera")) ? "types" :
        (t.includes("stat") && !t.includes("usage")) ? "stats" : null;
      continue;
    }
    if (!section) {
      const wr = line.match(/win\s?rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i);
      if (wr && out.winrate == null) out.winrate = +wr[1];
      continue;
    }
    if (section === "types") {
      if (!out.types) {
        const words = line.toLowerCase().match(TYPE_WORDS);
        if (words) out.types = [...new Set(words)].slice(0, 2);
      }
    } else if (section === "stats") {
      const slash = line.match(/(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
      if (slash) {
        out.stats = { hp: +slash[1], atk: +slash[2], def: +slash[3], spa: +slash[4], spd: +slash[5], spe: +slash[6] };
        continue;
      }
      const kv = line.match(/^[-*|]?\s*(hp|atk|attack|def|defense|spa|sp\.? ?atk|special attack|spd|sp\.? ?def|special defense|spe|speed)\s*[:|]?\s*(\d+)/i);
      if (kv) {
        const key = STAT_MAP[kv[1].toLowerCase().replace(/\s+/g, " ")];
        if (key) { out.stats = out.stats || {}; out.stats[key] = +kv[2]; }
      }
    } else {
      // e.g.  - **Dragon Claw**: 89.4%   (bold markers optional)
      const m = line.match(/^[-*|]?\s*\*{0,2}([A-Za-z0-9 .'’()\-]+?)\*{0,2}\s*[:(–—-]\s*(\d+(?:\.\d+)?)\s*%/);
      if (m && out[section].length < 8) out[section].push({ name: m[1].trim(), pct: +m[2] });
    }
  }
  // FAQ sometimes names the top nature: "features a **Jolly** nature ...
  // accounts for 32.7% of competitive builds."
  if (!out.natures.length) {
    const nat = text.match(/features an? \*{0,2}([A-Za-z]+)\*{0,2} nature[\s\S]{0,160}?(\d+(?:\.\d+)?)\s*%/i);
    if (nat && nat[1] && nat[1].toLowerCase() !== "nature") {
      out.natures.push({ name: nat[1], pct: +nat[2] });
    }
  }
  return out;
}

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "MetaDrill/1.0 (personal study tool; nightly cached pull)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

const POKEAPI_STAT = {
  hp: "hp", attack: "atk", defense: "def",
  "special-attack": "spa", "special-defense": "spd", speed: "spe",
};
const prettyWords = (slugPart) =>
  slugPart.split("-").map(w => (w.length <= 1 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ");
function prettyMegaName(varietySlug) {
  // charizard-mega-y -> "Mega Charizard Y"
  const parts = varietySlug.split("-");
  const mi = parts.indexOf("mega");
  const base = prettyWords(parts.slice(0, mi).join("-"));
  const suffix = parts.slice(mi + 1).map(s => s.toUpperCase()).join(" ");
  return `Mega ${base}${suffix ? " " + suffix : ""}`;
}

const FORM_SLUG_OVERRIDES = {
  "basculegion": "basculegion-male",
  "maushold": "maushold-family-of-four",
  "indeedee-f": "indeedee-female",
  "indeedee-m": "indeedee-male",
  "tornadus": "tornadus-incarnate",
  "thundurus": "thundurus-incarnate",
  "landorus": "landorus-incarnate",
  "enamorus": "enamorus-incarnate",
  "urshifu": "urshifu-single-strike",
  "toxtricity": "toxtricity-amped",
  "mimikyu": "mimikyu-disguised",
};

/** Fetch a Pokémon's PokéAPI record, trying the full form slug first,
    then the species' default variety. */
async function fetchPokemon(name, speciesSlug) {
  const full = name.toLowerCase().replace(/[.'’%]/g, "").replace(/\s+/g, "-");
  try {
    await sleep(300);
    return await getJson(`https://pokeapi.co/api/v2/pokemon/${FORM_SLUG_OVERRIDES[full] || full}`);
  } catch {
    const species = await getJson(`https://pokeapi.co/api/v2/pokemon-species/${speciesSlug}`);
    const v = (species.varieties || []).find(x => x.is_default) || (species.varieties || [])[0];
    if (!v) throw new Error("no varieties");
    await sleep(300);
    return await getJson(`https://pokeapi.co/api/v2/pokemon/${v.pokemon.name}`);
  }
}

/** For every ranked Pokémon: backfill missing types/stats from PokéAPI
    (the AI detail pages don't include a type section), and attach Mega
    form varieties. speciesCache persists across formats within a run. */
async function attachMegas(mons, speciesCache) {
  for (const mon of mons) {
    const holdsStone = (mon.items || []).some(e => {
      const n = typeof e === "string" ? e : e.name;
      return /ite(?: [XY])?$/.test(n) && n !== "Eviolite";
    });
    const speciesSlug = mon.name.toLowerCase().replace(/[.'’%]/g, "").replace(/\s+/g, "-").split("-")[0];
    if (!(mon.types || []).length || !mon.stats) {
      try {
        const p = await fetchPokemon(mon.name, speciesSlug);
        if (!(mon.types || []).length) mon.types = p.types.map(x => x.type.name);
        if (!mon.stats) {
          const stats = {};
          p.stats.forEach(s => { const k = POKEAPI_STAT[s.stat.name]; if (k) stats[k] = s.base_stat; });
          if (Object.keys(stats).length === 6) mon.stats = stats;
        }
      } catch (err) {
        console.warn(`  ! type/stat backfill failed for ${mon.name}: ${err.message}`);
      }
    }
    try {
      let varieties = speciesCache[speciesSlug];
      if (varieties === undefined) {
        await sleep(300);
        const species = await getJson(`https://pokeapi.co/api/v2/pokemon-species/${speciesSlug}`);
        varieties = (species.varieties || []).map(v => v.pokemon.name).filter(n => n.includes("-mega"));
        speciesCache[speciesSlug] = varieties;
      }
      if (!varieties.length) {
        if (holdsStone) {
          console.warn(`  ! ${mon.name} holds a Mega Stone but PokéAPI has no Mega form (Champions-new Mega?) — skipped for now`);
        }
        continue;
      }
      const megas = [];
      for (const v of varieties) {
        await sleep(300);
        const p = await getJson(`https://pokeapi.co/api/v2/pokemon/${v}`);
        const stats = {};
        p.stats.forEach(s => { const k = POKEAPI_STAT[s.stat.name]; if (k) stats[k] = s.base_stat; });
        megas.push({
          name: prettyMegaName(v),
          slug: v,
          types: p.types.map(x => x.type.name),
          stats,
          ability: p.abilities.length ? prettyWords(p.abilities[0].ability.name) : null,
        });
      }
      mon.megas = megas;
      console.log(`  + ${mon.name}: attached ${megas.map(g => g.name).join(", ")}`);
    } catch (err) {
      console.warn(`  ! Mega lookup failed for ${mon.name}: ${err.message}${mon.megas ? " (keeping previous Mega data)" : ""}`);
    }
  }
}

function loadPrevious() {
  if (!existsSync(OUT)) return { byId: {}, byName: {} };
  try {
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    const byId = {}, byName = {};
    for (const f of prev.formats || []) {
      byId[f.id] = f;
      for (const m of f.mons || []) if (!byName[m.name]) byName[m.name] = m;
    }
    return { byId, byName };
  } catch {
    return { byId: {}, byName: {} };
  }
}

async function pullFormat(fmt, prev, speciesCache) {
  const slug = fmt.slug === "auto" ? await resolveCurrentSlug() : fmt.slug;
  console.log(`\n== ${fmt.game} · ${fmt.label} (slug: ${slug}) ==`);
  const ranked = parseList(await get(`${BASE}/ai/pokedex/${slug}`)).slice(0, TOP_N);
  if (ranked.length < 10) {
    throw new Error(
      `Only parsed ${ranked.length} ranked entries for "${slug}" — the format may have rotated. ` +
      `Check ${BASE}/llms-full.txt for current slugs.`
    );
  }
  console.log(`ranked: ${ranked.length} Pokémon (top: ${ranked[0].name} ${ranked[0].usage}%)`);

  const prevMons = Object.fromEntries(((prev.byId[fmt.id] || {}).mons || []).map(m => [m.name, m]));
  const mons = [];
  for (const entry of ranked) {
    await sleep(DELAY_MS);
    let detail = { moves: [], items: [], abilities: [], natures: [], stats: null, types: null, winrate: null };
    try {
      detail = parseDetail(await get(`${BASE}/ai/pokedex/${slug}/${encodeURIComponent(entry.name)}`));
    } catch (err) {
      console.warn(`  ! detail failed for ${entry.name}: ${err.message}`);
    }
    const old = prevMons[entry.name] || prev.byName[entry.name] || {};
    const mon = {
      rank: entry.rank,
      name: entry.name,
      usage: entry.usage,
      types: detail.types || old.types || [],
      stats: detail.stats && Object.keys(detail.stats).length === 6 ? detail.stats : old.stats || null,
      moves: detail.moves.length ? detail.moves : old.moves || [],
      items: detail.items.length ? detail.items : old.items || [],
      abilities: detail.abilities.length ? detail.abilities : old.abilities || [],
      natures: detail.natures.length ? detail.natures : old.natures || [],
    };
    const wr = detail.winrate != null ? detail.winrate
      : entry.winrate != null ? entry.winrate
      : old.winrate;
    if (wr != null) mon.winrate = wr;
    if (old.megas) mon.megas = old.megas;
    mons.push(mon);
    console.log(`  #${mon.rank} ${mon.name} — ${mon.moves.length} moves, ${mon.items.length} items, ${mon.natures.length} natures`);
  }
  console.log("Checking all ranked Pokémon for Mega forms on PokéAPI…");
  await attachMegas(mons, speciesCache);
  return { ...fmt, slug, mons };
}

async function main() {
  const prev = loadPrevious();
  const speciesCache = {};
  const formats = [];
  let successes = 0;

  for (const fmt of FORMATS) {
    try {
      formats.push(await pullFormat(fmt, prev, speciesCache));
      successes++;
    } catch (err) {
      console.error(`\nFAILED ${fmt.label}: ${err.message}`);
      if (prev.byId[fmt.id]) {
        console.error(`  -> keeping previous ${fmt.label} data unchanged.`);
        formats.push(prev.byId[fmt.id]);
      } else {
        console.error(`  -> no previous data for ${fmt.label}; it will be absent until a pull succeeds.`);
      }
    }
  }

  if (successes === 0) {
    console.error("\nNo format could be refreshed; data.json was NOT modified.");
    process.exit(1);
  }

  const payload = {
    generated: new Date().toISOString().slice(0, 10),
    note: "Auto-refreshed nightly from Pikalytics by GitHub Action.",
    formats,
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 1));
  console.log(`\nWrote ${OUT} (${successes}/${FORMATS.length} formats refreshed)`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((err) => {
    console.error(`\nFATAL: ${err.message}`);
    process.exit(1);
  });
}

export { parseList, parseDetail };
