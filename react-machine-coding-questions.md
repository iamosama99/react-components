# React Machine Coding & Component Design Interview Questions (Ranked by Importance)

Ranked by how often they show up in real interviews and how much they reveal about a candidate. Work top to bottom.

Legend: 🟢 Easy · 🟡 Medium · 🔴 Hard · ✅ Already done

---

## Tier 1: Must Do (asked most often)

| Rank | Question | Diff | Key concepts tested |
|------|----------|------|---------------------|
| 1 | Autocomplete / Typeahead | 🟡 | Debounce, race conditions, caching, keyboard nav, highlight match |
| 2 | Todo app | 🟢 | CRUD, filters, localStorage persistence |
| 3 | Infinite scroll feed | 🟡 | IntersectionObserver, loading guard, dedupe |
| 4 | Nested comments (Reddit-style) | 🟡 | Recursion, reply/edit/delete, immutable updates |
| 5 | File explorer / Tree view | 🟡 | Recursion, expand/collapse, add/delete/rename |
| 6 | Star rating | 🟢 | Hover preview, half stars, controlled value, a11y |
| 7 | Accordion | 🟢 | Single vs multiple open, controlled/uncontrolled |
| 8 | Tabs | 🟢 | Compound components, arrow-key nav |
| 9 | Data table (sort / filter / pagination) | 🟡 | Derived state, `useMemo`, column config |
| 10 | Modal / Dialog ✅ | 🟢 | Portals, focus trap, Esc, scroll lock, a11y |
| 11 | Toast / Notification system ✅ | 🟡 | Queue, auto-dismiss, context + `useToast` |
| 12 | Dropdown / Select (single + multi) | 🟡 | Click-outside, keyboard nav, controlled state |
| 13 | Pagination | 🟢 | Page window logic, ellipsis, server vs client |
| 14 | Carousel / Image slider | 🟡 | Infinite loop, autoplay, swipe, timer cleanup |
| 15 | Nested checkboxes (parent–child) | 🟡 | State propagation, indeterminate |
| 16 | OTP / PIN input | 🟢 | Focus management, paste, backspace |
| 17 | Stopwatch / Timer / Countdown | 🟢 | `setInterval` cleanup, drift, laps |
| 18 | Progress bar / Stepper | 🟢 | Animation, multi-step state |
| 19 | Tic-tac-toe | 🟢 | Grid state, win detection, history |
| 20 | Multi-step form / Wizard | 🟡 | Step state, validation, persistence |

## Tier 2: Very Common Hooks & Fundamentals

| Rank | Question | Diff | Key concepts tested |
|------|----------|------|---------------------|
| 21 | `useDebounce` / `useThrottle` | 🟢 | Timer cleanup, latest-value semantics |
| 22 | `useFetch` / `useAsync` | 🟡 | Loading/error, AbortController, races, caching |
| 23 | `useLocalStorage` | 🟡 | SSR safety, `storage` event, JSON errors |
| 24 | `useClickOutside` | 🟢 | Ref + document listener |
| 25 | `useInterval` / `useTimeout` | 🟡 | Latest-callback pattern |
| 26 | `usePrevious` | 🟢 | Ref updated in effect |
| 27 | `useToggle` | 🟢 | Stable callbacks |
| 28 | `useEventListener` | 🟡 | Ref-stored handler |
| 29 | Search with debounce + request cancellation | 🟡 | AbortController, stale responses |
| 30 | Shopping cart / e-commerce page | 🟡 | Context/reducer, quantity, totals |
| 31 | Tooltip / Popover | 🟡 | Positioning, collision, portals |
| 32 | File uploader (drag & drop) | 🟡 | Drag events, preview, progress, abort |
| 33 | Tags input / Multi-select chips | 🟡 | Add/remove, backspace, validation |
| 34 | Drawer / Side sheet | 🟢 | Portals, transitions, focus trap |
| 35 | Controlled vs uncontrolled (supporting both) | 🟡 | `value` / `defaultValue` handling |
| 36 | Error Boundary with reset | 🟡 | Class lifecycle, fallback UI |
| 37 | Optimistic UI updates with rollback | 🟡 | State snapshots, error handling |
| 38 | Theming (light/dark, CSS variables) | 🟡 | Context, persistence, `prefers-color-scheme` |
| 39 | Skeleton loader / Shimmer | 🟢 | Loading states, layout shift |
| 40 | Switch / Checkbox group ("select all") | 🟢 | Controlled inputs |

## Tier 3: Frequently Asked Mid-Level Projects

| Rank | Question | Diff | Key concepts tested |
|------|----------|------|---------------------|
| 41 | Kanban board (Trello) | 🔴 | Drag & drop, normalized state |
| 42 | Drag and drop sortable list | 🔴 | Drag/pointer events, reorder |
| 43 | Chat UI | 🟡 | Auto scroll, optimistic send, grouping |
| 44 | Counter with undo/redo (`useUndoRedo`) | 🟡 | History stacks, `useReducer` |
| 45 | Date picker / Calendar | 🔴 | Date math, month grid, range selection |
| 46 | Virtualized list / windowing | 🔴 | Scroll math, overscan, dynamic heights |
| 47 | Instagram / Twitter feed | 🔴 | Infinite scroll, optimistic like, virtualization |
| 48 | Command palette (Cmd+K) | 🔴 | Global shortcuts, fuzzy search, grouping |
| 49 | Movie / product search with filters | 🟡 | Debounce, query params, pagination |
| 50 | Quiz / survey app | 🟡 | Step state, scoring |
| 51 | Poll / Voting widget | 🟢 | Percentages, one vote per user |
| 52 | Context menu (right click) | 🟡 | Positioning, submenus, outside click |
| 53 | Notes app / Markdown previewer | 🟡 | Persistence, sanitization, debounce |
| 54 | Expense tracker | 🟡 | Forms, aggregation, charts |
| 55 | Weather app | 🟢 | API fetch, loading/error states |
| 56 | `useIntersectionObserver` | 🟡 | Lazy load, infinite scroll |
| 57 | `useWindowSize` / `useMediaQuery` | 🟢 | Resize listener, cleanup |
| 58 | `useForm` (mini Formik) | 🔴 | Registration, validation, touched/dirty |
| 59 | `useKeyPress` / `useHotkeys` | 🟡 | Combos, modifier keys |
| 60 | `usePagination` | 🟡 | Range calculation |

## Tier 4: Games & Algorithm-Flavoured UI

| Rank | Question | Diff | Key concepts tested |
|------|----------|------|---------------------|
| 61 | Memory / card-matching game | 🟡 | Timers, flip state, shuffle |
| 62 | Snake game | 🔴 | Game loop, `useInterval`, collision |
| 63 | Connect Four | 🟡 | 2D grid, win detection |
| 64 | Minesweeper | 🔴 | Flood fill, flags, recursion |
| 65 | Wordle / Sudoku | 🔴 | Validation, keyboard input |
| 66 | Tetris | 🔴 | Rotation, collision, game loop |
| 67 | Chess / Checkers board | 🔴 | Move validation, state modelling |
| 68 | Spreadsheet (mini Excel) | 🔴 | Formula parsing, dependency graph |
| 69 | Editable data grid | 🔴 | Cell editing, keyboard nav |
| 70 | Time picker | 🟡 | Input masking, 12/24h |

## Tier 5: Advanced / Senior-Level Topics

| Rank | Question | Diff | Key concepts tested |
|------|----------|------|---------------------|
| 71 | Implement `useState` from scratch | 🟡 | Closures, hook index |
| 72 | Implement `useEffect` (with deps) | 🔴 | Dependency comparison, cleanup |
| 73 | Implement `useMemo` / `useCallback` | 🟡 | Cache by deps |
| 74 | Implement `useReducer` using `useState` | 🟢 | Reducer pattern |
| 75 | Redux-like store (`useSelector`, `dispatch`) | 🔴 | Subscriptions, `useSyncExternalStore` |
| 76 | Implement `React.memo` | 🟡 | Shallow compare |
| 77 | Mini virtual DOM + diffing | 🔴 | Reconciliation |
| 78 | Form builder from JSON schema | 🔴 | Dynamic rendering, conditional fields |
| 79 | Polymorphic component (`as` prop) in TypeScript | 🔴 | Generics, `ComponentPropsWithRef` |
| 80 | Render-prop / HOC / compound versions of one component | 🟡 | Pattern trade-offs |
| 81 | Lazy loading images / routes | 🟡 | `React.lazy`, `Suspense` |
| 82 | i18n provider | 🟡 | Context, interpolation, plurals |
| 83 | Feature-flag / permission provider (`<Can>`) | 🟡 | Context, role checks |
| 84 | Undo/redo across app state | 🔴 | Command pattern |
| 85 | Range / dual-thumb slider | 🔴 | Pointer events, clamping, step |
| 86 | Color picker | 🟡 | Canvas, HSL/RGB/HEX conversion |
| 87 | Rich text editor (basic) | 🔴 | `contentEditable`, Selection API |
| 88 | `useDeepCompareEffect` | 🔴 | Deep equality pitfalls |
| 89 | Breadcrumb / Navbar with dropdowns | 🟢 | Responsive, nested menus |
| 90 | Collaborative editor (LLD only) | 🔴 | CRDT/OT, cursors, sync |
| 91 | `useCopyToClipboard` | 🟢 | Clipboard API, fallback |
| 92 | `useHover` / `useFocus` | 🟢 | Ref + listeners |
| 93 | `useOnlineStatus` | 🟢 | Online/offline events |
| 94 | `useMounted` / `useIsFirstRender` | 🟢 | Refs and effects |
| 95 | `useInfiniteScroll` | 🟡 | Observer + page state |
| 96 | `classnames` / `clsx` | 🟢 | Utility implementation |
| 97 | Digital clock | 🟢 | Effects, cleanup |
| 98 | Stack Overflow-style Q&A feed | 🟡 | Voting, routing |
| 99 | Multi-modal manager (global store, z-index stacking) | 🟡 | Portal root, stacking |
| 100 | Design-system architecture | 🔴 | Tokens, theming, tree-shaking, Storybook |

---

## Low-Level Design Discussion Questions (ranked)

These are whiteboard + code-sketch rounds. Define the API first, then the state model.

1. **Autocomplete component.** Async data, caching, debounce, keyboard nav, custom item rendering.
2. **Reusable design-system component (Button / Input / Modal).** Props API, variants, composition vs configuration, a11y, theming, ref forwarding.
3. **Toast/notification system.** Imperative API vs hook, queue, limits, positions, animations.
4. **Data Table.** Column definitions, sort/filter, server vs client mode, virtualization, row selection.
5. **Infinite-scroll feed.** Pagination strategy, virtualization, cache, scroll restoration.
6. **Nested comments system.** Normalization, optimistic updates, reply pagination.
7. **Form library.** Field registration, validation timing, error display, re-render performance.
8. **Dropdown/Select (single, multi, searchable, async).**
9. **File Explorer.** Recursive rendering, lazy children, keyboard nav, context menu.
10. **Kanban board.** Normalized state, drag & drop, optimistic persistence.
11. **Chat front end.** WebSocket handling, ordering, optimistic send, retry, unread counts.
12. **Date Range Picker.** State model, min/max, disabled dates, locale, a11y.
13. **Search results page.** URL as source of truth, filters, facets, debounce, caching.
14. **State management for a large app.** Local vs global vs server state; context, Redux, Zustand, React Query.
15. **Modal/Toast manager with a global store.** Portal root, stacking, multiple modals.
16. **Dashboard with widgets.** Layout grid, widget registry, per-widget loading/error.
17. **Image gallery / lightbox.** Lazy load, preloading, zoom/pan.
18. **Video player UI.** Custom controls, buffering, shortcuts, fullscreen.
19. **Rich-text editor architecture.** Document model, commands, selection, plugins.
20. **Design-system architecture.** Tokens, theming, versioning, docs, testing.

---

## What Interviewers Evaluate

- **Requirements clarification:** ask about scope, edge cases, a11y before coding.
- **Component API design:** props, controlled vs uncontrolled, composition.
- **State modelling:** minimal state, derived data, `useReducer` vs `useState`.
- **Side effects:** cleanup, race conditions, stale closures, `AbortController`.
- **Performance:** judicious memoization, virtualization, avoiding re-renders.
- **Accessibility:** roles, ARIA, keyboard support, focus management.
- **Code quality:** structure, naming, reusability, separation of concerns.
- **Edge cases:** empty/loading/error states, rapid interactions, unmount during async work.
- **Testing mindset:** what and how to test (React Testing Library).
- **Bonus:** TypeScript, responsiveness, animations, theming.

## Time Management (60–90 min round)

- **0–5 min:** clarify requirements; split must-have vs nice-to-have.
- **5–10 min:** plan component tree, state shape, file structure.
- **10–60 min:** build must-haves first, get a working version, then iterate.
- **Last 10–15 min:** edge cases, a11y, cleanup, polish, explain trade-offs.
