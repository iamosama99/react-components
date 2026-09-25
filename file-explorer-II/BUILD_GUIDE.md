# Building a File Explorer — Interview Walkthrough

A step-by-step guide to building this component the way you'd talk through it in a
machine-coding interview: clarify requirements → design the data model → build the
recursive tree → wire up state → add CRUD interactions → discuss edge cases and
follow-ups.

This doc reflects the actual implementation in this folder:
[`FileExplorer.tsx`](src/components/FileExplorer.tsx) and
[`FileTree.tsx`](src/components/FileTree.tsx).

---

## 1. Clarify requirements (first 2–3 minutes)

Before writing code, restate the problem and pin down scope. Typical prompt:

> "Build a file explorer: a tree of files and folders. Folders can be expanded/collapsed.
> You should be able to rename, delete, and add new files/folders."

Questions worth asking out loud:

- Is the tree data static (in-memory) or fetched from an API? → **assume in-memory,
  passed in as props** (`initialData`).
- Single tree, or nested arbitrarily deep? → **arbitrarily deep** (this is the whole
  point — recursion).
- Do we need drag-and-drop, search, or keyboard navigation? → **out of scope**, call
  them out as "if I have time" extensions.
- Should folder open/close state persist when the tree re-renders (e.g. after a
  rename)? → **yes**, which drives *where* the `open` state lives.

Stating these out loud shows the interviewer you're scoping the problem instead of
guessing.

---

## 2. Design the data model

A tree of nodes, each either a file or a folder:

```ts
type FileNode = {
  id: string
  name: string
  isFolder: boolean
  children?: FileNode[] // only present on folders
}
```

Design decisions worth mentioning:

- **`id` is required on every node** and must be stable/unique (`crypto.randomUUID()`
  here) — you need it as a React `key` and as a target for rename/delete/add
  operations. Using `name` as a key would break on rename and collide on duplicate
  names.
- **`isFolder` boolean vs. a `type` discriminant** — a boolean is fine for two node
  kinds; if you expect more node kinds later (symlinks, shortcuts) a string
  discriminant scales better. Say this if asked "why not an enum."
- **`children` is optional**, not an empty array by default — lets you distinguish "a
  file" (no children key at all) from "an empty folder" (`children: []`) if that
  distinction ever matters. This repo treats folders as always having `children`
  once created (see `addToTree`).

See it in use in [`App.tsx`](src/App.tsx:8-44).

---

## 3. Component architecture

Three layers, each with one job:

```
FileExplorer            → owns the state (source of truth), exposes handlers
  └── FileTree           → renders a list of nodes at one level (recursion entry point)
        └── TreeNode     → renders a single node; if it's an open folder, renders
                            another FileTree for its children
```

| Component | Responsibility |
|---|---|
| `FileExplorer` | Holds the tree in state (`useReducer`), defines `ADD` / `RENAME` / `DELETE` actions, passes data + callbacks down. |
| `FileTree` | Pure rendering — maps over an array of nodes and renders a `TreeNode` per item. Recursion happens because `TreeNode` renders `FileTree` again for a folder's children. |
| `TreeNode` (private, lives inside `FileTree.tsx`) | Owns its own **local** `open` boolean (expand/collapse), renders either a file row or a folder row with action buttons. |

**Why split state this way?** `open`/`closed` is per-node UI state that doesn't need
to be lifted — no other component cares whether *this* folder is expanded. Keeping it
local with `useState` inside `TreeNode` avoids polluting the global tree state with UI
concerns and means toggling a folder doesn't re-render the whole tree. Contrast that
with the actual *data* (name, existence, position in tree) which several components
need to agree on — that lives in the reducer at the top.

This "local UI state vs. lifted domain state" split is a distinction interviewers
explicitly listen for.

---

## 4. Recursion: rendering the tree

The core trick of any tree UI: a component that renders itself.

```tsx
// FileTree.tsx
export default function FileTree({ data, onRename, onDelete, onAdd }) {
  return (
    <div className="container">
      {data.map((item) => (
        <TreeNode key={item.id} item={item} onRename={onRename} onDelete={onDelete} onAdd={onAdd} />
      ))}
    </div>
  )
}

function TreeNode({ item, onRename, onDelete, onAdd }) {
  const [open, setOpen] = useState(false)

  if (!item.isFolder) {
    return <div className="file-item">...</div> // leaf, recursion stops here
  }

  return (
    <>
      <div className="file-item">...toggle button...</div>
      {open && !!item.children && (
        <FileTree data={item.children} onRename={onRename} onDelete={onDelete} onAdd={onAdd} />
      )}
    </>
  )
}
```

Talking points:

- **Base case**: a file node (`!item.isFolder`) renders a leaf row and returns —
  no further recursion.
- **Recursive case**: an open folder renders `<FileTree data={item.children} .../>`,
  which is a fresh instance of the same component, one level deeper.
- **Laziness**: children are only rendered `open && !!item.children` — closed folders
  don't mount their subtree at all, which matters for performance on large trees (a
  closed folder with 10,000 descendants costs nothing until expanded).
- Every recursive call **forwards the same three callbacks** (`onRename`, `onDelete`,
  `onAdd`) unchanged — they don't need to know *how deep* they are, only *which id*
  they're acting on. This is what makes the CRUD operations depth-agnostic (see next
  section).

---

## 5. State management: `useReducer` + immutable tree updates

The tree lives in one `useReducer` in `FileExplorer`:

```ts
function treeReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return addToTree(state, action.parentId, action.node)
    case 'RENAME': return updateTree(state, action.id, node => ({ ...node, name: action.name }))
    case 'DELETE': return deleteFromTree(state, action.id)
    default: return state
  }
}
```

**Why `useReducer` over three separate `useState` calls or ad-hoc mutation?**

- All tree mutations funnel through one place, so the update logic (find-and-replace
  in a nested structure) is written once and reused for rename/add, instead of
  duplicating recursive-search logic in every handler.
- It reads like a mini state machine — good vocabulary to use out loud, interviewers
  like hearing "reducer" over "I'll just setState a deeply cloned copy."
- It sets up cleanly for **undo/redo** as a follow-up (keep a history of past states),
  which is a common extension question — see §8.

### The three tree algorithms

All three are recursive because the target node can be at any depth, and — critically
— **all three return a new tree rather than mutating the old one**, which is required
for React to detect the state change and for reducers to stay pure.

```ts
// Find target by id, replace it via `updater`. Everything else is copied by reference.
function updateTree(nodes, targetId, updater) {
  return nodes.map(node => {
    if (node.id === targetId) return updater(node)
    if (node.children) return { ...node, children: updateTree(node.children, targetId, updater) }
    return node
  })
}

// Remove target by id from whichever level it lives at.
function deleteFromTree(nodes, targetId) {
  const filtered = nodes.filter(node => node.id !== targetId)
  return filtered.map(node =>
    node.children ? { ...node, children: deleteFromTree(node.children, targetId) } : node
  )
}

// Find parent by id, append newNode to its children.
function addToTree(nodes, parentId, newNode) {
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: node.children ? [...node.children, newNode] : [newNode] }
    }
    if (node.children) return { ...node, children: addToTree(node.children, parentId, newNode) }
    return node
  })
}
```

Things worth calling out proactively:

- **Structural sharing**: nodes that aren't on the path to the target are returned
  *by reference*, not copied. Only the array/objects on the path from root to the
  changed node are new. This is the standard "how do you update deeply nested
  immutable state" answer, and shows you understand *why* `{...node, children: ...}`
  is spread only where needed, not on every node.
  - This also gives cheap `React.memo` wins later: unaffected sibling subtrees keep
    the same object identity and can bail out of re-rendering.
- **`updateTree` takes an `updater` function**, not a hardcoded field change. That's
  what lets one function serve rename today and (say) "toggle starred" or "change
  icon" later without writing a new tree-walker each time.
- **Complexity**: each of these is O(n) in the number of nodes in the worst case
  (target near the bottom of an unbalanced tree, or absent), since every ancestor
  path down to it gets rebuilt and every sibling gets a reference copy via `.map`.
  Fine to say "O(n), and n is the node count, not the depth" if asked.
- **Big miss to avoid**: mutating `node.children.push(...)` directly. It "works" in a
  demo because objects are still reachable, but React won't re-render (same
  reference), and it breaks time-travel/undo. Flag this explicitly if the
  interviewer asks "what if I just mutate it?"

---

## 6. Wiring actions from the UI

`FileExplorer` exposes thin handlers that just dispatch:

```tsx
function handleRename(id, name) { dispatch({ type: 'RENAME', id, name }) }
function handleDelete(id)       { dispatch({ type: 'DELETE', id }) }
function handleAdd(parentId, node) { dispatch({ type: 'ADD', parentId, node }) }
```

`TreeNode` collects the input (currently via `window.prompt` / `window.confirm` for
speed) and calls the handler with an id it already has in scope:

```tsx
function handleRename(event) {
  event.stopPropagation()
  const newName = window.prompt('Rename to:', item.name)
  if (newName && newName.trim()) onRename(item.id, newName.trim())
}
```

Talking points:

- **`event.stopPropagation()`** on every action button — the folder row's toggle
  button and the action buttons are siblings inside the same clickable row; without
  stopping propagation, clicking "Delete" could also fire the toggle if they were
  nested, or bubble to a row-level click handler if one gets added later. Worth
  a one-line mention even though today's DOM doesn't strictly need it, because it's
  the kind of "gotcha" interviewers plant.
  - Note: with the two buttons at the same nesting level (not one inside the other),
    this is currently precautionary rather than fixing an active bug — a fine thing
    to admit if asked, rather than over-claiming.
- **`window.prompt`/`window.confirm`** is called out as a deliberate shortcut: real
  UI would use a controlled `<input>` with inline edit mode and a confirm dialog
  component, but blocking browser dialogs get you unblocked fast in a 35-minute
  interview. Say this out loud — it signals you know the difference between "fastest
  path to a working demo" and "production quality," and can talk about the tradeoff.
- **New nodes get `crypto.randomUUID()`** for their id, same as the seed data — so ids
  stay globally unique regardless of insertion depth.

---

## 7. Styling notes

Minimal CSS, structural rather than decorative
([`FileExplorer.css`](src/components/FileExplorer.css)):

- `.container { padding-left: 1rem }` — each nested `FileTree` render adds one
  indent level automatically, for free, just by being a nested DOM node. No manual
  `depth` prop/multiplication needed — a nice thing to point out as a simplification.
- `.file-item` uses flex + gap for the row layout; `.file-item-actions` groups the
  buttons. Nothing depth- or state-dependent lives in CSS — all conditional
  rendering (open/closed, file/folder) is handled in JSX.

---

## 8. Common follow-up questions (and how this code answers them)

**"How would you add drag-and-drop to move a file into another folder?"**
Reuse `deleteFromTree` + `addToTree`: on drop, dispatch a single `MOVE` action that
internally does `addToTree(deleteFromTree(state, draggedId), targetFolderId, draggedNode)`
— you need the node's data before deleting it, so `MOVE` should look it up first,
then delete, then re-add, all inside one reducer case so it's atomic.

**"How would you add search/filter?"**
Write a `filterTree(nodes, query)` that recursively keeps a node if its name matches
*or* if any descendant matches (so parent folders of a match stay visible), producing
a filtered copy — pure derived data, not stored in the reducer. Auto-expand folders
that contain a match.

**"What if the tree has 100,000 nodes?"**
Two independent asks are hiding in that question:
1. *Rendering a huge flat list* → virtualize with something like `react-window`, only
   mounting visible rows.
2. *A single very deep/wide tree* → this component already avoids the worst cost by
   not rendering closed folders' children at all (§4). The remaining cost is the
   reducer's O(n) tree walk on every mutation — for very large trees you'd move to a
   normalized map (`Record<id, node>` + `Record<id, childIds[]>`) so updates are O(1)
   lookups instead of O(n) tree walks, at the cost of more bookkeeping.

**"How would you support undo/redo?"**
Since all mutations already flow through one reducer, keep `past: state[]` and
`future: state[]` alongside `present` (a "history reducer" wrapping `treeReducer`),
push `present` onto `past` before each mutation, and handle `UNDO`/`REDO` actions that
pop/push between the three.

**"Multiple selection / keyboard navigation?"**
Would need to lift `open` state out of each `TreeNode` (or keep an `expandedIds: Set`
in the reducer) so a `Ctrl+A`/arrow-key handler at the `FileExplorer` level can see and
control the whole tree's expand state and a `selectedIds` set — local `useState` per
node stops being enough once a parent needs to orchestrate them.

**"Persisting to a backend?"**
Each dispatch already carries exactly the info an API call needs
(`{id, name}` for rename, `{id}` for delete, `{parentId, node}` for add) — wrap the
handlers in an async function that fires the request and only dispatches on success,
or dispatch optimistically and dispatch a `REVERT` action on failure.

---

## 9. Suggested build order in a live interview (~35–40 min)

1. Data model + static render of a flat list (no nesting yet) — **5 min**
2. Make it recursive: folders render their own `FileTree` — **5 min**
3. Add expand/collapse local state — **5 min**
4. Add `useReducer` + rename (simplest mutation, proves the pattern) — **10 min**
5. Add delete — **5 min**
6. Add "add file/folder" — **5 min**
7. Narrate 1–2 follow-ups from §8 if time remains, even without coding them.

Talking through the plan before typing (as in this doc) is itself worth points —
interviewers are grading communication as much as code.
