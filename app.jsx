/* global React, ReactDOM */
const { useEffect, useMemo, useRef, useState } = React;

/* ============================================================
   VGC META BLITZ — Pokémon Champions meta study tool
   · Spaced-repetition flashcards (Anki-style 4-tier grading)
   · Quiz games: moves >30%, items >10%, weaknesses, resists,
     ability multiple choice, offense/defense profiles
   · Speed matchups: 1v1 duels & 2v2 turn order w/ hard mode
   Data: loads ./data.json (refreshed nightly by GitHub Action);
   falls back to the embedded snapshot in chat-artifact mode.
   ============================================================ */

const FALLBACK = {
 "generated": "2026-07-09",
 "note": "Snapshot from Pikalytics. Refreshed nightly by GitHub Action once deployed. Percentages and Reg M-A appear after the first automated pull.",
 "formats": [
  {
   "id": "champions-current",
   "game": "Pokémon Champions",
   "label": "Reg M-B (current)",
   "slug": "champions",
   "hasNatures": true,
   "hasWinrate": true,
   "source": "Pikalytics ranked battle data · Champions Reg M-B S3",
   "noteText": "Stats shown are base-form values — Megas change stats in battle.",
   "mons": [
    {
     "rank": 1,
     "name": "Garchomp",
     "types": [
      "dragon",
      "ground"
     ],
     "winrate": 51.4,
     "stats": {
      "hp": 108,
      "atk": 130,
      "def": 95,
      "spa": 80,
      "spd": 85,
      "spe": 102
     },
     "moves": [
      "Dragon Claw",
      "Rock Slide",
      "Earthquake",
      "Protect",
      "Stomping Tantrum",
      "Poison Jab"
     ],
     "items": [
      "Life Orb",
      "Sitrus Berry",
      "Choice Scarf",
      "Roseli Berry",
      "Soft Sand"
     ],
     "abilities": [
      "Rough Skin",
      "Sand Veil"
     ],
     "megas": [
      {
       "name": "Mega Garchomp",
       "slug": "garchomp-mega",
       "types": [
        "dragon",
        "ground"
       ],
       "stats": {
        "hp": 108,
        "atk": 170,
        "def": 115,
        "spa": 120,
        "spd": 95,
        "spe": 92
       },
       "ability": "Sand Force"
      }
     ]
    },
    {
     "rank": 2,
     "name": "Sinistcha",
     "types": [
      "grass",
      "ghost"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 71,
      "atk": 60,
      "def": 106,
      "spa": 121,
      "spd": 80,
      "spe": 70
     },
     "moves": [
      "Rage Powder",
      "Matcha Gotcha",
      "Life Dew",
      "Trick Room",
      "Protect",
      "Strength Sap"
     ],
     "items": [
      "Sitrus Berry",
      "Kasib Berry",
      "Colbur Berry",
      "Leftovers",
      "Coba Berry"
     ],
     "abilities": [
      "Hospitality",
      "Heatproof"
     ]
    },
    {
     "rank": 3,
     "name": "Basculegion",
     "types": [
      "water",
      "ghost"
     ],
     "winrate": 53.6,
     "stats": {
      "hp": 120,
      "atk": 112,
      "def": 65,
      "spa": 80,
      "spd": 75,
      "spe": 78
     },
     "moves": [
      "Last Respects",
      "Aqua Jet",
      "Wave Crash",
      "Protect",
      "Flip Turn",
      "Liquidation"
     ],
     "items": [
      "Choice Scarf",
      "Mystic Water",
      "Focus Sash",
      "Life Orb",
      "Sitrus Berry"
     ],
     "abilities": [
      "Adaptability",
      "Swift Swim",
      "Mold Breaker"
     ]
    },
    {
     "rank": 4,
     "name": "Whimsicott",
     "types": [
      "grass",
      "fairy"
     ],
     "winrate": 51.8,
     "stats": {
      "hp": 60,
      "atk": 67,
      "def": 85,
      "spa": 77,
      "spd": 75,
      "spe": 116
     },
     "moves": [
      "Tailwind",
      "Moonblast",
      "Encore",
      "Protect",
      "Charm",
      "Sunny Day"
     ],
     "items": [
      "Focus Sash",
      "Fairy Feather",
      "Mental Herb",
      "Coba Berry",
      "Sitrus Berry"
     ],
     "abilities": [
      "Prankster",
      "Chlorophyll",
      "Infiltrator"
     ]
    },
    {
     "rank": 5,
     "name": "Kingambit",
     "types": [
      "dark",
      "steel"
     ],
     "winrate": 55.3,
     "stats": {
      "hp": 100,
      "atk": 135,
      "def": 120,
      "spa": 60,
      "spd": 85,
      "spe": 50
     },
     "moves": [
      "Sucker Punch",
      "Kowtow Cleave",
      "Iron Head",
      "Protect",
      "Low Kick",
      "Swords Dance"
     ],
     "items": [
      "Chople Berry",
      "Black Glasses",
      "Focus Sash",
      "Life Orb",
      "Occa Berry"
     ],
     "abilities": [
      "Defiant",
      "Supreme Overlord"
     ]
    },
    {
     "rank": 6,
     "name": "Staraptor",
     "types": [
      "normal",
      "flying"
     ],
     "winrate": 44.7,
     "stats": {
      "hp": 85,
      "atk": 120,
      "def": 70,
      "spa": 50,
      "spd": 60,
      "spe": 100
     },
     "moves": [
      "Close Combat",
      "Protect",
      "Brave Bird",
      "Roost",
      "Dual Wingbeat",
      "Tailwind"
     ],
     "items": [
      "Staraptite",
      "Choice Scarf",
      "Life Orb",
      "Sitrus Berry"
     ],
     "abilities": [
      "Intimidate",
      "Reckless"
     ]
    },
    {
     "rank": 7,
     "name": "Incineroar",
     "types": [
      "fire",
      "dark"
     ],
     "winrate": 51.8,
     "stats": {
      "hp": 95,
      "atk": 115,
      "def": 90,
      "spa": 80,
      "spd": 90,
      "spe": 60
     },
     "moves": [
      "Fake Out",
      "Parting Shot",
      "Flare Blitz",
      "Throat Chop",
      "Darkest Lariat",
      "Protect"
     ],
     "items": [
      "Sitrus Berry",
      "Chople Berry",
      "Passho Berry",
      "Leftovers",
      "Charcoal"
     ],
     "abilities": [
      "Intimidate",
      "Blaze"
     ]
    },
    {
     "rank": 8,
     "name": "Charizard",
     "types": [
      "fire",
      "flying"
     ],
     "winrate": 53.4,
     "stats": {
      "hp": 78,
      "atk": 84,
      "def": 78,
      "spa": 109,
      "spd": 85,
      "spe": 100
     },
     "moves": [
      "Protect",
      "Heat Wave",
      "Solar Beam",
      "Weather Ball",
      "Air Slash",
      "Dragon Dance"
     ],
     "items": [
      "Charizardite Y",
      "Charizardite X",
      "Focus Sash",
      "Life Orb",
      "Charcoal"
     ],
     "abilities": [
      "Blaze",
      "Solar Power"
     ],
     "megas": [
      {
       "name": "Mega Charizard X",
       "slug": "charizard-mega-x",
       "types": [
        "fire",
        "dragon"
       ],
       "stats": {
        "hp": 78,
        "atk": 130,
        "def": 111,
        "spa": 130,
        "spd": 85,
        "spe": 100
       },
       "ability": "Tough Claws"
      },
      {
       "name": "Mega Charizard Y",
       "slug": "charizard-mega-y",
       "types": [
        "fire",
        "flying"
       ],
       "stats": {
        "hp": 78,
        "atk": 104,
        "def": 78,
        "spa": 159,
        "spd": 115,
        "spe": 100
       },
       "ability": "Drought"
      }
     ]
    },
    {
     "rank": 9,
     "name": "Raichu",
     "types": [
      "electric"
     ],
     "winrate": 44.4,
     "stats": {
      "hp": 60,
      "atk": 90,
      "def": 55,
      "spa": 90,
      "spd": 80,
      "spe": 110
     },
     "moves": [
      "Fake Out",
      "Protect",
      "Zap Cannon",
      "Focus Blast",
      "Volt Switch",
      "Charm"
     ],
     "items": [
      "Raichunite Y",
      "Raichunite X",
      "Focus Sash",
      "Shuca Berry",
      "Magnet"
     ],
     "abilities": [
      "Lightning Rod",
      "Static"
     ]
    },
    {
     "rank": 10,
     "name": "Pelipper",
     "types": [
      "water",
      "flying"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 60,
      "atk": 50,
      "def": 100,
      "spa": 95,
      "spd": 70,
      "spe": 65
     },
     "moves": [
      "Hurricane",
      "Weather Ball",
      "Tailwind",
      "Wide Guard",
      "Protect",
      "Muddy Water"
     ],
     "items": [
      "Focus Sash",
      "Sitrus Berry",
      "Damp Rock",
      "Choice Scarf",
      "Life Orb"
     ],
     "abilities": [
      "Drizzle",
      "Keen Eye"
     ]
    },
    {
     "rank": 11,
     "name": "Sneasler",
     "types": [
      "fighting",
      "poison"
     ],
     "winrate": 52.2,
     "stats": {
      "hp": 80,
      "atk": 130,
      "def": 60,
      "spa": 40,
      "spd": 80,
      "spe": 120
     },
     "moves": [
      "Close Combat",
      "Fake Out",
      "Dire Claw",
      "Protect",
      "Coaching",
      "Rock Slide"
     ],
     "items": [
      "White Herb",
      "Focus Sash",
      "Sitrus Berry",
      "Lum Berry",
      "Life Orb"
     ],
     "abilities": [
      "Unburden",
      "Poison Touch",
      "Pressure"
     ]
    },
    {
     "rank": 12,
     "name": "Archaludon",
     "types": [
      "steel",
      "dragon"
     ],
     "winrate": 51.1,
     "stats": {
      "hp": 90,
      "atk": 105,
      "def": 130,
      "spa": 125,
      "spd": 65,
      "spe": 85
     },
     "moves": [
      "Electro Shot",
      "Flash Cannon",
      "Protect",
      "Dragon Pulse",
      "Draco Meteor",
      "Aura Sphere"
     ],
     "items": [
      "Leftovers",
      "Choice Scarf",
      "White Herb",
      "Chople Berry",
      "Sitrus Berry"
     ],
     "abilities": [
      "Stamina",
      "Sturdy",
      "Stalwart"
     ]
    },
    {
     "rank": 13,
     "name": "Grimmsnarl",
     "types": [
      "dark",
      "fairy"
     ],
     "winrate": 47.5,
     "stats": {
      "hp": 95,
      "atk": 120,
      "def": 65,
      "spa": 95,
      "spd": 75,
      "spe": 60
     },
     "moves": [
      "Light Screen",
      "Parting Shot",
      "Reflect",
      "Spirit Break",
      "Fake Out",
      "Scary Face"
     ],
     "items": [
      "Light Clay",
      "Roseli Berry",
      "Sitrus Berry",
      "Leftovers",
      "Focus Sash"
     ],
     "abilities": [
      "Prankster",
      "Frisk",
      "Pickpocket"
     ]
    },
    {
     "rank": 14,
     "name": "Sylveon",
     "types": [
      "fairy"
     ],
     "winrate": 50.7,
     "stats": {
      "hp": 95,
      "atk": 65,
      "def": 65,
      "spa": 110,
      "spd": 130,
      "spe": 60
     },
     "moves": [
      "Hyper Voice",
      "Quick Attack",
      "Hyper Beam",
      "Detect",
      "Protect",
      "Moonblast"
     ],
     "items": [
      "Fairy Feather",
      "Life Orb",
      "Sitrus Berry",
      "Leftovers",
      "Choice Scarf"
     ],
     "abilities": [
      "Pixilate",
      "Cute Charm"
     ]
    },
    {
     "rank": 15,
     "name": "Swampert",
     "types": [
      "water",
      "ground"
     ],
     "winrate": 50.6,
     "stats": {
      "hp": 100,
      "atk": 110,
      "def": 90,
      "spa": 85,
      "spd": 90,
      "spe": 60
     },
     "moves": [
      "Protect",
      "Wave Crash",
      "Earthquake",
      "Ice Punch",
      "High Horsepower",
      "Rock Slide"
     ],
     "items": [
      "Swampertite",
      "Life Orb",
      "Rindo Berry",
      "Sitrus Berry",
      "Leftovers"
     ],
     "abilities": [
      "Torrent",
      "Damp"
     ],
     "megas": [
      {
       "name": "Mega Swampert",
       "slug": "swampert-mega",
       "types": [
        "water",
        "ground"
       ],
       "stats": {
        "hp": 100,
        "atk": 150,
        "def": 110,
        "spa": 95,
        "spd": 110,
        "spe": 70
       },
       "ability": "Swift Swim"
      }
     ]
    },
    {
     "rank": 16,
     "name": "Metagross",
     "types": [
      "steel",
      "psychic"
     ],
     "winrate": 48.5,
     "stats": {
      "hp": 80,
      "atk": 135,
      "def": 130,
      "spa": 95,
      "spd": 90,
      "spe": 70
     },
     "moves": [
      "Protect",
      "Psychic Fangs",
      "Iron Head",
      "Bullet Punch",
      "Stomping Tantrum",
      "Meteor Mash"
     ],
     "items": [
      "Metagrossite",
      "Life Orb",
      "Metal Coat",
      "Leftovers",
      "Sitrus Berry"
     ],
     "abilities": [
      "Clear Body",
      "Light Metal"
     ],
     "megas": [
      {
       "name": "Mega Metagross",
       "slug": "metagross-mega",
       "types": [
        "steel",
        "psychic"
       ],
       "stats": {
        "hp": 80,
        "atk": 145,
        "def": 150,
        "spa": 105,
        "spd": 110,
        "spe": 110
       },
       "ability": "Tough Claws"
      }
     ]
    },
    {
     "rank": 17,
     "name": "Farigiraf",
     "types": [
      "normal",
      "psychic"
     ],
     "winrate": 50.2,
     "stats": {
      "hp": 120,
      "atk": 90,
      "def": 70,
      "spa": 110,
      "spd": 70,
      "spe": 60
     },
     "moves": [
      "Trick Room",
      "Psychic",
      "Helping Hand",
      "Protect",
      "Thunderbolt",
      "Hyper Voice"
     ],
     "items": [
      "Sitrus Berry",
      "Colbur Berry",
      "Mental Herb",
      "Focus Sash",
      "Leftovers"
     ],
     "abilities": [
      "Armor Tail",
      "Cud Chew",
      "Sap Sipper"
     ]
    },
    {
     "rank": 18,
     "name": "Floette-Eternal",
     "types": [
      "fairy"
     ],
     "winrate": 55.7,
     "stats": {
      "hp": 74,
      "atk": 65,
      "def": 67,
      "spa": 125,
      "spd": 128,
      "spe": 92
     },
     "moves": [
      "Protect",
      "Dazzling Gleam",
      "Moonblast",
      "Light of Ruin",
      "Calm Mind",
      "Draining Kiss"
     ],
     "items": [
      "Floettite",
      "Life Orb",
      "Fairy Feather",
      "Choice Scarf"
     ],
     "abilities": [
      "Flower Veil",
      "Symbiosis"
     ]
    },
    {
     "rank": 19,
     "name": "Gholdengo",
     "types": [
      "steel",
      "ghost"
     ],
     "winrate": 48.4,
     "stats": {
      "hp": 87,
      "atk": 60,
      "def": 95,
      "spa": 133,
      "spd": 91,
      "spe": 84
     },
     "moves": [
      "Make It Rain",
      "Shadow Ball",
      "Protect",
      "Nasty Plot",
      "Power Gem",
      "Trick"
     ],
     "items": [
      "Life Orb",
      "Choice Scarf",
      "Metal Coat",
      "Leftovers",
      "White Herb"
     ],
     "abilities": [
      "Good as Gold"
     ]
    },
    {
     "rank": 20,
     "name": "Aerodactyl",
     "types": [
      "rock",
      "flying"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 80,
      "atk": 105,
      "def": 65,
      "spa": 60,
      "spd": 75,
      "spe": 130
     },
     "moves": [
      "Rock Slide",
      "Tailwind",
      "Dual Wingbeat",
      "Protect",
      "Wide Guard",
      "Ice Fang"
     ],
     "items": [
      "Aerodactylite",
      "Focus Sash",
      "Passho Berry",
      "Life Orb",
      "Wide Lens"
     ],
     "abilities": [
      "Unnerve",
      "Pressure",
      "Rock Head"
     ],
     "megas": [
      {
       "name": "Mega Aerodactyl",
       "slug": "aerodactyl-mega",
       "types": [
        "rock",
        "flying"
       ],
       "stats": {
        "hp": 80,
        "atk": 135,
        "def": 85,
        "spa": 70,
        "spd": 95,
        "spe": 150
       },
       "ability": "Tough Claws"
      }
     ]
    },
    {
     "rank": 21,
     "name": "Maushold",
     "types": [
      "normal"
     ],
     "winrate": 50.1,
     "stats": {
      "hp": 74,
      "atk": 75,
      "def": 70,
      "spa": 65,
      "spd": 75,
      "spe": 111
     },
     "moves": [
      "Follow Me",
      "Protect",
      "Super Fang",
      "Population Bomb",
      "Beat Up",
      "Encore"
     ],
     "items": [
      "Chople Berry",
      "Wide Lens",
      "Focus Sash",
      "Sitrus Berry",
      "Mental Herb"
     ],
     "abilities": [
      "Friend Guard",
      "Technician",
      "Cheek Pouch"
     ]
    },
    {
     "rank": 22,
     "name": "Annihilape",
     "types": [
      "fighting",
      "ghost"
     ],
     "winrate": 43.9,
     "stats": {
      "hp": 110,
      "atk": 115,
      "def": 80,
      "spa": 50,
      "spd": 90,
      "spe": 90
     },
     "moves": [
      "Rage Fist",
      "Protect",
      "Drain Punch",
      "Bulk Up",
      "Close Combat",
      "Coaching"
     ],
     "items": [
      "Leftovers",
      "Sitrus Berry",
      "Choice Scarf",
      "Focus Sash",
      "Roseli Berry"
     ],
     "abilities": [
      "Defiant",
      "Inner Focus",
      "Vital Spirit"
     ]
    },
    {
     "rank": 23,
     "name": "Sableye",
     "types": [
      "dark",
      "ghost"
     ],
     "winrate": 45.7,
     "stats": {
      "hp": 50,
      "atk": 75,
      "def": 75,
      "spa": 65,
      "spd": 65,
      "spe": 50
     },
     "moves": [
      "Rain Dance",
      "Light Screen",
      "Encore",
      "Reflect",
      "Will-O-Wisp",
      "Disable"
     ],
     "items": [
      "Roseli Berry",
      "Light Clay",
      "Sitrus Berry",
      "Focus Sash",
      "Leftovers"
     ],
     "abilities": [
      "Prankster",
      "Stall"
     ],
     "megas": [
      {
       "name": "Mega Sableye",
       "slug": "sableye-mega",
       "types": [
        "dark",
        "ghost"
       ],
       "stats": {
        "hp": 50,
        "atk": 85,
        "def": 125,
        "spa": 85,
        "spd": 115,
        "spe": 20
       },
       "ability": "Magic Bounce"
      }
     ]
    },
    {
     "rank": 24,
     "name": "Mawile",
     "types": [
      "steel",
      "fairy"
     ],
     "winrate": 47.8,
     "stats": {
      "hp": 50,
      "atk": 85,
      "def": 85,
      "spa": 55,
      "spd": 55,
      "spe": 50
     },
     "moves": [
      "Play Rough",
      "Sucker Punch",
      "Protect",
      "Iron Head",
      "Swords Dance",
      "Rock Slide"
     ],
     "items": [
      "Mawilite"
     ],
     "abilities": [
      "Intimidate",
      "Hyper Cutter",
      "Sheer Force"
     ],
     "megas": [
      {
       "name": "Mega Mawile",
       "slug": "mawile-mega",
       "types": [
        "steel",
        "fairy"
       ],
       "stats": {
        "hp": 50,
        "atk": 105,
        "def": 125,
        "spa": 55,
        "spd": 95,
        "spe": 50
       },
       "ability": "Huge Power"
      }
     ]
    },
    {
     "rank": 25,
     "name": "Ninetales-Alola",
     "types": [
      "ice",
      "fairy"
     ],
     "winrate": 49.5,
     "stats": {
      "hp": 73,
      "atk": 67,
      "def": 75,
      "spa": 81,
      "spd": 100,
      "spe": 109
     },
     "moves": [
      "Blizzard",
      "Protect",
      "Freeze-Dry",
      "Aurora Veil",
      "Moonblast",
      "Encore"
     ],
     "items": [
      "Light Clay",
      "Focus Sash",
      "Choice Scarf",
      "Never-Melt Ice",
      "Life Orb"
     ],
     "abilities": [
      "Snow Warning",
      "Snow Cloak"
     ]
    }
   ]
  }
 ]
};
const APP_VERSION = "v4 · 2026-07-10";

const SRS = {
  GRADUATE_STEPS: 2,
  GAPS: { again: 2, hard: 5, good: 10 },
  JITTER: 2,
};
const DUEL_TARGETS = [5, 10, 15, 25];
const MIXED_GAP = 10; // |stat difference| at or under this = mixed/balanced

const TYPE_COLORS = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD", unknown: "#8A8DA8",
};

/* Attacking type -> defending type multipliers (Gen 9 chart). */
const TYPE_CHART = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
};
const ALL_TYPES = Object.keys(TYPE_CHART);
function defenseMult(atkType, defTypes) {
  let m = 1;
  defTypes.forEach(d => {
    const v = TYPE_CHART[atkType][d];
    m *= (v === undefined ? 1 : v);
  });
  return m;
}
const multLabel = (m) =>
  m === 0 ? "×0" : m === 0.25 ? "×¼" : m === 0.5 ? "×½" : m === 2 ? "×2" : m === 4 ? "×4" : "—";

const STAT_META = [
  { key: "hp", label: "HP" }, { key: "atk", label: "Atk" }, { key: "def", label: "Def" },
  { key: "spa", label: "SpA" }, { key: "spd", label: "SpD" }, { key: "spe", label: "Spe" },
];
const STAT_LABEL = Object.fromEntries(STAT_META.map(s => [s.key, s.label]));
const STAT_COLOR = { atk: "#E5484D", def: "#E8913A", spa: "#6390F0", spd: "#7AC74C", spe: "#FFCB05" };

const CATEGORIES = [
  { key: "stats", label: "Base Stat Quiz", hint: "drill one stat" },
  { key: "speed", label: "Speed Tier Simulator", hint: "duels, turn order, scarf hunt" },
  { key: "moves", label: "Common Movesets Quiz", hint: "every move over 30% usage" },
  { key: "items", label: "Common Items Quiz", hint: "every item over 10% usage" },
  { key: "builds", label: "Common Builds Quiz", hint: "pick the real nature + EV spread" },
  { key: "abilities", label: "Preferred Abilities Quiz", hint: "multiple choice" },
  { key: "natures", label: "Preferred Natures Quiz", hint: "flip cards" },
  { key: "profile", label: "Physically or Specially Statted Quiz", hint: "offensive or defensive" },
  { key: "typematch", label: "Type Matchup Quiz", hint: "supereffective or resisted" },
  { key: "natureChart", label: "Nature Types Quiz", hint: "all 25 natures, +10%/−10%" },
];
const SELECT_CATS = ["moves", "items", "weak", "resist"];
const MC_CATS = ["abilities", "offense", "defense", "builds"];
const FLIP_CATS = ["stats", "natures", "natureChart"];

const NATURE_CHART = [
  { name: "Adamant", plus: "atk", minus: "spa" },
  { name: "Lonely", plus: "atk", minus: "def" },
  { name: "Brave", plus: "atk", minus: "spe" },
  { name: "Naughty", plus: "atk", minus: "spd" },
  { name: "Bold", plus: "def", minus: "atk" },
  { name: "Impish", plus: "def", minus: "spa" },
  { name: "Relaxed", plus: "def", minus: "spe" },
  { name: "Lax", plus: "def", minus: "spd" },
  { name: "Modest", plus: "spa", minus: "atk" },
  { name: "Mild", plus: "spa", minus: "def" },
  { name: "Quiet", plus: "spa", minus: "spe" },
  { name: "Rash", plus: "spa", minus: "spd" },
  { name: "Calm", plus: "spd", minus: "atk" },
  { name: "Gentle", plus: "spd", minus: "def" },
  { name: "Sassy", plus: "spd", minus: "spe" },
  { name: "Careful", plus: "spd", minus: "spa" },
  { name: "Timid", plus: "spe", minus: "atk" },
  { name: "Hasty", plus: "spe", minus: "def" },
  { name: "Jolly", plus: "spe", minus: "spa" },
  { name: "Naive", plus: "spe", minus: "spd" },
  { name: "Hardy", plus: null, minus: null },
  { name: "Docile", plus: null, minus: null },
  { name: "Serious", plus: null, minus: null },
  { name: "Bashful", plus: null, minus: null },
  { name: "Quirky", plus: null, minus: null },
];

const NATURE_PLUS_SPE = ["Timid", "Jolly", "Hasty", "Naive"];
const NATURE_MINUS_SPE = ["Brave", "Quiet", "Relaxed", "Sassy"];
const natureSpeedMult = (n) =>
  NATURE_PLUS_SPE.includes(n) ? 1.1 : NATURE_MINUS_SPE.includes(n) ? 0.9 : 1;

const WEATHER_META = {
  rain: { label: "Rain", icon: "🌧️", color: "#6390F0", abilities: ["Swift Swim"] },
  sun: { label: "Harsh Sun", icon: "☀️", color: "#EE8130", abilities: ["Chlorophyll"] },
  sand: { label: "Sandstorm", icon: "🌪️", color: "#B6A136", abilities: ["Sand Rush"] },
  snow: { label: "Snow", icon: "❄️", color: "#96D9D6", abilities: ["Slush Rush"] },
};
const WEATHER_SETTERS = {
  "Drizzle": "rain", "Primordial Sea": "rain",
  "Drought": "sun", "Orichalcum Pulse": "sun", "Desolate Land": "sun",
  "Sand Stream": "sand", "Sand Spit": "sand",
  "Snow Warning": "snow",
};

/* ----------------------------- helpers ----------------------------- */

const norm = (e) => (typeof e === "string" ? { name: e, pct: null } : e);
const monTypes = (m) => (m.types && m.types.length ? m.types : ["unknown"]);
const validTypes = (m) => monTypes(m).filter(t => TYPE_CHART[t]);

const MEGA_STONE = /ite(?: [XY])?$/;
const isMegaUser = (m) =>
  (m.items || []).some(e => {
    const n = norm(e).name;
    return MEGA_STONE.test(n) && n !== "Eviolite";
  });

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* EV spread "2/32/0/0/0/32" -> "2 HP / 32 Atk / 32 Spe" (nonzero only). */
const EV_ORDER = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
function evsPretty(evs) {
  const parts = String(evs).split("/").map(s => parseInt(s, 10));
  const out = [];
  parts.forEach((v, i) => { if (v > 0 && EV_ORDER[i]) out.push(v + " " + EV_ORDER[i]); });
  return out.length ? out.join(" / ") : String(evs);
}
/* Nature is currently blank in the source data (Pikalytics bug, reported);
   when it's null the label gracefully shows the spread alone. */
const buildLabel = (b) => (b.nature ? b.nature + " · " : "") + evsPretty(b.evs);

/* Expand a ranked list with Mega Evolution forms (from mon.megas, enriched
   by the fetch script via PokéAPI). Megas inherit the base form's usage
   context, moves, items, and natures; stats, types, and ability are the
   Mega's own. */
function megaEntry(base, mega) {
  return {
    rank: base.rank, name: mega.name, slug: mega.slug, isMega: true,
    types: mega.types, stats: mega.stats,
    usage: base.usage, winrate: base.winrate,
    moves: base.moves, items: base.items,
    abilities: mega.ability ? [{ name: mega.ability, pct: null }] : base.abilities,
    natures: base.natures,
  };
}
/* A Mega is either a PokéAPI-expanded entry (isMega flag) or a ranked row
   whose name contains "Mega" as a word/segment (e.g. "Charizard-Mega-Y",
   "Mega Mawile") — but not Meganium or Yanmega. */
const MEGA_NAME = /(^|[\s-])mega([\s-]|$)/i;
const isMegaEntry = (m) => m.isMega || MEGA_NAME.test(m.name);
/* Order-insensitive name key: "Mega Charizard Y" == "Charizard-Mega-Y". */
const nameKey = (n) => n.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/[\s-]+/).filter(Boolean).sort().join("");

function expandPool(mons, megaMode) {
  const present = new Set(mons.map(m => nameKey(m.name)));
  const all = [];
  mons.forEach(m => {
    all.push(m);
    // Skip PokéAPI-expanded Megas that already exist as their own ranked rows
    (m.megas || []).forEach(g => {
      if (!present.has(nameKey(g.name))) all.push(megaEntry(m, g));
    });
  });
  if (megaMode === "exclude") return all.filter(m => !isMegaEntry(m));
  if (megaMode === "only") return all.filter(isMegaEntry);
  return all;
}

const hasAbility = (mon, name) =>
  (mon.abilities || []).map(norm).some(a => a.name === name || a.name.indexOf(name) === 0);
const boostAbility = (mon, w) =>
  w ? (WEATHER_META[w].abilities.find(a => hasAbility(mon, a)) || null) : null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const offenseProfile = (m) => {
  const d = m.stats.atk - m.stats.spa;
  return Math.abs(d) <= MIXED_GAP ? "Mixed" : d > 0 ? "Physical" : "Special";
};
const defenseProfile = (m) => {
  const d = m.stats.def - m.stats.spd;
  return Math.abs(d) <= MIXED_GAP ? "Balanced" : d > 0 ? "Physical bulk" : "Special bulk";
};

function speedContext(mon, pool) {
  const spe = mon.stats.spe;
  const withStats = pool.filter(m => m.stats);
  const faster = withStats.filter(m => m.stats.spe > spe && m.name !== mon.name)
    .sort((a, b) => a.stats.spe - b.stats.spe)[0];
  const ties = withStats.filter(m => m.stats.spe === spe && m.name !== mon.name);
  const slower = withStats.filter(m => m.stats.spe < spe)
    .sort((a, b) => b.stats.spe - a.stats.spe)[0];
  return { faster, ties, slower };
}

/* --------------------------- deck building --------------------------- */

function buildDeck({ mons, count, cat, statKey, doShuffle, abilSkipMono }) {
  const pool = mons.slice(0, count);
  const cards = [];

  pool.forEach((mon) => {
    if (cat === "stats" && mon.stats) {
      cards.push({ mon, cat, statKey });
    } else if (cat === "natures" && mon.natures && mon.natures.length) {
      cards.push({ mon, cat });
    } else if (cat === "moves") {
      const list = (mon.moves || []).map(norm);
      if (list.some(e => e.pct != null)) {
        cards.push({
          mon, cat,
          entries: shuffle(list),
          target: list.filter(e => e.pct != null && e.pct > 30).map(e => e.name),
        });
      }
    } else if (cat === "items") {
      const own = (mon.items || []).map(norm);
      if (own.some(e => e.pct != null)) {
        const ownNames = new Set(own.map(e => e.name));
        const distractors = shuffle([...new Set(
          pool.filter(m => m.name !== mon.name)
            .flatMap(m => (m.items || []).map(norm).map(e => e.name))
            .filter(n => !ownNames.has(n))
        )]);
        const entries = own.slice(0, 8).map(e => ({ ...e }));
        while (entries.length < 8 && distractors.length) {
          entries.push({ name: distractors.shift(), pct: null, distractor: true });
        }
        cards.push({
          mon, cat,
          entries: shuffle(entries),
          target: own.filter(e => e.pct != null && e.pct > 10).map(e => e.name),
        });
      }
    } else if (cat === "builds") {
      const own = (mon.builds || [])[0];
      if (own) {
        const correct = buildLabel(own);
        const distractors = shuffle([...new Set(
          pool.filter(m => m.name !== mon.name)
            .map(m => (m.builds || [])[0]).filter(Boolean)
            .map(buildLabel).filter(l => l !== correct)
        )]).slice(0, 3);
        if (distractors.length) {
          cards.push({ mon, cat, options: shuffle([correct, ...distractors]), correct, buildPct: own.pct });
        }
      }
    } else if (cat === "abilities") {
      const own = (mon.abilities || []).map(norm);
      if (own.length && !(abilSkipMono && own.length < 2)) {
        let options = own.map(e => e.name);
        if (options.length < 3) {
          const others = shuffle([...new Set(
            pool.filter(m => m.name !== mon.name)
              .flatMap(m => (m.abilities || []).map(norm).map(e => e.name))
              .filter(n => !options.includes(n))
          )]);
          while (options.length < 3 && others.length) options.push(others.shift());
        }
        cards.push({ mon, cat, options: shuffle(options.slice(0, 4)), correct: own[0].name });
      }
    } else if (cat === "offense" && mon.stats) {
      cards.push({ mon, cat, options: ["Physical", "Special", "Mixed"], correct: offenseProfile(mon) });
    } else if (cat === "defense" && mon.stats) {
      cards.push({ mon, cat, options: ["Physical bulk", "Special bulk", "Balanced"], correct: defenseProfile(mon) });
    }
  });

  if (cat === "weak" || cat === "resist") {
    const eff = (a, d) => (TYPE_CHART[a][d] === undefined ? 1 : TYPE_CHART[a][d]);
    ALL_TYPES.forEach(t => {
      const target = cat === "weak"
        ? ALL_TYPES.filter(d => eff(t, d) > 1)
        : ALL_TYPES.filter(a => eff(a, t) < 1);
      cards.push({ type: t, cat, target });
    });
  }

  if (cat === "natureChart") {
    NATURE_CHART.forEach(n => cards.push({ nature: n, cat: "natureChart" }));
  }

  const deck = doShuffle ? shuffle(cards) : cards;
  return deck.map((c, i) => ({
    id: `${c.mon ? c.mon.name : c.nature ? c.nature.name : c.type}|${c.cat}|${i}`,
    card: c, step: 0, lapses: 0, reviews: 0,
  }));
}

/* -------------------------- PokéAPI sprites -------------------------- */

const SLUG_OVERRIDES = {
  "calyrex-shadow": "calyrex-shadow-rider",
  "calyrex-ice": "calyrex-ice-rider",
  "indeedee-f": "indeedee-female",
  "indeedee-m": "indeedee-male",
  "tornadus": "tornadus-incarnate",
  "thundurus": "thundurus-incarnate",
  "landorus": "landorus-incarnate",
  "enamorus": "enamorus-incarnate",
  "basculegion": "basculegion-male",
  "maushold": "maushold-family-of-four",
  "urshifu": "urshifu-single-strike",
  "urshifu-rapid-strike": "urshifu-rapid-strike",
  "giratina": "giratina-altered",
  "zygarde": "zygarde-50",
  "keldeo": "keldeo-ordinary",
  "mimikyu": "mimikyu-disguised",
  "toxtricity": "toxtricity-amped",
};

const spriteCache = {};

async function resolveSprite(name, slugHint) {
  const key = (slugHint || name).toLowerCase();
  if (spriteCache[key] !== undefined) return spriteCache[key];
  const slug0 = slugHint || key.replace(/[.'’%]/g, "").replace(/\s+/g, "-");
  const slug = SLUG_OVERRIDES[slug0] || slug0;

  const artworkFrom = async (s) => {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${s}`);
    if (!r.ok) throw new Error("404");
    const j = await r.json();
    return (
      (j.sprites && j.sprites.other && j.sprites.other["official-artwork"] &&
        j.sprites.other["official-artwork"].front_default) ||
      (j.sprites && j.sprites.front_default) || null
    );
  };

  let url = null;
  try {
    url = await artworkFrom(slug);
  } catch {
    try {
      const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug0.split("-")[0]}`);
      if (r.ok) {
        const j = await r.json();
        const v = (j.varieties || []).find(x => x.is_default) || (j.varieties || [])[0];
        if (v) url = await artworkFrom(v.pokemon.name);
      }
    } catch { /* offline — orb fallback */ }
  }
  spriteCache[key] = url;
  return url;
}

function MonSprite({ mon, size = 56 }) {
  const key = (mon.slug || mon.name).toLowerCase();
  const [url, setUrl] = useState(spriteCache[key]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    if (spriteCache[key] !== undefined) setUrl(spriteCache[key]);
    else resolveSprite(mon.name, mon.slug).then(u => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [key]);

  if (!url || failed) {
    return <TypeOrb types={monTypes(mon)} size={size} text={mon.name[0]} />;
  }
  return (
    <img
      src={url} alt={mon.name} width={size} height={size} draggable={false}
      onError={() => setFailed(true)}
      style={{ objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 3px 5px rgba(0,0,0,.3))" }}
    />
  );
}

/* ----------------------------- atoms ----------------------------- */

function TypeOrb({ types, size = 44, text }) {
  const t = types && types.length ? types : ["unknown"];
  const c1 = TYPE_COLORS[t[0]] || TYPE_COLORS.unknown;
  const c2 = TYPE_COLORS[t[1] || t[0]] || TYPE_COLORS.unknown;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c1} 0%, ${c1} 48%, ${c2} 52%, ${c2} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.35)",
      flexShrink: 0,
    }} aria-hidden="true">
      <span style={{
        fontFamily: "var(--display)", fontWeight: 800, color: "rgba(255,255,255,.95)",
        fontSize: size * 0.42, textShadow: "0 1px 2px rgba(0,0,0,.4)", letterSpacing: ".02em",
      }}>{text}</span>
    </div>
  );
}

function TypeChip({ t }) {
  return (
    <span style={{
      background: TYPE_COLORS[t] || TYPE_COLORS.unknown, color: "#fff", borderRadius: 4,
      padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
      textTransform: "uppercase", textShadow: "0 1px 1px rgba(0,0,0,.35)",
    }}>{t}</span>
  );
}

function NatureOrb({ nature, size = 44 }) {
  const c1 = nature.plus ? STAT_COLOR[nature.plus] : "#8A8DA8";
  const c2 = nature.minus ? STAT_COLOR[nature.minus] : "#8A8DA8";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c1} 0%, ${c1} 48%, ${c2} 52%, ${c2} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.35)",
      flexShrink: 0,
    }} aria-hidden="true">
      <span style={{
        fontFamily: "var(--display)", fontWeight: 800, color: "rgba(255,255,255,.95)",
        fontSize: size * 0.42, textShadow: "0 1px 2px rgba(0,0,0,.4)",
      }}>{nature.name[0]}</span>
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,.045)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 14, padding: "16px 16px", marginBottom: 14,
};
const panelHeadStyle = {
  display: "flex", alignItems: "baseline", justifyContent: "space-between",
  fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".12em",
  textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginBottom: 12,
};

function SubPill({ active, onClick, children, small, activeColor }) {
  const c = activeColor || "var(--gold)";
  return (
    <button onClick={onClick} style={{
      background: active ? c : "rgba(255,255,255,.06)",
      color: active ? "#1B1D36" : "rgba(255,255,255,.75)",
      border: "1px solid " + (active ? c : "rgba(255,255,255,.15)"),
      borderRadius: 999, padding: small ? "4px 10px" : "5px 12px",
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: "pointer",
    }}>{children}</button>
  );
}

/* ----------------------------- config screen ----------------------------- */

function ConfigScreen({ formats, generated, live, onStart }) {
  const games = useMemo(() => [...new Set(formats.map(f => f.game))], [formats]);
  const [gameLabel, setGameLabel] = useState(games[0]);
  const regs = formats.filter(f => f.game === gameLabel);
  const [regIdx, setRegIdx] = useState(0);
  const reg = regs[Math.min(regIdx, regs.length - 1)];

  const [cat, setCat] = useState("stats");
  const [statKey, setStatKey] = useState("spe");
  const [typeMatchKey, setTypeMatchKey] = useState("weak");
  const [profileKey, setProfileKey] = useState("offense");
  const [abilSkipMono, setAbilSkipMono] = useState(true);
  const [count, setCount] = useState(20);
  const [megaMode, setMegaMode] = useState("include"); // include | exclude | only
  // speed matchups options
  const [duelVariant, setDuelVariant] = useState("faster");
  const [duelTarget, setDuelTarget] = useState(10);
  const [duelHard, setDuelHard] = useState(false);
  const [duelNatures, setDuelNatures] = useState(false);

  const availableMons = expandPool(reg.mons, megaMode);
  const maxMons = availableMons.length;
  const effCount = Math.max(1, Math.min(count, maxMons));
  const pool = availableMons.slice(0, effCount);

  const catAvailable = (key) => {
    if (!pool.length) return false;
    if (key === "natureChart") return true;
    if (key === "stats" || key === "speed" || key === "offense" || key === "defense")
      return pool.some(m => m.stats);
    if (key === "typematch") return true;
    if (key === "profile") return pool.some(m => m.stats);
    if (key === "builds") return pool.some(m => m.builds && m.builds.length);
    if (key === "moves") return pool.some(m => (m.moves || []).map(norm).some(e => e.pct != null));
    if (key === "items") return pool.some(m => (m.items || []).map(norm).some(e => e.pct != null));
    return pool.some(m => m[key] && m[key].length);
  };

  const duelPool = pool.filter(m => m.stats);
  const effCat = cat === "typematch" ? typeMatchKey : cat === "profile" ? profileKey : cat;
  const deckPreview = cat !== "speed" && catAvailable(cat)
    ? buildDeck({ mons: availableMons, count: effCount, cat: effCat, statKey, doShuffle: false, abilSkipMono })
    : [];
  const canStart = cat === "speed"
    ? duelPool.length >= (duelVariant === "faster" ? 2 : 4)
    : deckPreview.length > 0;

  const startLabel = cat === "speed"
    ? (duelVariant === "order" ? (duelHard ? "Start hard mode" : "Start turn order")
      : duelVariant === "scarf" ? "Start scarf hunt" : "Start speed duel")
    : "Start drilling";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 18px 40px" }}>
      {/* hero */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".14em",
          color: "var(--gold)", textTransform: "uppercase", marginBottom: 6,
        }}>{gameLabel} · {reg.label}</div>
        <h1 style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 42, lineHeight: 1,
          margin: 0, color: "#fff", letterSpacing: ".01em", textTransform: "uppercase",
        }}>VGC Meta Blitz</h1>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,.35)", marginTop: 4 }}>
          {APP_VERSION}
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "10px 0 0", lineHeight: 1.5 }}>
          Study what the ladder is actually running — quizzes, games, and
          spaced-repetition flashcards built from live usage data.
        </p>
      </div>

      {/* format */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}><span>Regulation</span></div>
        {games.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {games.map(g => {
              const on = g === gameLabel;
              return (
                <button key={g} onClick={() => { setGameLabel(g); setRegIdx(0); }} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                  background: on ? "rgba(255,203,5,.12)" : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${on ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                }}>{g}</button>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {regs.map((r, idx) => {
            const on = idx === Math.min(regIdx, regs.length - 1);
            return (
              <button key={r.id} onClick={() => setRegIdx(idx)} style={{
                borderRadius: 999, padding: "6px 13px", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                background: on ? "var(--gold)" : "rgba(255,255,255,.06)",
                color: on ? "#1B1D36" : "rgba(255,255,255,.85)",
                border: "1px solid " + (on ? "var(--gold)" : "rgba(255,255,255,.15)"),
              }}>{r.label}</button>
            );
          })}
        </div>
        {reg.noteText && (
          <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)" }}>
            {reg.noteText}
          </div>
        )}
      </section>

      {/* pool */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}>
          <span>Top Pokémon to study</span>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 30,
            color: "var(--gold)", lineHeight: 1,
          }}>{maxMons ? effCount : 0}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[
            { id: "include", t: "Include Megas" },
            { id: "exclude", t: "No Megas" },
            { id: "only", t: "Megas only" },
          ].map(p => (
            <SubPill key={p.id} active={megaMode === p.id} onClick={() => setMegaMode(p.id)}>
              {p.t}
            </SubPill>
          ))}
        </div>
        {maxMons === 0 ? (
          <div style={{ color: "#FFD84D", fontSize: 13 }}>
            No {megaMode === "only" ? "Mega form data" : "Pokémon"} in this regulation yet.
          </div>
        ) : (
          <>
            <input
              type="range" min={Math.min(5, maxMons)} max={maxMons} step={1} value={effCount}
              onChange={e => setCount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#FFCB05" }}
              aria-label="Number of top Pokémon to study"
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
              {pool.map(m => (
                <TypeOrb key={m.name} types={monTypes(m)} size={26} text={m.name[0]} />
              ))}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              Top {effCount} by usage{megaMode !== "include" ? ` (${megaMode === "only" ? "Mega users only" : "Megas excluded"})` : ""} · last is {pool[pool.length - 1].name}
            </div>
          </>
        )}
      </section>

      {/* what to drill */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}><span>What to drill</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CATEGORIES.map(c => {
            const unavailable = !catAvailable(c.key);
            const on = c.key === cat && !unavailable;
            return (
              <div key={c.key}>
                <button
                  onClick={() => !unavailable && setCat(c.key)}
                  disabled={unavailable}
                  style={{
                    width: "100%", textAlign: "left",
                    cursor: unavailable ? "default" : "pointer",
                    opacity: unavailable ? 0.45 : 1,
                    background: on ? "rgba(255,203,5,.10)" : "rgba(255,255,255,.04)",
                    border: `1.5px solid ${on ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                    borderRadius: 10, padding: "11px 14px", color: "#fff",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${on ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--gold)" }} />}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{c.label}</span>
                  <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: "auto", textAlign: "right" }}>
                    {unavailable
                      ? (["moves", "items", "builds"].includes(c.key)
                        ? "needs usage % — arrives with the first data pull"
                        : "no data in this snapshot yet")
                      : c.hint}
                  </span>
                </button>

                {c.key === "stats" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>Drill one stat:</span>
                    {STAT_META.map(s => (
                      <SubPill key={s.key} small active={statKey === s.key} onClick={() => setStatKey(s.key)}>
                        {s.label}
                      </SubPill>
                    ))}
                  </div>
                )}

                {c.key === "profile" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <SubPill small active={profileKey === "offense"} onClick={() => setProfileKey("offense")}>
                      Offensive
                    </SubPill>
                    <SubPill small active={profileKey === "defense"} onClick={() => setProfileKey("defense")}>
                      Defensive
                    </SubPill>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {profileKey === "offense" ? "physical, special, or mixed?" : "which side is bulkier?"}
                    </span>
                  </div>
                )}

                {c.key === "typematch" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <SubPill small active={typeMatchKey === "weak"} onClick={() => setTypeMatchKey("weak")}>
                      Supereffective
                    </SubPill>
                    <SubPill small active={typeMatchKey === "resist"} onClick={() => setTypeMatchKey("resist")}>
                      Resisted
                    </SubPill>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {typeMatchKey === "weak" ? "what the type hits hard" : "what the type resists"}
                    </span>
                  </div>
                )}

                {c.key === "abilities" && on && (
                  <label
                    style={{ margin: "8px 0 4px 30px", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13, cursor: "pointer" }}
                    onClick={() => setAbilSkipMono(v => !v)}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${abilSkipMono ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                      background: abilSkipMono ? "var(--gold)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1B1D36", fontSize: 10, fontWeight: 900,
                    }}>{abilSkipMono ? "✓" : ""}</span>
                    Skip Pokémon with only one tracked ability
                  </label>
                )}

                {c.key === "speed" && on && (
                  <div style={{
                    margin: "8px 0 4px 30px", padding: "12px",
                    background: "rgba(255,255,255,.03)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.08)",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { id: "faster", title: "1v1 Duel", sub: "pick the faster mon" },
                        { id: "order", title: "2v2 Turn Order", sub: "order all four" },
                        { id: "scarf", title: "Find the Scarf", sub: "who's holding it?" },
                      ].map(v => {
                        const von = duelVariant === v.id;
                        return (
                          <button key={v.id} onClick={() => setDuelVariant(v.id)} style={{
                            flex: 1, padding: "9px 8px", borderRadius: 10, cursor: "pointer",
                            background: von ? "rgba(255,203,5,.12)" : "rgba(255,255,255,.04)",
                            border: `1.5px solid ${von ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                            color: "#fff", display: "flex", flexDirection: "column", gap: 2,
                          }}>
                            <span style={{ fontWeight: 800, fontSize: 13.5 }}>{v.title}</span>
                            <span style={{ color: "var(--muted)", fontSize: 11 }}>{v.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                    {duelVariant !== "faster" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13.5, cursor: "pointer" }}
                          onClick={() => setDuelHard(v => !v)}>
                          <span style={{
                            width: 16, height: 16, borderRadius: 4,
                            border: `2px solid ${duelHard ? "#E5484D" : "rgba(255,255,255,.35)"}`,
                            background: duelHard ? "#E5484D" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 10, fontWeight: 900,
                          }}>{duelHard ? "✓" : ""}</span>
                          🔥 {duelVariant === "scarf" ? "More effects" : "Hard mode"}
                          <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: "auto" }}>
                            {duelVariant === "scarf" ? "Tailwind · PAR · weather · TR" : "Scarf · Tailwind · PAR · weather · TR"}
                          </span>
                        </label>
                        {duelHard && (
                          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13.5, cursor: "pointer", paddingLeft: 24 }}
                            onClick={() => setDuelNatures(v => !v)}>
                            <span style={{
                              width: 16, height: 16, borderRadius: 4,
                              border: `2px solid ${duelNatures ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                              background: duelNatures ? "var(--gold)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#1B1D36", fontSize: 10, fontWeight: 900,
                            }}>{duelNatures ? "✓" : ""}</span>
                            ± Speed natures
                            <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: "auto" }}>
                              ×1.1 / ×0.9
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                    <div>
                      <div style={{ ...panelHeadStyle, marginBottom: 8 }}><span>Wins to finish</span></div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {DUEL_TARGETS.map(tg => {
                          const ton = duelTarget === tg;
                          return (
                            <button key={tg} onClick={() => setDuelTarget(tg)} style={{
                              flex: 1, padding: "9px 4px", borderRadius: 10, cursor: "pointer",
                              background: ton ? "var(--gold)" : "rgba(255,255,255,.05)",
                              border: `1.5px solid ${ton ? "var(--gold)" : "rgba(255,255,255,.14)"}`,
                              color: ton ? "#1B1D36" : "#fff",
                              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1,
                            }}>{tg}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <button
        disabled={!canStart}
        onClick={() => onStart(cat === "speed"
          ? { type: "duel", reg, pool: duelPool, duelCfg: { target: duelTarget, variant: duelVariant, hard: duelHard, natures: duelHard && duelNatures } }
          : { type: "flash", reg, pool, deckCfg: { mons: availableMons, count: effCount, cat: effCat, statKey, doShuffle: true, abilSkipMono } }
        )}
        style={{
          width: "100%", marginTop: 6, padding: "16px", borderRadius: 12, border: "none",
          background: !canStart ? "rgba(255,255,255,.12)" : "var(--gold)",
          color: !canStart ? "rgba(255,255,255,.4)" : "#1B1D36",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, letterSpacing: ".06em",
          textTransform: "uppercase", cursor: !canStart ? "default" : "pointer",
          boxShadow: !canStart ? "none" : "0 4px 18px rgba(255,203,5,.35)",
        }}
      >
        {startLabel}
      </button>

      <p style={{
        color: "var(--muted)", fontSize: 11.5, marginTop: 18, lineHeight: 1.6,
        borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 12,
      }}>
        {reg.source}. Data as of {generated}
        {live ? " (auto-refreshed nightly)" : " (bundled snapshot — deploy for nightly refresh)"}.
        {" "}Artwork from PokéAPI. Flip cards use Again/Hard/Good/Easy grading (two Goods or one Easy clears a
        card); checkable quizzes grade themselves — correct clears the card, a miss requeues it.
      </p>
    </div>
  );
}

/* ----------------------- quiz game sub-components ----------------------- */

function SelectRows({ entries, target, picks, onToggle, submitted, threshold }) {
  const targetSet = new Set(target);
  let right = 0, wrong = 0, missed = 0;
  if (submitted) {
    entries.forEach(e => {
      const isT = targetSet.has(e.name), isP = picks.has(e.name);
      if (isT && isP) right++;
      else if (!isT && isP) wrong++;
      else if (isT && !isP) missed++;
    });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {submitted && (
        <div style={{
          fontSize: 13.5, fontWeight: 800, marginBottom: 4,
          color: wrong + missed === 0 ? "#1E7A4D" : "#C0353A",
        }}>
          {wrong + missed === 0 ? "Perfect! 🎯" : `${right} right · ${missed} missed · ${wrong} wrong`}
        </div>
      )}
      {entries.map(e => {
        const isP = picks.has(e.name);
        const isT = targetSet.has(e.name);
        let bg = "#fff", border = "#D5D8E4", color = "#22243E";
        if (!submitted && isP) { border = "#C9A100"; bg = "rgba(255,203,5,.15)"; }
        if (submitted) {
          if (isT && isP) { border = "#30A46C"; bg = "rgba(48,164,108,.12)"; }
          else if (!isT && isP) { border = "#E5484D"; bg = "rgba(229,72,77,.10)"; }
          else if (isT && !isP) { border = "#E8913A"; bg = "rgba(232,145,58,.14)"; }
          else { color = "#9DA0B8"; }
        }
        return (
          <button
            key={e.name}
            onClick={() => onToggle(e.name)}
            disabled={submitted}
            style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              background: bg, border: `1.5px solid ${border}`, borderRadius: 9,
              padding: "9px 12px", cursor: submitted ? "default" : "pointer", color,
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: `2px solid ${isP ? "#C9A100" : "#B7BACB"}`,
              background: isP ? "#FFCB05" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900, color: "#1B1D36",
            }}>{isP ? "✓" : ""}</span>
            <span style={{ fontSize: 15, fontWeight: submitted && isT ? 800 : 600 }}>{e.name}</span>
            {submitted && (
              <span style={{
                marginLeft: "auto", display: "flex", flexDirection: "column",
                alignItems: "flex-end", gap: 3, flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 12.5, fontWeight: 700,
                  color: isT ? "#1E7A4D" : "#9DA0B8",
                }}>
                  {e.pct != null ? `${e.pct}%` : (e.distractor ? "other mons" : "—")}
                  {isT && !isP ? " · missed" : ""}
                </span>
                {e.pct != null && (
                  <span style={{
                    width: 46, height: 4, borderRadius: 999,
                    background: "#E4E6F0", overflow: "hidden", display: "block",
                  }}>
                    <span style={{
                      display: "block", width: `${Math.min(100, e.pct)}%`, height: "100%",
                      background: isT ? "#30A46C" : "#B7BACB",
                    }} />
                  </span>
                )}
              </span>
            )}
          </button>
        );
      })}
      {!submitted && (
        <div style={{ fontSize: 11.5, color: "#9DA0B8", marginTop: 2 }}>
          Select everything over {threshold}% usage, then check below.
        </div>
      )}
    </div>
  );
}

function TypeGridSelect({ multOf, target, picks, onToggle, submitted }) {
  const targetSet = new Set(target);
  let right = 0, wrong = 0, missed = 0;
  if (submitted) {
    ALL_TYPES.forEach(tp => {
      const isT = targetSet.has(tp), isP = picks.has(tp);
      if (isT && isP) right++;
      else if (!isT && isP) wrong++;
      else if (isT && !isP) missed++;
    });
  }
  return (
    <div>
      {submitted && (
        <div style={{
          fontSize: 13.5, fontWeight: 800, marginBottom: 8,
          color: wrong + missed === 0 ? "#1E7A4D" : "#C0353A",
        }}>
          {wrong + missed === 0 ? "Perfect! 🎯" : `${right} right · ${missed} missed · ${wrong} wrong`}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {ALL_TYPES.map(tp => {
          const isP = picks.has(tp);
          const isT = targetSet.has(tp);
          const mult = multOf(tp);
          let ring = "transparent", dim = false;
          if (!submitted && isP) ring = "#FFCB05";
          if (submitted) {
            if (isT && isP) ring = "#30A46C";
            else if (!isT && isP) ring = "#E5484D";
            else if (isT && !isP) ring = "#E8913A";
            else dim = true;
          }
          return (
            <button
              key={tp}
              onClick={() => onToggle(tp)}
              disabled={submitted}
              style={{
                background: TYPE_COLORS[tp], color: "#fff", borderRadius: 7,
                padding: "6px 9px", fontSize: 11.5, fontWeight: 800,
                letterSpacing: ".06em", textTransform: "uppercase",
                textShadow: "0 1px 1px rgba(0,0,0,.35)",
                border: "none", outline: `3px solid ${ring}`,
                cursor: submitted ? "default" : "pointer",
                opacity: dim ? 0.35 : 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                minWidth: 62,
              }}
            >
              <span>{tp}</span>
              {submitted && (
                <span style={{ fontSize: 10.5, fontFamily: "var(--mono)", fontWeight: 700 }}>
                  {multLabel(mult)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const abilityBlurbCache = {};
function AbilityBlurb({ name }) {
  const key = name.toLowerCase();
  const [text, setText] = useState(abilityBlurbCache[key]);
  useEffect(() => {
    let alive = true;
    if (abilityBlurbCache[key] !== undefined) { setText(abilityBlurbCache[key]); return; }
    const slug = key.replace(/[.'’()]/g, "").trim().replace(/\s+/g, "-");
    fetch(`https://pokeapi.co/api/v2/ability/${slug}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => {
        const en = (j.effect_entries || []).find(e => e.language && e.language.name === "en");
        const blurb = en ? (en.short_effect || en.effect || "") : "";
        abilityBlurbCache[key] = blurb || null;
        if (alive) setText(blurb || null);
      })
      .catch(() => { abilityBlurbCache[key] = null; if (alive) setText(null); });
    return () => { alive = false; };
  }, [key]);
  if (!text) return null;
  return (
    <div style={{
      marginTop: 6, fontSize: 13.5, color: "#4A4D6B",
      borderLeft: "3px solid #FFCB05", paddingLeft: 12, lineHeight: 1.6,
    }}>
      <b>{name}:</b> {text}
    </div>
  );
}

function MCOptions({ card, picked, onPick, submitted }) {
  const { options, correct, mon, cat } = card;
  const ownPct = cat === "abilities"
    ? Object.fromEntries((mon.abilities || []).map(norm).map(e => [e.name, e.pct]))
    : {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => {
        const isC = opt === correct;
        const isP = picked === opt;
        let bg = "#fff", border = "#D5D8E4", color = "#22243E";
        if (submitted) {
          if (isC) { border = "#30A46C"; bg = "rgba(48,164,108,.12)"; }
          else if (isP) { border = "#E5484D"; bg = "rgba(229,72,77,.10)"; }
          else { color = "#9DA0B8"; }
        }
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            disabled={submitted}
            style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              background: bg, border: `1.5px solid ${border}`, borderRadius: 9,
              padding: "11px 13px", cursor: submitted ? "default" : "pointer",
              color, fontSize: 15.5, fontWeight: submitted && isC ? 800 : 600,
            }}
          >
            {opt}
            {submitted && cat === "abilities" && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: isC ? "#1E7A4D" : "#9DA0B8" }}>
                {ownPct[opt] != null ? `${ownPct[opt]}%`
                  : Object.prototype.hasOwnProperty.call(ownPct, opt) ? "runs it" : "not this mon"}
              </span>
            )}
            {submitted && cat === "builds" && isC && card.buildPct != null && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: "#1E7A4D" }}>
                {card.buildPct}% of builds
              </span>
            )}
            {submitted && isC && cat !== "abilities" && cat !== "builds" && (
              <span style={{ marginLeft: "auto", fontSize: 13 }}>✓</span>
            )}
          </button>
        );
      })}
      {submitted && (cat === "offense" || cat === "defense") && (
        <div style={{
          marginTop: 6, fontSize: 14, color: "#4A4D6B",
          borderLeft: "3px solid #FFCB05", paddingLeft: 12, lineHeight: 1.7,
        }}>
          {cat === "offense"
            ? <span><b>Atk {mon.stats.atk}</b> vs <b>SpA {mon.stats.spa}</b> (within {MIXED_GAP} = mixed)</span>
            : <span><b>Def {mon.stats.def}</b> vs <b>SpD {mon.stats.spd}</b> (within {MIXED_GAP} = balanced)</span>}
        </div>
      )}
      {submitted && cat === "abilities" && <AbilityBlurb name={correct} />}
      {!submitted && (
        <div style={{ fontSize: 11.5, color: "#9DA0B8" }}>Tap your answer.</div>
      )}
    </div>
  );
}

/* ----------------------------- quiz screen ----------------------------- */

const CAT_PROMPT = {
  natures: "Most common natures?",
  natureChart: "Raises what, lowers what?",
  moves: "Select every move over 30% usage",
  items: "Select every item over 10% usage",
  abilities: "Most common ability?",
  builds: "Which is its most common build?",
  offense: "Physical, special, or mixed attacker?",
  defense: "Physically or specially bulkier?",
};
const CAT_SHORT = {
  natureChart: "nature", weak: "super effective", resist: "resists", builds: "build",
  offense: "offense", defense: "defense", abilities: "ability",
};

const GRADES = [
  { key: "again", label: "Again", color: "#E5484D" },
  { key: "hard", label: "Hard", color: "#E8913A" },
  { key: "good", label: "Good", color: "#30A46C" },
  { key: "easy", label: "Easy", color: "#4A8FE7" },
];

function QuizScreen({ initialQueue, pool, reg, onDone, onQuit }) {
  const total = initialQueue.length;
  const [queue, setQueue] = useState(initialQueue);
  const [doneCards, setDoneCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [picks, setPicks] = useState(new Set());
  const [wasRight, setWasRight] = useState(false);

  const item = queue[0];

  const gradeHint = (g) => {
    if (!item) return "";
    if (g === "easy") return "done ✓";
    if (g === "good") return item.step + 1 >= SRS.GRADUATE_STEPS ? "done ✓" : `~${SRS.GAPS.good} cards`;
    if (g === "hard") return `~${SRS.GAPS.hard} cards`;
    return `~${SRS.GAPS.again} cards`;
  };

  const grade = (g) => {
    if (!item) return;
    const nextLog = { ...log, [g]: log[g] + 1 };
    const rest = queue.slice(1);
    const updated = { ...item, reviews: item.reviews + 1 };

    let graduated = false;
    if (g === "easy") graduated = true;
    else if (g === "good") {
      updated.step = item.step + 1;
      graduated = updated.step >= SRS.GRADUATE_STEPS;
    } else if (g === "hard") {
      updated.step = item.step;
    } else {
      updated.step = 0;
      updated.lapses = item.lapses + 1;
    }

    if (graduated) {
      const nextDone = [...doneCards, updated];
      if (rest.length === 0) { onDone({ done: nextDone, log: nextLog, total }); return; }
      setDoneCards(nextDone);
      setQueue(rest);
    } else {
      const gap = SRS.GAPS[g] + Math.floor(Math.random() * (SRS.JITTER + 1));
      const pos = Math.min(gap, rest.length);
      setQueue([...rest.slice(0, pos), updated, ...rest.slice(pos)]);
    }
    setLog(nextLog);
    setFlipped(false);
    setPicks(new Set());
    setWasRight(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!item) return;
      const isFlip = FLIP_CATS.includes(item.card.cat);
      if (e.key === " " || e.key === "Enter") {
        if (isFlip && !flipped) { e.preventDefault(); setFlipped(true); }
        else if (!isFlip && flipped) { e.preventDefault(); grade(wasRight ? "easy" : "again"); }
      } else if (flipped && isFlip && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        grade(GRADES[Number(e.key) - 1].key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!item) return null;
  const { card } = item;
  const isFlipCat = FLIP_CATS.includes(card.cat);
  const isSelectCat = SELECT_CATS.includes(card.cat);
  const isMcCat = MC_CATS.includes(card.cat);
  const newCount = queue.filter(q => q.reviews === 0).length;
  const learningCount = queue.length - newCount;

  const prompt = card.cat === "stats"
    ? `Base ${STAT_LABEL[card.statKey]}?`
    : card.cat === "weak"
      ? `Select every type ${card.type.toUpperCase()} hits super effectively`
      : card.cat === "resist"
        ? `Select every attacking type ${card.type.toUpperCase()} resists (incl. immunities)`
        : CAT_PROMPT[card.cat];

  const stateChip = item.reviews === 0
    ? { text: "new", color: "#4A8FE7" }
    : item.lapses > 0 && item.step === 0
      ? { text: "relearning", color: "#E5484D" }
      : { text: `learning ${item.step}/${SRS.GRADUATE_STEPS}`, color: "#E8913A" };

  const togglePick = (name) => {
    if (flipped) return;
    setPicks(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };
  const mcPick = (opt) => {
    if (flipped) return;
    setPicks(new Set([opt]));
    setWasRight(opt === card.correct);
    setFlipped(true);
  };
  const checkSelection = () => {
    const names = (card.cat === "weak" || card.cat === "resist")
      ? ALL_TYPES
      : card.entries.map(e => e.name);
    const targetSet = new Set(card.target);
    setWasRight(names.every(n => targetSet.has(n) === picks.has(n)));
    setFlipped(true);
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(doneCards.length / total) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
      </div>
      <div style={{
        display: "flex", gap: 14, justifyContent: "flex-end", marginBottom: 12,
        fontFamily: "var(--mono)", fontSize: 12,
      }}>
        <span style={{ color: "#7FB0F0" }}>{newCount} new</span>
        <span style={{ color: "#F0A45C" }}>{learningCount} learning</span>
        <span style={{ color: "#6FCF97" }}>{doneCards.length} done</span>
      </div>

      <div
        role={isFlipCat ? "button" : undefined}
        tabIndex={isFlipCat ? 0 : undefined}
        aria-label={isFlipCat ? (flipped ? "Answer shown" : "Tap to reveal answer") : undefined}
        onClick={() => { if (isFlipCat) setFlipped(true); }}
        onKeyDown={e => { if (isFlipCat && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setFlipped(true); } }}
        style={{
          background: "#F5F6FA", borderRadius: 18, minHeight: 380,
          padding: "22px 20px", color: "#22243E",
          cursor: isFlipCat && !flipped ? "pointer" : "default",
          boxShadow: "0 10px 30px rgba(0,0,0,.45), 0 2px 0 rgba(255,255,255,.15) inset",
          display: "flex", flexDirection: "column",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {card.mon ? <MonSprite mon={card.mon} size={56} />
            : card.nature ? <NatureOrb nature={card.nature} size={56} />
            : <TypeOrb types={[card.type]} size={56} text={card.type[0].toUpperCase()} />}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 30, lineHeight: 1.02,
              textTransform: "uppercase", letterSpacing: ".01em", overflowWrap: "anywhere",
            }}>{card.mon ? card.mon.name : card.nature ? card.nature.name : cap(card.type)}</div>
            {card.mon ? (
              <div style={{ display: "flex", gap: 6, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
                {monTypes(card.mon).filter(t => t !== "unknown").map(t => <TypeChip key={t} t={t} />)}
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                  usage #{card.mon.rank}{card.mon.usage != null ? ` · ${card.mon.usage}%` : ""}
                </span>
                {reg.hasWinrate && card.mon.winrate != null && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                    · {card.mon.winrate}% WR
                  </span>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 5, display: "flex", gap: 6, alignItems: "center" }}>
                {card.type && <TypeChip t={card.type} />}
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                  {card.type ? "type matchup" : "nature chart"}
                </span>
              </div>
            )}
          </div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10.5, color: stateChip.color,
            border: `1px solid ${stateChip.color}`, borderRadius: 999, padding: "3px 9px",
            whiteSpace: "nowrap", alignSelf: "flex-start",
          }}>{stateChip.text}</span>
        </div>

        <div style={{ height: 1, background: "#DDDFEA", margin: "16px 0" }} />

        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
          textTransform: "uppercase", color: "#8A8DA8", marginBottom: 10,
        }}>{prompt}</div>

        {isSelectCat && (card.cat === "weak" || card.cat === "resist") ? (
          <TypeGridSelect
            multOf={(tp) => {
              const eff = (a, d) => (TYPE_CHART[a][d] === undefined ? 1 : TYPE_CHART[a][d]);
              return card.cat === "weak" ? eff(card.type, tp) : eff(tp, card.type);
            }}
            target={card.target}
            picks={picks}
            onToggle={togglePick}
            submitted={flipped}
          />
        ) : isSelectCat ? (
          <SelectRows
            entries={card.entries}
            target={card.target}
            picks={picks}
            onToggle={togglePick}
            submitted={flipped}
            threshold={card.cat === "moves" ? 30 : 10}
          />
        ) : isMcCat ? (
          <MCOptions
            card={card}
            picked={[...picks][0] || null}
            onPick={mcPick}
            submitted={flipped}
          />
        ) : !flipped ? (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#B7BACB", fontSize: 15, fontWeight: 600,
          }}>Tap to reveal</div>
        ) : (
          <Answer card={card} pool={pool} />
        )}
      </div>

      <div style={{ marginTop: 16, minHeight: 74 }}>
        {flipped && isFlipCat ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {GRADES.map(g => (
              <button key={g.key} onClick={() => grade(g.key)} style={{
                borderRadius: 12, border: "none", background: g.color, color: "#fff",
                cursor: "pointer", padding: "11px 4px 9px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,.35)",
              }}>
                <span style={{
                  fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
                  letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1,
                }}>{g.label}</span>
                <span style={{ fontSize: 10.5, opacity: .9, fontFamily: "var(--mono)" }}>
                  {gradeHint(g.key)}
                </span>
              </button>
            ))}
          </div>
        ) : flipped ? (
          <button onClick={() => grade(wasRight ? "easy" : "again")} style={{
            width: "100%", padding: "12px 4px 10px", borderRadius: 12, border: "none",
            background: wasRight ? "#30A46C" : "#E5484D", color: "#fff", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
          }}>
            <span style={{
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              letterSpacing: ".05em", textTransform: "uppercase", lineHeight: 1,
            }}>Next →</span>
            <span style={{ fontSize: 10.5, opacity: .9, fontFamily: "var(--mono)" }}>
              {wasRight ? "correct — card cleared ✓" : "you'll see this one again soon"}
            </span>
          </button>
        ) : isSelectCat ? (
          <button onClick={checkSelection} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer", padding: "14px",
          }}>Check answer ({picks.size} selected)</button>
        ) : isMcCat ? (
          <div style={{
            textAlign: "center", color: "var(--muted)", fontSize: 13, paddingTop: 14,
          }}>Pick an answer on the card</div>
        ) : (
          <button onClick={() => setFlipped(true)} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer", padding: "14px",
          }}>Reveal</button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- flip answers ----------------------------- */

function Answer({ card, pool }) {
  const { mon, cat } = card;

  if (cat === "natureChart") {
    const n = card.nature;
    if (!n.plus) {
      return (
        <div>
          <div style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 44, lineHeight: 1,
            color: "#8A8DA8",
          }}>Neutral</div>
          <div style={{ marginTop: 10, fontSize: 14, color: "#4A4D6B" }}>
            No stat changes — all ×1.0. One of the five flavor-only natures.
          </div>
        </div>
      );
    }
    const row = (dir, statKey) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 34, lineHeight: 1,
          color: dir === "+" ? "#1E7A4D" : "#C0353A", width: 30, textAlign: "center",
        }}>{dir === "+" ? "▲" : "▼"}</span>
        <span style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 42, lineHeight: 1,
          color: "#22243E",
        }}>{STAT_LABEL[statKey]}</span>
        <span style={{
          marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 14,
          color: dir === "+" ? "#1E7A4D" : "#C0353A", fontWeight: 700,
        }}>{dir === "+" ? "+10%" : "−10%"}</span>
        <span style={{
          width: 14, height: 14, borderRadius: "50%", background: STAT_COLOR[statKey],
          boxShadow: "inset 0 -2px 3px rgba(0,0,0,.25)",
        }} />
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
        {row("+", n.plus)}
        {row("-", n.minus)}
      </div>
    );
  }

  if (cat === "stats") {
    const val = mon.stats[card.statKey];
    const isSpeed = card.statKey === "spe";
    const ctx = isSpeed ? speedContext(mon, pool) : null;
    return (
      <div>
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 88, lineHeight: 1,
          color: "#22243E",
        }}>
          {val}
          <span style={{ fontSize: 22, color: "#8A8DA8", marginLeft: 8 }}>
            base {STAT_LABEL[card.statKey]}
          </span>
        </div>
        {isSpeed && ctx && (
          <div style={{
            marginTop: 14, fontSize: 13.5, lineHeight: 1.7, color: "#4A4D6B",
            borderLeft: "3px solid #FFCB05", paddingLeft: 12,
          }}>
            {ctx.slower && <div>Outspeeds <b>{ctx.slower.name}</b> ({ctx.slower.stats.spe})</div>}
            {ctx.ties.length > 0 && <div>Speed-ties <b>{ctx.ties.map(t => t.name).join(", ")}</b></div>}
            {ctx.faster && <div>Slower than <b>{ctx.faster.name}</b> ({ctx.faster.stats.spe})</div>}
            {!ctx.faster && <div><b>Fastest</b> of your studied set</div>}
          </div>
        )}
      </div>
    );
  }

  // generic ordered list (common natures)
  const list = (mon[cat] || []).map(norm);
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
      {list.map((entry, idx) => (
        <li key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 16,
            color: idx === 0 ? "#C9A100" : "#B0B3C6", width: 22, textAlign: "right",
          }}>{idx + 1}</span>
          <span style={{
            fontSize: 16.5, fontWeight: idx === 0 ? 800 : 500,
            color: idx === 0 ? "#22243E" : "#4A4D6B",
          }}>{entry.name}</span>
          {entry.pct != null && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#9DA0B8", marginLeft: "auto" }}>
              {entry.pct}%
            </span>
          )}
        </li>
      ))}
      <li style={{ fontSize: 11.5, color: "#9DA0B8", marginTop: 4, paddingLeft: 32 }}>
        in ladder usage order
      </li>
    </ol>
  );
}

/* ----------------------------- speed duel (1v1) ----------------------------- */

function samplePair(pool, prevKey) {
  for (let tries = 0; tries < 20; tries++) {
    const a = pool[Math.floor(Math.random() * pool.length)];
    let b = pool[Math.floor(Math.random() * pool.length)];
    if (a.name === b.name) continue;
    const key = [a.name, b.name].sort().join("|");
    if (key === prevKey && tries < 15) continue;
    return { pair: [a, b], key };
  }
  return { pair: [pool[0], pool[1]], key: null };
}

function DuelScreen({ pool, target, onDone, onQuit }) {
  const [round, setRound] = useState(() => samplePair(pool, null));
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState(null);

  const [a, b] = round.pair;
  const correct = a.stats.spe > b.stats.spe ? 0 : b.stats.spe > a.stats.spe ? 1 : "tie";
  const answered = picked !== null;
  const wasRight = answered && picked === correct;

  const pick = (choice) => {
    if (answered) return;
    setPicked(choice);
    setAttempts(n => n + 1);
    if (choice === correct) {
      setWins(w => w + 1);
      setStreak(s => { const ns = s + 1; setBestStreak(bs => Math.max(bs, ns)); return ns; });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setPicked(null);
    setRound(samplePair(pool, round.key));
  };

  const duelCard = (mon, idx) => {
    const isCorrectSide = correct === idx;
    const border = !answered
      ? "rgba(255,255,255,.14)"
      : isCorrectSide ? "#30A46C"
      : picked === idx ? "#E5484D" : "rgba(255,255,255,.14)";
    return (
      <button
        key={mon.name}
        onClick={() => pick(idx)}
        disabled={answered}
        style={{
          flex: 1, minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 16, padding: "16px 10px 14px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "#22243E",
          boxShadow: "0 8px 24px rgba(0,0,0,.4)",
          transition: "border-color .15s",
        }}
      >
        <MonSprite mon={mon} size={96} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {monTypes(mon).filter(t => t !== "unknown").map(t => <TypeChip key={t} t={t} />)}
        </div>
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 34, lineHeight: 1,
          color: answered ? (isCorrectSide ? "#1E7A4D" : "#8A8DA8") : "transparent",
          minHeight: 34, transition: "color .15s",
        }}>
          {answered ? mon.stats.spe : "?"}
        </div>
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 14,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 12,
      }}>Which is faster (base Speed)?</div>

      <div style={{ display: "flex", gap: 10, alignItems: "stretch", position: "relative" }}>
        {duelCard(a, 0)}
        {duelCard(b, 1)}
        <div style={{
          position: "absolute", left: "50%", top: "38%", transform: "translate(-50%,-50%)",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 26, color: "var(--gold)",
          textShadow: "0 2px 8px rgba(0,0,0,.6)", pointerEvents: "none", letterSpacing: ".04em",
        }}>VS</div>
      </div>

      <div style={{ marginTop: 12 }}>
        {!answered ? (
          <button onClick={() => pick("tie")} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: "pointer", padding: "13px",
          }}>⚖️ Speed tie</button>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14.5, lineHeight: 1.5, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>{" "}
              {correct === "tie"
                ? `${a.name} and ${b.name} speed-tie at ${a.stats.spe} — it's a coin flip.`
                : `${round.pair[correct].name} is faster, ${round.pair[correct].stats.spe} to ${round.pair[correct === 0 ? 1 : 0].stats.spe}.`}
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next duel →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- turn order (2v2) ----------------------------- */

function buildRound(pool, prevKey, hard, useNatures) {
  let mons = pool.slice(0, 4), key = null;
  for (let tries = 0; tries < 30; tries++) {
    mons = shuffle(pool).slice(0, 4);
    key = mons.map(m => m.name).sort().join("|");
    if (key !== prevKey || tries >= 25) break;
  }
  const mods = { weather: null, weatherSetBy: null, trickRoom: false, tailwindSide: null, scarf: [], para: [], natures: {} };
  if (hard) {
    const setters = [];
    mons.forEach(m => {
      Object.entries(WEATHER_SETTERS).forEach(([ab, w]) => {
        if (hasAbility(m, ab)) setters.push({ name: m.name, ability: ab, weather: w });
      });
    });
    if (setters.length) {
      // Coin flip: even with a setter fielded, sometimes your weather is down.
      if (Math.random() < 0.5) {
        const s = setters[Math.floor(Math.random() * setters.length)];
        mods.weather = s.weather;
        mods.weatherSetBy = s;
      }
    } else {
      const relevant = Object.keys(WEATHER_META).filter(w => mons.some(m => boostAbility(m, w)));
      const r = Math.random();
      if (relevant.length && r < 0.5) {
        mods.weather = relevant[Math.floor(Math.random() * relevant.length)];
      } else if (r < 0.65) {
        const ws = Object.keys(WEATHER_META);
        mods.weather = ws[Math.floor(Math.random() * ws.length)];
      }
    }
    if (Math.random() < 0.3) mods.tailwindSide = Math.random() < 0.5 ? 0 : 1;
    if (Math.random() < 0.18) mods.trickRoom = true;
    mons.forEach(m => {
      if (mods.scarf.length < 2 && Math.random() < 0.15) mods.scarf.push(m.name);
    });
    const paraPool = mons.filter(m => !mods.scarf.includes(m.name));
    if (Math.random() < 0.25 && paraPool.length) {
      mods.para.push(paraPool[Math.floor(Math.random() * paraPool.length)].name);
    }
    if (useNatures) {
      // Speed-relevant natures only: every chip on the field changes the math.
      mons.forEach(m => {
        const r = Math.random();
        if (r < 0.35) {
          mods.natures[m.name] = NATURE_PLUS_SPE[Math.floor(Math.random() * NATURE_PLUS_SPE.length)];
        } else if (r < 0.7) {
          mods.natures[m.name] = NATURE_MINUS_SPE[Math.floor(Math.random() * NATURE_MINUS_SPE.length)];
        }
      });
    }
    const weatherMatters = mods.weather && mons.some(m => boostAbility(m, mods.weather));
    if (!mods.trickRoom && mods.tailwindSide === null &&
        !mods.scarf.length && !mods.para.length && !weatherMatters &&
        !Object.keys(mods.natures).length) {
      mods.scarf.push(mons[Math.floor(Math.random() * 4)].name);
    }
  }
  return { mons, key, mods };
}

/* Effective speed: nature first, then ×1.5 Scarf ×2 Tailwind ×2 weather ability ×0.5 PAR. */
function effSpeed(mon, side, mods) {
  let s = mon.stats.spe;
  const parts = [];
  const nat = mods.natures && mods.natures[mon.name];
  const natMult = nat ? natureSpeedMult(nat) : 1;
  if (natMult !== 1) {
    s = Math.floor(s * natMult);
    parts.push(`×${natMult} ${nat}`);
  }
  if (mods.scarf.includes(mon.name)) { s *= 1.5; parts.push("×1.5 Scarf"); }
  if (mods.tailwindSide === side) { s *= 2; parts.push("×2 Tailwind"); }
  const wAb = boostAbility(mon, mods.weather);
  if (wAb) { s *= 2; parts.push("×2 " + wAb); }
  if (mods.para.includes(mon.name)) { s *= 0.5; parts.push("×0.5 PAR"); }
  return { value: Math.floor(s), breakdown: parts.length ? mon.stats.spe + " " + parts.join(" ") : null };
}

function ModChip({ text, bg, fg }) {
  return (
    <span style={{
      background: bg, color: fg || "#fff", borderRadius: 4, padding: "1.5px 6px",
      fontSize: 10, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function TurnOrderScreen({ pool, target, hard, natures, onDone, onQuit }) {
  const [round, setRound] = useState(() => buildRound(pool, null, hard, natures));
  const [order, setOrder] = useState([]);
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { mons, mods } = round;
  const sideOf = (mon) => (mons.indexOf(mon) < 2 ? 0 : 1);
  const eff = Object.fromEntries(mons.map(m => [m.name, effSpeed(m, sideOf(m), mods)]));

  const isValidOrder = (names) => {
    const v = names.map(n => eff[n].value);
    return mods.trickRoom
      ? v.every((s, i) => i === 0 || v[i - 1] <= s)
      : v.every((s, i) => i === 0 || v[i - 1] >= s);
  };

  const answered = order.length === 4;
  const wasRight = answered && isValidOrder(order);

  const tap = (name) => {
    if (answered) return;
    const idx = order.indexOf(name);
    if (idx !== -1) { setOrder(order.slice(0, idx)); return; }
    const next = [...order, name];
    setOrder(next);
    if (next.length === 4) {
      setAttempts(a => a + 1);
      if (isValidOrder(next)) {
        setWins(w => w + 1);
        setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
      } else {
        setStreak(0);
      }
    }
  };

  const nextRound = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setOrder([]);
    setRound(buildRound(pool, round.key, hard, natures));
  };

  const sorted = [...mons].sort((a, b) =>
    mods.trickRoom ? eff[a.name].value - eff[b.name].value : eff[b.name].value - eff[a.name].value);
  const groups = [];
  sorted.forEach(m => {
    const g = groups[groups.length - 1];
    if (g && g.v === eff[m.name].value) g.names.push(m.name);
    else groups.push({ v: eff[m.name].value, names: [m.name] });
  });
  const correctText = (mods.trickRoom ? "Trick Room reverses it: " : "") + groups
    .map(g => `${g.names.join(" / ")} (${g.v}${g.names.length > 1 ? ", tie" : ""})`)
    .join(" → ");

  const sideLabel = (text, side) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
      fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".16em",
      textTransform: "uppercase", color: "rgba(255,255,255,.4)",
    }}>
      {text}
      {mods.tailwindSide === side && (
        <span style={{
          color: "#7AC74C", border: "1px solid #7AC74C", borderRadius: 999,
          padding: "1px 8px", letterSpacing: ".08em",
        }}>🍃 Tailwind</span>
      )}
    </div>
  );

  const fieldCard = (mon) => {
    const pos = order.indexOf(mon.name);
    const e = eff[mon.name];
    const chips = [];
    if (mods.scarf.includes(mon.name)) chips.push(<ModChip key="s" text="Choice Scarf" bg="#E8913A" />);
    if (mods.para.includes(mon.name)) chips.push(<ModChip key="p" text="PAR" bg="#F7D02C" fg="#5A4A00" />);
    const wAb = boostAbility(mon, mods.weather);
    if (wAb) chips.push(<ModChip key="w" text={wAb} bg={WEATHER_META[mods.weather].color} />);
    const nat = mods.natures && mods.natures[mon.name];
    if (nat) {
      const m = natureSpeedMult(nat);
      chips.push(<ModChip key="n" text={nat}
        bg={m > 1 ? "#30A46C" : m < 1 ? "#6F35FC" : "#8A8DA8"} />);
    }
    const border = !answered
      ? (pos !== -1 ? "var(--gold)" : "rgba(255,255,255,.14)")
      : wasRight ? "#30A46C" : "#E5484D";
    return (
      <button
        key={mon.name}
        onClick={() => tap(mon.name)}
        disabled={answered}
        style={{
          position: "relative", minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 14, padding: "12px 6px 10px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          color: "#22243E", boxShadow: "0 6px 18px rgba(0,0,0,.4)",
          transition: "border-color .15s",
        }}
      >
        {pos !== -1 && (
          <span style={{
            position: "absolute", top: -10, right: -6, width: 26, height: 26,
            borderRadius: "50%", background: "var(--gold)", color: "#1B1D36",
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,.4)",
          }}>{pos + 1}</span>
        )}
        <MonSprite mon={mon} size={68} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 15, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>{chips}</div>
        )}
        <div style={{ minHeight: 34, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, lineHeight: 1,
            color: answered ? "#22243E" : "transparent",
          }}>{answered ? e.value : "?"}</span>
          {answered && e.breakdown && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "#8A8DA8", marginTop: 2 }}>
              {e.breakdown}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 10,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 10,
      }}>{hard ? "Tap all four in the order they move" : "Tap all four in move order — fastest first"}</div>

      {(mods.weather || mods.trickRoom) && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {mods.weather && (
            <span style={{
              background: WEATHER_META[mods.weather].color, color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".04em",
              textShadow: "0 1px 2px rgba(0,0,0,.3)",
            }}>
              {WEATHER_META[mods.weather].icon} {WEATHER_META[mods.weather].label}
              {mods.weatherSetBy && (
                <span style={{ fontWeight: 600, fontSize: 11.5, opacity: .92 }}>
                  {" "}· {mods.weatherSetBy.name}'s {mods.weatherSetBy.ability}
                </span>
              )}
            </span>
          )}
          {mods.trickRoom && (
            <span style={{
              background: "#735797", color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".08em",
              textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,.3)",
              boxShadow: "0 0 14px rgba(115,87,151,.7)",
            }}>🔮 Trick Room</span>
          )}
        </div>
      )}

      {sideLabel("Their side", 0)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {mons.slice(0, 2).map(fieldCard)}
      </div>
      {sideLabel("Your side", 1)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {mons.slice(2, 4).map(fieldCard)}
      </div>

      <div style={{ marginTop: 14 }}>
        {!answered ? (
          <div style={{
            textAlign: "center", color: "var(--muted)", fontSize: 13, minHeight: 20,
          }}>
            {order.length === 0
              ? (mods.trickRoom ? "Careful — Trick Room is up…" : "Tap the first Pokémon to move")
              : `${order.length}/4 picked — tap a numbered pick to undo`}
          </div>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14, lineHeight: 1.6, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>
              <br />
              <span style={{ fontSize: 13.5 }}>{correctText}</span>
            </div>
            <button onClick={nextRound} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next field →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------- find the scarf ------------------------- */

/* One of the four secretly holds a Choice Scarf. The observed move order
   is shown; the player must deduce the holder. Rounds are regenerated
   until the puzzle has a unique answer: no other Pokémon could hold the
   Scarf and produce the same observed order. */
function buildScarfRound(pool, prevKey, hard, useNatures) {
  let best = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const mons = shuffle(pool).slice(0, 4);
    const key = mons.map(m => m.name).sort().join("|");
    if (key === prevKey && attempt < 30) continue;

    const mods = { weather: null, weatherSetBy: null, trickRoom: false, tailwindSide: null, scarf: [], para: [], natures: {} };
    if (hard) {
      const setters = [];
      mons.forEach(m => {
        Object.entries(WEATHER_SETTERS).forEach(([ab, w]) => {
          if (hasAbility(m, ab)) setters.push({ name: m.name, ability: ab, weather: w });
        });
      });
      if (setters.length && Math.random() < 0.5) {
        const s = setters[Math.floor(Math.random() * setters.length)];
        mods.weather = s.weather;
        mods.weatherSetBy = s;
      } else if (!setters.length) {
        const relevant = Object.keys(WEATHER_META).filter(w => mons.some(m => boostAbility(m, w)));
        if (relevant.length && Math.random() < 0.4) {
          mods.weather = relevant[Math.floor(Math.random() * relevant.length)];
        }
      }
      if (Math.random() < 0.3) mods.tailwindSide = Math.random() < 0.5 ? 0 : 1;
      if (Math.random() < 0.18) mods.trickRoom = true;
      if (Math.random() < 0.25) mods.para.push(mons[Math.floor(Math.random() * 4)].name);
      if (useNatures) {
        mons.forEach(m => {
          const r = Math.random();
          if (r < 0.35) {
            mods.natures[m.name] = NATURE_PLUS_SPE[Math.floor(Math.random() * NATURE_PLUS_SPE.length)];
          } else if (r < 0.7) {
            mods.natures[m.name] = NATURE_MINUS_SPE[Math.floor(Math.random() * NATURE_MINUS_SPE.length)];
          }
        });
      }
    }

    const holder = mons[Math.floor(Math.random() * 4)].name;
    mods.scarf = [holder];
    const sideOf = (m) => (mons.indexOf(m) < 2 ? 0 : 1);
    const effWith = (scarfName) => Object.fromEntries(
      mons.map(m => [m.name, effSpeed(m, sideOf(m), { ...mods, scarf: [scarfName] }).value])
    );
    const trueEff = effWith(holder);
    const seq = [...mons].sort((a, b) =>
      mods.trickRoom ? trueEff[a.name] - trueEff[b.name] : trueEff[b.name] - trueEff[a.name]);
    const consistentWith = (vals) => seq.every((m, i) => i === 0 || (
      mods.trickRoom
        ? vals[seq[i - 1].name] <= vals[m.name]
        : vals[seq[i - 1].name] >= vals[m.name]
    ));
    const ambiguous = mons.some(c => c.name !== holder && consistentWith(effWith(c.name)));

    best = { mons, key, mods, holder, seq };
    if (!ambiguous) return best;
  }
  return best;
}

const ORDINALS = ["1st", "2nd", "3rd", "4th"];

function ScarfHuntScreen({ pool, target, hard, natures, onDone, onQuit }) {
  const [round, setRound] = useState(() => buildScarfRound(pool, null, hard, natures));
  const [picked, setPicked] = useState(null);
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [drag, setDrag] = useState(null);
  const [hover, setHover] = useState(null);
  const cardRefs = useRef({});

  const { mons, mods, holder, seq } = round;
  const sideOf = (m) => (mons.indexOf(m) < 2 ? 0 : 1);
  const eff = Object.fromEntries(mons.map(m => [m.name, effSpeed(m, sideOf(m), mods)]));

  const orderLabel = {};
  seq.forEach((m, i) => {
    orderLabel[m.name] = (i > 0 && eff[m.name].value === eff[seq[i - 1].name].value)
      ? orderLabel[seq[i - 1].name]
      : ORDINALS[i];
  });

  const answered = picked !== null;
  const wasRight = answered && picked === holder;
  const holderMon = mons.find(m => m.name === holder);

  const choose = (name) => {
    if (answered) return;
    setPicked(name);
    setAttempts(n => n + 1);
    if (name === holder) {
      setWins(w => w + 1);
      setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setPicked(null);
    setHover(null);
    setRound(buildScarfRound(pool, round.key, hard, natures));
  };

  const hitTest = (x, y) => {
    let hit = null;
    Object.entries(cardRefs.current).forEach(([name, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) hit = name;
    });
    return hit;
  };
  const onTokenDown = (e) => {
    if (answered) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX, y: e.clientY });
  };
  const onTokenMove = (e) => {
    if (!drag) return;
    setDrag({ x: e.clientX, y: e.clientY });
    setHover(hitTest(e.clientX, e.clientY));
  };
  const onTokenUp = (e) => {
    if (!drag) return;
    const hit = hitTest(e.clientX, e.clientY);
    setDrag(null);
    setHover(null);
    if (hit) choose(hit);
  };

  const recap = seq
    .map(m => `${m.name} (${eff[m.name].value})`)
    .join(" → ");

  const fieldCard = (mon) => {
    const isHolder = mon.name === holder;
    const chips = [];
    if (answered && isHolder) chips.push(<ModChip key="s" text="Choice Scarf" bg="#E8913A" />);
    if (mods.para.includes(mon.name)) chips.push(<ModChip key="p" text="PAR" bg="#F7D02C" fg="#5A4A00" />);
    const wAb = boostAbility(mon, mods.weather);
    if (wAb) chips.push(<ModChip key="w" text={wAb} bg={WEATHER_META[mods.weather].color} />);
    const nat = mods.natures && mods.natures[mon.name];
    if (nat) {
      const m = natureSpeedMult(nat);
      chips.push(<ModChip key="n" text={nat} bg={m > 1 ? "#30A46C" : m < 1 ? "#6F35FC" : "#8A8DA8"} />);
    }
    const border = answered
      ? (isHolder ? "#30A46C" : picked === mon.name ? "#E5484D" : "rgba(255,255,255,.14)")
      : hover === mon.name ? "var(--gold)" : "rgba(255,255,255,.14)";
    return (
      <button
        key={mon.name}
        ref={el => { cardRefs.current[mon.name] = el; }}
        onClick={() => choose(mon.name)}
        disabled={answered}
        style={{
          position: "relative", minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 14, padding: "12px 6px 10px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          color: "#22243E", boxShadow: "0 6px 18px rgba(0,0,0,.4)",
          transition: "border-color .1s",
        }}
      >
        <span style={{
          position: "absolute", top: -10, right: -6, minWidth: 34, height: 24,
          borderRadius: 999, background: "#22243E", color: "#FFCB05",
          border: "1.5px solid #FFCB05",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 13.5,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 8px", boxShadow: "0 2px 6px rgba(0,0,0,.4)",
        }}>{orderLabel[mon.name]}</span>
        <MonSprite mon={mon} size={68} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 15, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>{chips}</div>
        )}
        <div style={{ minHeight: 34, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, lineHeight: 1,
            color: answered ? "#22243E" : "transparent",
          }}>{answered ? eff[mon.name].value : "?"}</span>
          {answered && eff[mon.name].breakdown && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "#8A8DA8", marginTop: 2 }}>
              {eff[mon.name].breakdown}
            </span>
          )}
        </div>
      </button>
    );
  };

  const sideLabel = (text, side) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
      fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".16em",
      textTransform: "uppercase", color: "rgba(255,255,255,.4)",
    }}>
      {text}
      {mods.tailwindSide === side && (
        <span style={{
          color: "#7AC74C", border: "1px solid #7AC74C", borderRadius: 999,
          padding: "1px 8px", letterSpacing: ".08em",
        }}>🍃 Tailwind</span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      {drag && (
        <div style={{
          position: "fixed", left: drag.x, top: drag.y, zIndex: 60,
          transform: "translate(-50%, -65%)", fontSize: 42, pointerEvents: "none",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,.5))",
        }}>🧣</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 10,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 10,
      }}>One of these is holding a Choice Scarf — the move order gives it away</div>

      {(mods.weather || mods.trickRoom) && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {mods.weather && (
            <span style={{
              background: WEATHER_META[mods.weather].color, color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".04em",
              textShadow: "0 1px 2px rgba(0,0,0,.3)",
            }}>
              {WEATHER_META[mods.weather].icon} {WEATHER_META[mods.weather].label}
              {mods.weatherSetBy && (
                <span style={{ fontWeight: 600, fontSize: 11.5, opacity: .92 }}>
                  {" "}· {mods.weatherSetBy.name}'s {mods.weatherSetBy.ability}
                </span>
              )}
            </span>
          )}
          {mods.trickRoom && (
            <span style={{
              background: "#735797", color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".08em",
              textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,.3)",
              boxShadow: "0 0 14px rgba(115,87,151,.7)",
            }}>🔮 Trick Room</span>
          )}
        </div>
      )}

      {sideLabel("Their side", 0)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {mons.slice(0, 2).map(fieldCard)}
      </div>
      {sideLabel("Your side", 1)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {mons.slice(2, 4).map(fieldCard)}
      </div>

      <div style={{ marginTop: 16 }}>
        {!answered ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <button
              onPointerDown={onTokenDown}
              onPointerMove={onTokenMove}
              onPointerUp={onTokenUp}
              style={{
                touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
                background: drag ? "rgba(255,203,5,.25)" : "var(--gold)",
                color: "#1B1D36", border: "none", borderRadius: 999,
                padding: "12px 22px", cursor: "grab",
                fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
                letterSpacing: ".04em", textTransform: "uppercase",
                boxShadow: "0 4px 18px rgba(255,203,5,.35)",
                opacity: drag ? 0.55 : 1,
              }}
            >🧣 Choice Scarf</button>
            <span style={{ color: "var(--muted)", fontSize: 12.5 }}>
              Drag it onto the holder — or just tap a Pokémon
            </span>
          </div>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14, lineHeight: 1.6, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>{" "}
              {holderMon.name} was holding the Scarf — base {holderMon.stats.spe} Spe.
              <br />
              <span style={{ fontSize: 13.5 }}>{mods.trickRoom ? "Trick Room order: " : ""}{recap}</span>
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next field →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DuelSummary({ result, onRestart, onAgain }) {
  const { target, attempts, bestStreak } = result;
  const acc = Math.round((target / attempts) * 100);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 18px" }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--gold)", marginBottom: 8,
      }}>Speed game complete 🏆</div>
      <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 72, color: "#fff", lineHeight: 1 }}>
        {target}<span style={{ fontSize: 30, color: "var(--muted)" }}> wins</span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: "10px 0 24px", lineHeight: 1.7 }}>
        {attempts} rounds · {acc}% accuracy · best streak {bestStreak} 🔥
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onAgain} style={{
          flex: 1, padding: "14px", borderRadius: 12, border: "none",
          background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
          textTransform: "uppercase", letterSpacing: ".05em",
        }}>Run it back</button>
        <button onClick={onRestart} style={{
          flex: 1, padding: "14px", borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,.25)", background: "transparent",
          color: "#fff", cursor: "pointer", fontFamily: "var(--display)",
          fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: ".05em",
        }}>New session</button>
      </div>
    </div>
  );
}

/* ----------------------------- summary ----------------------------- */

function SummaryScreen({ session, onRestart, onDrillToughest }) {
  const { done, log, total } = session;
  const reviews = log.again + log.hard + log.good + log.easy;
  const tough = done.filter(d => d.lapses > 0).sort((a, b) => b.lapses - a.lapses);
  const firstTry = done.filter(d => d.lapses === 0 && d.reviews <= SRS.GRADUATE_STEPS).length;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 18px" }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--gold)", marginBottom: 8,
      }}>Session complete — all cards cleared</div>
      <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 72, color: "#fff", lineHeight: 1 }}>
        {reviews}<span style={{ fontSize: 30, color: "var(--muted)" }}> reviews</span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: "10px 0 24px", lineHeight: 1.6 }}>
        {total} cards learned · {firstTry} cleared without a miss.
        <br />
        <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
          <span style={{ color: "#E5484D" }}>{log.again} again</span> ·{" "}
          <span style={{ color: "#E8913A" }}>{log.hard} hard</span> ·{" "}
          <span style={{ color: "#6FCF97" }}>{log.good} good</span> ·{" "}
          <span style={{ color: "#7FB0F0" }}>{log.easy} easy</span>
        </span>
      </p>

      {tough.length > 0 && (
        <div style={{ ...panelStyle }}>
          <div style={panelHeadStyle}><span>Toughest cards</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {tough.slice(0, 10).map((d, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 14 }}>
                {d.card.mon
                  ? <TypeOrb types={monTypes(d.card.mon)} size={24} text={d.card.mon.name[0]} />
                  : d.card.nature
                    ? <NatureOrb nature={d.card.nature} size={24} />
                    : <TypeOrb types={[d.card.type]} size={24} text={d.card.type[0].toUpperCase()} />}
                <span style={{ fontWeight: 600 }}>
                  {d.card.mon ? d.card.mon.name : d.card.nature ? d.card.nature.name : cap(d.card.type)}
                </span>
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  {d.card.cat === "stats"
                    ? STAT_LABEL[d.card.statKey]
                    : CAT_SHORT[d.card.cat] || d.card.cat}
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#E5484D", marginLeft: "auto" }}>
                  ×{d.lapses} again
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {tough.length > 0 && (
          <button onClick={() => onDrillToughest(tough)} style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
            textTransform: "uppercase", letterSpacing: ".05em",
          }}>Drill toughest</button>
        )}
        <button onClick={onRestart} style={{
          flex: 1, padding: "14px", borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,.25)", background: "transparent",
          color: "#fff", cursor: "pointer", fontFamily: "var(--display)",
          fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: ".05em",
        }}>New session</button>
      </div>
    </div>
  );
}

/* ----------------------------- app ----------------------------- */

function App() {
  const [data, setData] = useState(FALLBACK);
  const [live, setLive] = useState(false);
  const [screen, setScreen] = useState("config");
  const [session, setSession] = useState(null);
  const [queue, setQueue] = useState([]);
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(0);

  useEffect(() => {
    fetch("data.json")
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (d && d.formats && d.formats.length) { setData(d); setLive(true); } })
      .catch(() => {});
  }, []);

  const start = (cfg) => {
    setSession(cfg);
    setResult(null);
    setSessionId(s => s + 1);
    if (cfg.type === "flash") {
      setQueue(buildDeck(cfg.deckCfg));
      setScreen("quiz");
    } else {
      setScreen("duel");
    }
  };

  const drillToughest = (tough) => {
    setQueue(shuffle(tough.map(t => ({ ...t, step: 0, lapses: 0, reviews: 0 }))));
    setResult(null);
    setSessionId(s => s + 1);
    setScreen("quiz");
  };

  const duelAgain = () => {
    setResult(null);
    setSessionId(s => s + 1);
    setScreen("duel");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(1200px 600px at 50% -10%, #262A52 0%, #16182E 55%, #101124 100%)",
      fontFamily: "var(--body)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap');
        :root {
          --display: 'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif;
          --body: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
          --mono: ui-monospace, 'SF Mono', Menlo, monospace;
          --gold: #FFCB05;
          --muted: rgba(255,255,255,.55);
        }
        button:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid #FFCB05; outline-offset: 2px;
        }
        input[type="range"] { height: 22px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {screen === "config" && (
        <ConfigScreen
          formats={data.formats}
          generated={data.generated}
          live={live}
          onStart={start}
        />
      )}
      {screen === "quiz" && session && (
        <QuizScreen
          key={sessionId}
          initialQueue={queue}
          pool={session.pool}
          reg={session.reg}
          onQuit={() => setScreen("config")}
          onDone={(res) => { setResult(res); setScreen("done"); }}
        />
      )}
      {screen === "duel" && session && (
        session.duelCfg.variant === "order" ? (
          <TurnOrderScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            hard={session.duelCfg.hard}
            natures={session.duelCfg.natures}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        ) : session.duelCfg.variant === "scarf" ? (
          <ScarfHuntScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            hard={session.duelCfg.hard}
            natures={session.duelCfg.natures}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        ) : (
          <DuelScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        )
      )}
      {screen === "done" && result && (
        <SummaryScreen
          session={result}
          onRestart={() => setScreen("config")}
          onDrillToughest={drillToughest}
        />
      )}
      {screen === "duelDone" && result && (
        <DuelSummary
          result={result}
          onRestart={() => setScreen("config")}
          onAgain={duelAgain}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
