# Screen Recording Script (~4 min)

**0:00–0:30 — What this is**
"This is an SDUI system for Cars24's Sell Car landing page — the
server sends JSON, the client renders it. I'll show the architecture,
then prove three things live: an interaction driven entirely by JSON
actions, an unknown component not crashing the page, and a JSON edit
changing the UI with zero code changes."

**0:30–1:15 — Architecture (screen: code, `src/renderer/Renderer.tsx` + `componentRegistry.tsx`)**
"Renderer walks the JSON tree, looks up each `type` in this registry,
and mounts the matching component. Components never see JSON directly
— `propBuilders.ts` is the only place that translates a JSON node into
real typed props. That split is what lets the exact same components
power both the SDUI screen and a fully hardcoded static screen I use
for the performance comparison."

**1:15–2:00 — Live app, JSON-driven interaction**
Tap a brand chip in the hero form. "This selection isn't local
component state — it's a `updateSelectedChip` action from the JSON
node, handled by `ActionHandler`, written into a screen-level state
bag, and read back by the chip's `visibility`/props on the next
render. Same wiring drives the nav tabs."

**2:00–2:30 — Unknown component fallback**
Scroll to the placeholder box near the bottom. "The JSON has a node
with `type: MusicPlayer` — not in the registry. It renders this
fallback instead of crashing, and everything above and below it —
footer included — renders normally."

**2:30–3:15 — Live JSON edit**
Edit `src/json/sellCarScreen.json` — change a heading string and swap
one card in the grid for a new title/image, save, reload. "No app
code touched. This is the entire point of SDUI: that edit ships
without an app release."

**3:15–3:45 — Performance**
Show `PERF.md` methodology + console perf log line. "TTR, TTI, and
view-build time are measured separately for SDUI vs static so the
overhead is attributable to the registry/prop-building indirection,
not to unrelated differences between the two screens."

**3:45–4:00 — Close**
"Full write-up — schema rationale, versioning story, coverage
estimate for an unseen screen, and the AI workflow behind this build
— is in the README, COVERAGE.md, and AI_WORKFLOW.md."
