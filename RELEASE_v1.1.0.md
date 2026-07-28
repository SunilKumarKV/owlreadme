# Release Notes: OwlREADME v1.1.0 (July 2026)

We are thrilled to announce the production release of **OwlREADME v1.1.0**! 

This release introduces the **README Showcase Gallery**, an in-memory **Version Control Snapshots & Diff System**, strict **Content Security Policy Hardening**, and a thorough stabilization sprint achieving zero ESLint errors and strict TypeScript safety across the repository.

---

## 🚀 Key Highlights

### 1. README Showcase Gallery (`/gallery`)
Browse, preview, inspect, and clone beautiful community profile README configurations:
- **Responsive Grid View:** Browse curated showcase cards with category filters, search input, star metrics, and theme tags.
- **Live Preview Modal:** Inspect rendered markdown, copy raw source code, or check design specs.
- **One-Click Clone:** Click **"Duplicate into Editor"** to load showcase presets directly into your active workspace.

### 2. Version Control Snapshots & Diff Timeline
Never lose your work! Manage workspace versions with full undo/redo stacks:
- **HotKey Shortcuts:** Full **Ctrl+Z** (undo) and **Ctrl+Y** (redo) integration across text areas.
- **Automatic & Manual Snapshots:** Auto-save configurations on template switches or create custom manual backup snapshots.
- **Side-by-Side Diff Viewer:** Compare snapshot versions with active editor state using visual markdown or code diff views.

---

## 🔒 Security Hardening

- **Content Security Policy (CSP):** Removed `'unsafe-eval'` from `script-src` in `vercel.json`.
- **API Key Header Transport:** Migrated Gemini API Key transit from URL query parameters to the secure `x-goog-api-key` HTTP request header.
- **SSRF Protection:** Enforced `ALLOWED_RAW_HOSTNAMES` allowlisting (`raw.githubusercontent.com`, `gist.githubusercontent.com`) on raw README imports.
- **Rate Limiting:** Enforced `10 requests / 60 seconds per IP` sliding window limit on `/api/ai` proxy calls.

---

## 🛠️ Stability & Performance Fixes

- **Zero ESLint Errors:** Cleared all compiler warnings and explicit `any` suppressions across 36+ files.
- **Animation Frame Cleanup:** Added `cancelAnimationFrame` cleanup to `FocusTrap.tsx`.
- **Event Listener Optimization:** Attached `mousedown` listener in `Dropdown/index.tsx` conditionally only when `isOpen` is `true`.
- **Race Condition Prevention:** Added `isCancelled` handling to `useGithubProfile.ts` to ignore out-of-order async resolutions.
- **Dynamic Code-Splitting:** Lazy-loaded modal components using Next.js `dynamic()` imports to minimize initial bundle size.

---

## 📦 System Requirements & Migration

- **Node.js:** `>= 22.0.0`
- **Package Manager:** `pnpm@10.15.0`

Local workspace data saved in browser `localStorage` will migrate automatically. If upgrading from older pre-release builds, you can click **"Clear All"** in the Version Timeline panel to re-initialize your local workspace schema cleanly.
