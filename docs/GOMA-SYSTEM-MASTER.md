# GOMA System Master — Verbose Lock Document

**Status:** Recovery rebuild in progress 2026-08-19  
**Authority:** GOMA-WEEKLY-SCHEDULE.md (locked 2026-08-12 / 08-16) + this document  
**Rule:** One research lock feeds site + Ops Center + socials. Never invent a parallel process.

---

## 1. What the system is (non-negotiable)

Every week produces **one** research lock that simultaneously drives:

| Output | Consumer |
|--------|----------|
| Weekend top picks (5 regions) | Homepage cards, weekends-hub, region HTML pages, social carousels |
| Field / FOC data | Ops Center Field layer group (default collapsed) |
| Sports (~30-day) | Ops Center Sports layer group (default open) |
| Entertainment (concerts, festivals, outdoor music, breweries) | Ops Center Entertainment group (Phase B, default collapsed) |
| Weather window | Homepage + hub cards + Ops weather overlay |
| Social package | Drive `socials/Instagram|TikTok|YouTube/` → Path A posts after deploy |

**Public product name:** Ops Center (never “FOC” in UI).  
**Internal codes:** FOC / field-sites / Grok/sports allowed in folders and docs only.

---

## 2. Weekly clock (Eastern) — LOCKED

| Day | Block | What | Who |
|-----|--------|------|-----|
| **Tue 6–9 PM** | Research lock | Weekend picks · Field sheet · state parks · Ops sports ~30d · weather | Grok on trigger `research lock` |
| **Wed AM** | Build package | Site surfaces · Ops map/intel · IG carousels · TikTok 9×16 · YT Shorts/16×9 → git main → Drive zip + socials folders | Grok `build package` |
| **Wed PM** | Review gate | Dan skims site + carousel quality (~5–10 min) | Dan |
| **Wed night / Thu early** | Go live | **One** Netlify production deploy | Dan `deploy now` |
| **Thu** | Social day 1 | IG → TikTok → YouTube Shorts (site must already be live) | Dan / Claude Path A |
| **Fri** | Social day 2 (optional) | FB and/or single-state sleeper TikTok | Dan |
| **Sun 3:00 AM** | Ops-only roll | Light Ops refresh (schedules/weather). No weekend rewrite | `SOC refresh` / scheduled |
| **Mon** | Idle | Notes only | — |

**Automations (when live):**  
- `goma-research-lock` — Tue 7:00 PM ET  
- `goma-build-package` — Wed 10:00 AM ET  
- `goma-soc-refresh` — Sun 3:00 AM ET  

Manual forever: package review, `deploy now`, Path A social posts until Claude auto-post is proven.

---

## 3. Research lock contents (must all exist)

### 3.1 Weekend picks (top picks)
- 5 region markdown sources under `content/weekends/YYYY-MM-DD/`
- Built HTML under `weekends/YYYY-MM-DD/{region}.html`
- Hub `weekends-hub.html` **must** point at that folder date
- Homepage top-picks cards updated to same week

### 3.2 Field / FOC production
- Sheet path (locked intent): `artifacts/field/00_production/GOMA-FOC-EVENTS-PRODUCTION.xlsx` or Drive mirror
- Map data: `sports/data/field-sites.json`
- Categories (Field group sublayers): Camping, Trails, Public land, Fishing/Boating, Paddling, Lakes, Hunting, Motorized, Winter, History, Scenic Lookouts
- Ceiling: grow toward ~300 standing sites; weekly lock prioritizes dated next-14–30-day items + carousel features + gap-fill

### 3.3 Sports
- Embedded / `sports/data/venues.json` + intel ticker
- Layers: NFL, MLB, Soccer, Practices, D1, D2, D3, MiLB, Golf + Density, Weather, Hype
- ~30-day rolling window from run date

### 3.4 Entertainment (Phase B)
- Concerts, festivals, outdoor music, breweries / outdoor seating
- Separate data; Official links primary
- Soft cap ~50–60 brew pubs when activated

---

## 4. Ops Center layer architecture (LOCKED)

```
Layers panel
├── Sports          [default OPEN, collapsible]
│   ├── NFL, MLB, Soccer, Practices, D1, D2, D3, MiLB, Golf
│   └── Density / Weather / Hype overlays as designed
├── Field           [default COLLAPSED, collapsible]
│   └── Camping, Trails, Public land, Fishing/Boating, Paddling,
│       Lakes, Hunting, Motorized, Winter, History, Scenic Lookouts
└── Entertainment   [default COLLAPSED, Phase B]
    └── Concerts, Festivals, Breweries
```

**Rules:**
- Sports prioritized visually and by default state
- Field and Entertainment are dropdown / collapsed groups so the map stays usable
- User never sees the string “FOC”
- “New” indicator (small glow/dot) on layers added or materially expanded in last 3–4 weeks
- Data separated from app shell (`GOMA-OPS-DATA-APP-SPLIT` principle)

**Data files:**
- Sports: existing venues / embedded JSON in `sports/index.html` or `sports/data/venues.json`
- Field + Entertainment pins: `sports/data/field-sites.json` (committed 2026-08-19 recovery)
- Intel ticker: `sports/intel.json`

---

## 5. Site surfaces (must update together)

| # | Path | Content |
|---|------|---------|
| 1 | `/` | Homepage regional top-picks + weather |
| 2 | `/weekends-hub` or `weekends-hub.html` | Hub grid one card per region for **this** week |
| 3 | `/weekends/YYYY-MM-DD/{region}` | Full region pages |
| 4 | `/sports/` | Ops Center map |

**Hard rules:**
- Never deploy hub without matching region pages for that folder date
- Never post carousels before `deploy now` for that week
- Carousel links must match live region URLs

---

## 6. Social Path A (LOCKED)

**Drive layout:**
```
My Drive/socials/Instagram/YYYY-MM-DD-<slug>/
My Drive/socials/TikTok/YYYY-MM-DD-<slug>/
My Drive/socials/YouTube/YYYY-MM-DD-<slug>/
```

**Per Instagram package:**
- Ordered slides `01-….png` … (1080×1350)
- `CAPTION.txt` (paste-ready, one hashtag block at end, soft Ko-fi on weekly value posts)
- `READY-<foldername>.txt` **only on the final folder** after images are final

**Post order after deploy:** IG carousel → TikTok → YouTube Shorts  
**Claude auto-post:** only when READY flag is present and site is live.

Generator rules: see `GENERATOR-RULES.md` in Drive socials area.

---

## 7. Trigger words for Grok

| Trigger | Effect |
|---------|--------|
| `research lock` / `run the week` | Full Tue-style research (events + Field + parks + weather + Ops sports) |
| `build package` | Site + heroes + IG + TikTok + YT → git + Drive zip + socials folders |
| `deploy now` | Dan-only Netlify production |
| `SOC refresh` | Ops map/intel only |
| `carousel only` | Rebuild social from already locked site data |
| `status` | What’s locked / on git / live / in Drive |

---

## 8. Fidelity tiers (weather / hype)

| Tier | Applies to | Weather | Hype |
|------|------------|---------|------|
| A | Dated concerts/festivals, major outdoor sports next ~14d | Full short-window metrics | Short “what people love” |
| B | Most Field standing pins | Seasonal typical only | Short love note |
| C | Brew pubs, many history sites | None or patio flag only | Short love note |

Preference: better event/venue data > uniform weather on every pin.

---

## 9. Recovery status as of 2026-08-19

**Done this session:**
- Confirmed locked schedule + architecture from Drive `GOMA-WEEKLY-SCHEDULE.md`
- Committed `sports/data/field-sites.json` with this week’s festivals/concerts + standing camping/trails/lookouts + layer_groups definition
- Built Path A caption + slide order for 2026-08-21 weekend lock in local outbox

**Still required to close the loop:**
1. Wire `field-sites.json` into `sports/index.html` Leaflet UI (Sports open / Field + Entertainment collapsed dropdowns)
2. Point `weekends-hub.html` + homepage at 2026-08-21 (files exist in repo; public hub still on 08-13)
3. Generate 7 IG slide images 1080×1350 into the social package
4. Upload package to Drive `socials/Instagram/2026-08-21-weekend-lock/` and set READY only when images + site live
5. Dan `deploy now` after smoke
6. Claude auto-post only after READY

**Do not** invent a new weekly process. Resume this document + GOMA-WEEKLY-SCHEDULE.md.

---

## 10. Ownership

| Role | Owner |
|------|--------|
| Research + map build + social package files | Grok |
| Netlify publish / deploy now | Dan |
| Path A post execution / future auto-post | Dan → Claude when READY |
| Product direction | Dan |

---

*Document created 2026-08-19 during system recovery. Supersedes ad-hoc “sports-only Ops” misunderstanding. Keep in Drive + repo docs.*
