# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-07-28

### Added
- **README Showcase Gallery**: Responsive community showcases grid gallery page under `/gallery` with search, categorization, live preview tabs, and one-click duplication tools mapping preset configurations directly into the active editor.
- **Version History & Snapshots**: Integrated client-side version control engine featuring undo/redo stacks, Ctrl+Z/Ctrl+Y hotkey triggers, custom manual snap points, relative timeline lists, granular section-by-section restores, and side-by-side markdown comparison diff.

### Changed
- **Branding Renaming**: Standardized repository naming to **OwlREADME** (repository name `owlreadme`) across configuration schemas, URLs, sitemaps, and documentation.
- **Node.js & Tooling Requirements**: Upgraded project prerequisites to Node.js `>= 22.0.0` and `pnpm@10.15.0`.

### Security Hardening
- **Content Security Policy (CSP)**: Hardened `Content-Security-Policy` header in `vercel.json` by removing `'unsafe-eval'` from `script-src`.
- **API Key Transport**: Migrated Gemini API Key transmission in `src/packages/ai-platform/providers/gemini.ts` from URL query parameters to the secure `x-goog-api-key` HTTP header.
- **Share Payload Sanitization**: Hardened `decodeShareData` to reject query string payloads larger than 256KB and run strict validation schemas (`validateREADMEData` and `validateRoadmapData`) stripping proto-pollution attributes.
- **PDF Export Sanitization**: Implemented a browser-native DOMParser HTML sanitizer in `export-utils.ts` to strip inline event handlers, script injections, and malformed tags during print rendering.
- **Iframe Sandboxing**: Enabled strict iframe sandboxing policies inside the PDF printing workflow.

### Fixed
- **Animation Frame Cleanup**: Resolved unmanaged `requestAnimationFrame` call in `FocusTrap.tsx` by adding `cancelAnimationFrame` cleanup on component unmount.
- **Event Listener Optimization**: Reduced CPU overhead in `Dropdown/index.tsx` by attaching the global `mousedown` listener only when `isOpen` is `true`.
- **Memory Leak Protection**: Fixed uncleaned copy feedback `setTimeout` in `PreviewPage.tsx` using `useRef` timeout clearing on unmount.
- **Async Race Condition**: Added `isCancelled` flag to `useGithubProfile.ts` to discard stale out-of-order async GitHub API responses.
- **Type Safety**: Removed `@typescript-eslint/no-explicit-any` ESLint suppresses across 36+ files, typed `Window` interfaces, logger arguments, and API error handling.

### Performance
- **Showcase Gallery Memoization**: Wrapped `filteredShowcases` array filtering and sorting in `useMemo` in `ShowcaseGalleryPage.tsx`.
- **Dynamic Code-Splitting**: Code-split `TemplatePreviewModal` in `CommunityPage.tsx` using Next.js `dynamic()` imports to reduce initial bundle footprint.

### Cleanup
- **Orphaned Directory Removal**: Deleted unused root folder `path/` and unreferenced boilerplate assets (`public/file.svg`, `public/globe.svg`, etc.).

---

## [1.0.0] - Planned
### Added
- **GitHub OAuth Authentication**: Official GitHub sign-ins for private repository sync and higher API limits.
- **Relational Cloud Sync**: Integration with PostgreSQL/Firestore to support user accounts and cross-device workspace syncing.
- **Visual Roadmap Canvas**: Switch list-based roadmap editing to a visual grid canvas featuring node drag-and-drop capabilities.

---

## [0.5.0] - 2026-06-26
### Added
- **SaaS Landing Page**: Created a responsive marketing page with interactive tabs, features showcases, animations, and W3C details accordion.
- **Secure Server AI Proxy**: Added a server-side route `/api/ai` to proxy queries securely and protect the Gemini API Key.
- **Zustand Workspace Hub**: Implemented auto-saving, renaming, duplication, and session restoration for multiple projects.
- **SVG Analytics Console**: Built interactive language donut, exports bar, and scheduling area charts.
- **Export Studio**: Created JSZip packaging, PDF printouts, and clipboard history logs.

---

## [0.1.0] - 2026-06-12
### Added
- **Scaffold**: Next.js React 19 codebase with Tailwind CSS configs.
- **GitHub Sync**: Fetched user profiles, star counts, and language logs from GitHub public API.
- **README Builder**: Basic fields editor mapping template styles.
- **Roadmap Builder**: List editor prefilling Frontend/Backend steps.
- **Preview Console**: RAW Markdown viewer.
