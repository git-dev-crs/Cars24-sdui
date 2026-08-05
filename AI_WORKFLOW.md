# AI Workflow

## Tool stack

- **Claude** (chat + code execution) as the primary build partner —
  used for architecture decisions, writing the renderer/registry/
  action-handler core, and drafting all four documentation files.
- The original assignment brief and the reference Cars24 screen
  (screenshots + saved page HTML) were given to the AI as source
  material up front, rather than describing the page from memory —
  this mattered more than any prompt wording for output quality.

## Context/rules I gave the AI

Rather than one giant prompt, the brief I actually worked from
encoded a few non-negotiables up front: no Expo, functional
components + hooks only, every component receives props only (no
component reaching into JSON itself), a component registry as the
single type→component map, and an explicit "must not crash on an
unknown type" requirement with a concrete test case (`MusicPlayer`)
baked into the JSON rather than left as a hypothetical. Naming those
constraints explicitly up front avoided a whole class of rewrite —
an AI given a vaguer "build an SDUI renderer" brief will often
couple the renderer to one screen's shape by default, since that's
the easiest thing that passes a single demo.

## Three prompt → outcome stories

**1. Registry typing.**
First pass typed the registry as
`Record<string, React.ComponentType<ComponentProps>>` with a shared
`ComponentProps` union. It compiled, but every component ended up
either over-widened (accepting props it ignores) or the union grew a
new member per component, defeating the point of a registry — adding
a component meant editing a central union type, exactly the coupling
the registry was supposed to remove. **Rejected** in favor of
`React.ComponentType<any>` at the registry boundary with type safety
pushed into `propBuilders.ts` instead, where each `case` in the
switch narrows to that one component's real prop shape. Worse
type-checking at the map itself, genuinely better safety where it's
load-bearing (the actual prop construction).

**2. Static screen as a copy-paste vs. a shared-component rebuild.**
Asked for the "static hardcoded version" first draft, and it came
back with its own inline `<View>`/`<Text>` markup duplicating what
the SDUI components already did — technically "hardcoded" per the
brief's letter, but it would have made the Part 2 performance
comparison meaningless (comparing two different component trees, not
measuring SDUI's actual indirection cost). **Rewrote** to import and
call the exact same `src/components/*` used by the SDUI path, with
inlined data instead of JSON as the only difference — documented why
in `README.md`'s trade-offs section so it's not misread as
accidental duplication.

**3. Visibility rule design.**
Initial ask was for a general boolean-expression visibility system
(`AND`/`OR`/nested conditions) to be maximally "flexible." Pushed
back on this myself mid-build: a general expression DSL evaluated
against server-sent strings is a real security/complexity surface
(you're one step from executing server-authored logic client-side)
for a requirement the assignment only asks to demonstrate, not
productionize. **Scoped down** to equality-only visibility keyed off
a flat state bag, documented explicitly in `sdui.ts`'s comments as an
intentional non-goal rather than an oversight.

## One AI failure

Early in scaffolding, the initial `mkdir -p src/{components,renderer,...}`
command was written assuming bash brace expansion, but the execution
shell resolved it as `/bin/sh` (dash), which doesn't expand braces —
it silently created one literal directory named
`{components,renderer,registry,...}` instead of ten real ones. It
wasn't caught by inspection of the command (it looks correct), only
by listing the directory afterward and seeing one oddly-named folder
instead of ten. Fixed by removing the malformed directory and issuing
explicit `mkdir -p` calls per folder. Small, but a good example of
why "the command looks right" isn't verification — the fix was
cheap, but the failure only surfaced because the next step included
an actual directory listing rather than trusting the previous
command's reported success.

## Verification strategy

- **Read every generated file rather than trusting a description of
  it** — in particular the renderer/propBuilders split was reviewed
  line-by-line for the "components never see JSON directly" invariant,
  since that's the one property the whole architecture pitch depends
  on.
- **Traced one component end-to-end by hand**: `chip` node in
  `sellCarScreen.json` → `propBuilders` `case 'chip'` →
  `ChipProps.selected` computed from `state.selectedChip` →
  `Chip.tsx` renders it → `onPress` → `ActionHandler`
  `updateSelectedChip` → `setState` → re-render. Confirmed no step
  reads or writes JSON structure directly outside `Renderer`/
  `propBuilders`.
- **Did not trust the AI's own perf numbers.** `PERF.md` states
  explicitly that its numbers are unmeasured placeholders rather than
  presenting AI-estimated timings as real device data — the
  instrumentation code is real and ready to run; the numbers are not
  faked as if they were.
- **Still to do before submission:** run on a real device, replace
  `PERF.md` placeholders with actual console output, record the
  screen-recording demo (including a live JSON edit), and do the
  in-person unseen-screen exercise honestly using the coverage
  estimate in `COVERAGE.md` as a prediction to check, not a promise.
