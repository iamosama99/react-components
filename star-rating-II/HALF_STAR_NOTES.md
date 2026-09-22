# Half-Star Rating — What Changed From the Integer Version

Starting point: a basic star rating where each star was a single click target
producing a whole number (`onClick={() => setRating(index + 1)}`). Below is
every change needed to support half-star selection, in the order they were
made.

## 1. Detecting left-half vs right-half of a star

A single click handler per star can only ever produce whole numbers — the
element itself has no notion of "which side was clicked." To get half-star
granularity, each star's click/hover handler reads where inside the element
the pointer is:

```
const rect = e.currentTarget.getBoundingClientRect()
const offsetX = e.clientX - rect.left       // cursor's X, relative to the star
offsetX < rect.width / 2 ? leftHalfValue : rightHalfValue
```

`clientX` is the cursor's position relative to the viewport; subtracting the
element's own `left` (from `getBoundingClientRect()`) converts that into a
position relative to the star itself. Comparing against half the star's
width tells you which side the pointer is on.

This was the core design decision: position math on a single element
(**Approach A**, used here) vs. splitting each star into two DOM halves with
fixed-value handlers (**Approach B**, no math needed but more DOM nodes).

## 2. State can now hold `.5` values

`rating` and `hoverRating` (`useState(0)`) didn't need to change shape —
they're just numbers — but the values assigned to them are no longer
guaranteed integers. `displayRating = hoverRating || rating` still works
because `0` is the only falsy number in the valid range, and `0` correctly
means "show nothing."

## 3. Setting the value, not incrementing it

A bug hit during development: the handler computed the right/left value but
then did `setRating(() => rating + 0.5)` — *adding* to the existing rating
instead of *setting* it to the clicked star's value. Since the position math
already determines the absolute target value (`index + 0.5` or `index + 1`),
the setter just needs `setRating(value)` directly.

## 4. Shared logic between click and hover

`handleClick` and the hover handler ended up doing the exact same position
calculation, differing only in which state setter they called. That
calculation was extracted into one function, `getRatingFromEvent(e, index)`,
which both `handleClick` and `handleMouseMove` call and pass the result to
their respective setters.

## 5. `onMouseEnter` → `onMouseMove`

`onMouseEnter` only fires once, at the moment the cursor enters the element.
If the user's mouse enters on the right half and then drifts to the left
half without leaving the star, the hover preview would stay stuck on the
value computed at entry. Switching to `onMouseMove` recomputes the value
continuously as the cursor moves within the star, at the cost of firing far
more often.

## 6. Per-star fill fraction (not just a binary check)

The original render logic was a single ternary: `index + 1 <= displayRating
? '★' : '☆'` — full or empty, nothing in between. Supporting a partial fill
means computing, per star, *how much* of it should be filled:

```
fillPercent = clamp(displayRating - index, 0, 1) * 100
```

- `displayRating - index` gives how much rating "belongs" to this star.
- Clamping to `[0, 1]` handles stars fully before (`> 1` → full) or fully
  after (`< 0` → empty) the current rating.
- This generalizes beyond halves — it would work for any fractional rating
  (e.g. an aggregated average like `3.73`), not just `.5` steps.

## 7. Rendering the partial fill: gradient + `background-clip: text`

With a fill fraction in hand, the glyph itself no longer needs to switch
between `★` and `☆` — it's always `★`. What changes is how it's colored:

- The fill percentage is passed to the DOM as a CSS custom property via
  `style={{ '--fill': `${fillPercent}%` }}` (needs a `React.CSSProperties`
  type assertion, since custom properties aren't part of that type).
- In CSS, `.star` gets a `linear-gradient` with a **hard stop** at
  `var(--fill)` — the same position repeated for both color stops, which
  produces an instant color change instead of a blend:
  ```css
  background: linear-gradient(90deg, gold var(--fill), #d1d1d1 var(--fill));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  ```
- `background-clip: text` clips that gradient to the shape of the glyph;
  making the actual text color transparent (both the standard and
  `-webkit-` prefixed properties, for Safari) lets the gradient show through
  instead of a solid color.

This was chosen over an alternative (stacking a filled + outline glyph and
clipping their widths with `overflow`/`clip-path`) because it's a single
element per star and generalizes to arbitrary fill percentages for free.

## 8. Bug: star tips clipped off

After the gradient was working, the stars rendered with their top point and
bottom two legs cut off — the middle "body" of the star was visible but the
extremities weren't. Cause: `background-clip: text` bounds the background
paint to the element's **line box**, not the glyph's actual ink extent. The
`★` glyph extends further above/below standard font metrics than typical
Latin text, and with no explicit `line-height` set, the line box was too
short to cover the whole glyph — so the tips fell outside the paintable
area and showed the page background instead.

Fix: give `.star` enough `line-height` to cover the full glyph (settled on
`line-height: 3rem`, matching the `font-size`).

## Result

- Click/hover position on a star → half or full value for that star.
- `getRatingFromEvent` is the single source of truth for that calculation.
- Each star computes its own fill fraction from `displayRating`.
- The fraction drives a CSS gradient clipped to the star glyph, so the
  visual fill is purely CSS-driven from one JS-computed number per star.
