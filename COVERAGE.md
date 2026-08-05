# Coverage — What Renders From JSON Alone

## Registered components and what they express

| Type | Covers | Patterns supported |
|---|---|---|
| `header` | Top bar, logo, search, login CTA | text, action |
| `navigationTabs` | Horizontal tab bar | children list, active-state via screen `state`, `changeTab` action |
| `heroBanner` | Hero + embedded form (title, subtitle, input, CTA, chips) | text, image, nested chip list, action, state-driven selection |
| `imageBanner` | Single image + label CTA tile | text, image, action |
| `textSection` | Heading/body copy block | text only |
| `carousel` | Horizontal FlatList rail | children list, action per item |
| `grid` | Wrapping card grid | children list, action per item |
| `verticalList` | Virtualized vertical FlatList | children list, action per item |
| `chip` | Selectable pill | selection state, action |
| `button` | CTA | text, action |
| `input` | Text field | placeholder, keyboard type |
| `footer` | Link columns + copyright | nested static text groups |

Cross-cutting, available on **every** node regardless of type:
`visibility` (state-conditional show/hide), `style` (whitelisted
overrides: margins, padding, background color, border radius),
`action` (navigate / showToast / openBottomSheet / changeTab /
updateSelectedChip).

## Honest coverage claim

**On the screen this system was built for** (Sell Car landing page):
100% of the visible page renders from `src/json/sellCarScreen.json`
with zero hardcoded layout — `SduiHomeScreen.tsx` contains no page
content at all.

**For a *new*, unseen Cars24 screen**, my honest estimate — reasoned
from what the registry currently expresses, not measured on a real
surprise screen yet (that's the first-round live exercise) — is:

- **~60–70% renders with JSON-only changes.** Most Cars24 screens
  (car listing/search results, a details page's spec sheet, a loans
  landing page) are built from the same visual vocabulary this
  registry already covers: a header, some hero/banner copy, card
  grids or rails, a vertical list, a footer. Swapping copy, images,
  and children arrays in JSON covers that class of change entirely.
- **~30–40% needs new client code**, specifically for:
  - **Component types with genuinely different interaction models**
    the registry has no analog for yet — a stepper/slider (e.g. an
    EMI tenure selector), a multi-field form with cross-field
    validation, a comparison table, a map view, a video player.
  - **Deeper conditional logic than equality-based `visibility`
    supports** — e.g. "show section only if user has an active
    listing AND it's been >7 days" needs either a new component that
    encapsulates that logic, or a genuine expansion of the
    visibility DSL (explicitly avoided by design — see README).
  - **Truly novel nested-container shapes.** Today's containers
    (`carousel`, `grid`, `verticalList`) resolve their children via
    `propBuilders`, not full Renderer recursion (see README
    trade-offs). A container-of-containers layout not already
    anticipated by a `propBuilders` case needs a new case there at
    minimum, possibly a Renderer change if the nesting is unbounded.

## What would need new component development (not just JSON)

- Any input beyond a single-line text field (dropdowns, date pickers,
  sliders/steppers, checkboxes/radios, multi-line text)
- A working bottom sheet (currently the action fires but no sheet UI
  is mounted — see README trade-offs)
- Tables/comparison grids with row/column semantics
- Anything video/map/canvas-based
- True multi-select chip groups (today's chip state is single-value
  per screen-state-key; multi-select needs an array-valued state
  design, which is a small but real schema decision, not a bug fix)

## What the first-round surprise screen will actually test

Given the registry above, a screen that's mostly "header + banners +
rails + grids + footer" (e.g. a Buy Used Car listing page) should
score high on JSON-only coverage. A screen centered on a genuinely
new interaction — an EMI calculator with a tenure slider, a
comparison table — will expose the gap honestly and require adding
one new component to the registry live, which is the intended use
of the extensibility the registry/propBuilders split was designed
for: one file, one line, no renderer change.
