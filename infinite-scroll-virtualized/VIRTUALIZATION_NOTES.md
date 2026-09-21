# Building a Virtualized Infinite List, Step by Step

A walkthrough of how this project's `VirtualList` was built, starting from the basic idea. Each step was small and testable on its own.

## 0. The problem and the idea

Rendering 10,000 rows puts 10,000 nodes in the DOM. Memory, layout and paint costs all grow with the count, and the page gets slow.

The user only sees a handful of rows at once. Virtualization (also called windowing) renders **only the rows in view, plus a few spare ones**, and makes the scrollbar behave as if every row existed.

To do that we need to answer one question on every scroll: **which rows are visible right now?**

```
scrollTop ─┐
           ├─→ visible pixel range ─→ ÷ itemHeight ─→ start/end index ─→ render that slice
viewport ──┘
```

This project uses **fixed-height rows**, so the math is plain division. Each row is 300px (400px wide photo at a 4:3 ratio). Variable heights are a harder follow-up (see the end).

## 1. A scrollable box

An outer div with a fixed height and `overflow-y: auto`, and a tall child inside it.

```css
.virtual-list { height: 100vh; overflow-y: auto; }
```

- **Fixed height** means the content can exceed the box.
- **`overflow-y: auto`** turns the box into a scroll container: it gets a scrollbar, a `scrollTop` and a `scroll` event. With the default `overflow: visible`, the *page* would scroll and the box would never fire `onScroll`.
- The outer div is the **viewport**. The tall inner div is the **spacer**.

## 2. Read `scrollTop`

```tsx
const [scrollTop, setScrollTop] = useState(0);
<div onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
```

`scrollTop` is how many pixels are scrolled off the top, which is where the visible window starts. The browser tracks it, and React only learns about it through this handler. At the bottom it equals `content height - visible height`, never the full content height.

## 3. Measure the viewport height

```tsx
const ref = useRef<HTMLDivElement>(null);
const [viewportHeight, setViewportHeight] = useState(0);

useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);
    // ...
}, []);
```

The visible pixel range is `scrollTop` to `scrollTop + viewportHeight`.

**Why `useLayoutEffect`:** it runs after the DOM exists but *before* the browser paints. A plain `useEffect` would let a first frame paint with `viewportHeight = 0` (zero rows), then flash. Rule of thumb: if you measure the DOM and the result changes what you render, use `useLayoutEffect`.

## 4. Keep the height correct on resize

```tsx
const observer = new ResizeObserver(() => setViewportHeight(el.clientHeight));
observer.observe(el);
return () => observer.disconnect();
```

The effect with `[]` only runs once, so a window resize would leave `viewportHeight` stale. `ResizeObserver` is the browser's "this element's size changed" notification, and the cleanup stops it leaking.

## 5. Compute the visible index range

```tsx
const start = Math.floor(scrollTop / itemHeight);
const end   = Math.ceil((scrollTop + viewportHeight) / itemHeight);
```

Worked example: `itemHeight = 300`, `viewportHeight = 900`, `scrollTop = 450`. The window covers pixels 450 to 1350.

- Top: 450 / 300 = 1.5, which is inside item 1. Round **down**, so `start = 1`.
- Bottom: 1350 / 300 = 4.5, which reaches into item 4. Round **up**, so `end = 5`.

`end` is exclusive, like `slice(start, end)`. Items 1, 2, 3, 4 render.

## 6. Render real rows, positioned by index

```tsx
const indexes = Array.from({ length: end - start }, (_, i) => start + i);

<div className="virtual-list-spacer" style={{ height: count * itemHeight }}>
    {indexes.map((index) => (
        <div key={index} className="virtual-list-row"
             style={{ top: index * itemHeight, height: itemHeight }}>
            {renderItem(index)}
        </div>
    ))}
</div>
```

```css
.virtual-list-spacer { position: relative; }
.virtual-list-row    { position: absolute; left: 0; right: 0; }
```

- **The spacer's height** is `count * itemHeight`, so the scrollbar is the right size even though almost nothing is in the DOM.
- **`position: absolute` + `top: index * itemHeight`** puts each row where it would be if all rows existed. Use the *absolute* index (`start + i`), not the position inside `.map`, or every row lands at the top.
- **`position: relative` on the spacer** makes `top` measure from the spacer. Absolute rows also leave normal flow, so they never change the spacer's height.
- **`key={index}`** lets React reuse rows that stay visible.

### How rows get added and removed

Nothing touches the DOM directly. A scroll changes `scrollTop`, React re-renders, `start`/`end` and `indexes` are recomputed, and React diffs the old and new keys. Keys that disappeared are removed and new keys are created. Rows in both lists are left alone.

## 7. Overscan and clamping

```tsx
const OVERSCAN = 3;
const start = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
const end   = Math.min(count, Math.ceil((scrollTop + viewportHeight) / itemHeight) + OVERSCAN);
```

- **Overscan** renders a few extra rows above and below the window, so they already exist when the user scrolls to them. Without it, fast scrolling shows blank gaps.
- **Clamping** keeps the range inside the real list: `start` never drops below 0 and `end` never passes `count`.
- **Trade-off:** more overscan is smoother but puts more rows in the DOM. With heavy rows like images, 3 to 5 is a sensible range.

## 8. Make it reusable with props

```tsx
type Props = {
    count: number;
    itemHeight: number;
    renderItem: (index: number) => ReactNode;
    onEndReached?: () => void;
};
```

`VirtualList` knows nothing about photos. The parent supplies the row count, the row height and how to render row `i`.

```tsx
<VirtualList
    count={results.length}
    itemHeight={300}
    renderItem={(index) => <Post url={results[index].download_url} />}
    onEndReached={...}
/>
```

## 9. Plug in real data

`App` fetches `https://picsum.photos/v2/list?page=N&limit=20` and appends each page to `results`. `count` is `results.length`, and `renderItem` reads `results[index]`.

Types added along the way: a `Photo` type for the state, a typed `Post` prop, `useRef<HTMLDivElement>(null)` with an `if (!el) return` guard, and `err instanceof Error` in the `catch`.

## 10. Infinite loading based on the index

The first version used an `IntersectionObserver` on a sentinel div below the list. That doesn't fit a virtualized list: the list is a fixed-height box, so the sentinel stayed on screen and fired page after page.

The trigger now comes from the list itself:

```tsx
const END_THRESHOLD = 5;

useEffect(() => {
    if (count > 0 && end >= count - END_THRESHOLD) onEndReached?.();
}, [end, count]);
```

```tsx
onEndReached={() => {
    if (!loading && hasMore) setPage(p => p + 1);
}}
```

- It fires when the rendered range gets within 5 rows of the loaded items, so the next page starts loading before the user hits the bottom.
- `App` guards with `!loading && hasMore`, so only one page is requested at a time and it stops at the end.
- `onEndReached` is left out of the dependency array on purpose. It's a new function every render, so listing it would fire the effect on every scroll tick. The effect already re-runs when `end` or `count` changes.
- `limit=20` instead of 4, so each page is enough to fill the window plus overscan.
- The "Loading..." and "No more photos" messages live below the list box, outside the spacer.

## 11. Cleanup

Removed the debug readout (`scrollTop`, `viewport`, `start`, `end`) and the blue spacer background, and centered the photos with `display: flex; justify-content: center` on the row.

## The final data flow

```
scroll → setScrollTop → re-render
      → start/end from scrollTop + viewportHeight
      → indexes = [start … end-1]
      → rows added/removed by key
      → end near count? → onEndReached → setPage → fetch → results grows → count grows
```

```
outer div   (fixed height, overflow-y: auto, the viewport)
└── spacer  (relative, height = count × itemHeight)
    └── rows (absolute, top = index × itemHeight, only start…end exist)
```

## How to verify it works

- In DevTools, the spacer holds only a handful of row divs however far you scroll.
- The Network tab shows one `list?page=N` request at a time, not a burst.
- Scrolling fast shows little or no blank space. Set `OVERSCAN` to `0` and to `20` to compare.
- At the very end, "No more photos" appears and requests stop.
- Resize the window and the range recomputes.

## Known limits and next steps

- A failed fetch doesn't retry until the range changes.
- Row heights are fixed. **Variable heights** need measured heights, an offsets array (prefix sums), and a binary search for `start`.
- No `requestAnimationFrame` throttling on scroll. Profile before adding it.
- No `scrollToIndex`, and no keyboard or accessibility support (`role="list"` and so on).
- Leftover debug borders in [src/components/VirtualList.css](src/components/VirtualList.css) (red on the list, black on each row) can be removed.

## Files

- [src/components/VirtualList.tsx](src/components/VirtualList.tsx): the generic list
- [src/components/VirtualList.css](src/components/VirtualList.css): container, spacer and row styles
- [src/App.tsx](src/App.tsx): fetching, state, and wiring `VirtualList` to the data
- [src/components/Post.tsx](src/components/Post.tsx): the photo row content
