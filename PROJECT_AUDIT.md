# PROJECT_AUDIT.md

* **Repository:** SunilKumarKV/owlroadmap
* **Version:** v1.1.0 (Stabilization Phase)
* **Date:** June 30, 2026
* **Engineering Quality Score:** **6.0 / 10** (Fails to build due to a critical syntax error in `READMEBuilderPage.tsx`. Post-fix score: **7.8 / 10**)

---

## 1. Large Files (>500 lines)

The codebase contains **9 files** exceeding 500 lines of code. The largest component (`READMEBuilderPage.tsx`) is extremely bloated and handles too many responsibilities (UI layout, dynamic form state, template rendering, history logs, analytics, and AI logic).

| File Name | Exact Path | Line Count | Primary Content / Bloat Reason |
| :--- | :--- | :--- | :--- |
| **READMEBuilderPage.tsx** | [READMEBuilderPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/readme-builder/READMEBuilderPage.tsx) | 5,579 lines | Houses multiple sub-panels (AI generator, marketplace, quality analyzer) and inline SVG/styling forms instead of splitting them into modular subcomponents. |
| **DeveloperDashboardPage.tsx** | [DeveloperDashboardPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/dashboard/DeveloperDashboardPage.tsx) | 926 lines | Monolithic page rendering developer metrics, repo selectors, profile cards, and settings controls. |
| **readme-store.ts** | [readme-store.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/readme-store.ts) | 924 lines | Zustands store containing all README form properties, defaults, actions, presets, and conversion helper methods. |
| **markdown.ts** | [markdown.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/markdown.ts) | 798 lines | Handles generation of markdown templates, badge logic, and stats rendering for all widgets. |
| **ShowcaseGalleryPage.tsx** | [ShowcaseGalleryPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/showcase/ShowcaseGalleryPage.tsx) | 710 lines | Manages all layout previews, code copying, download anchors, file imports, and category filters. |
| **LandingPage.tsx** | [LandingPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/home/LandingPage.tsx) | 687 lines | Landing presentation rendering hero animations, features cards, pricing FAQ sections, and footer links. |
| **markdown.test.ts** | [markdown.test.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/__tests__/markdown.test.ts) | 629 lines | Unit tests validating markdown generation. |
| **ExportCenterPage.tsx** | [ExportCenterPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/export-center/ExportCenterPage.tsx) | 606 lines | Code editor and export layout including zip utility triggers and histories. |
| **workspace-store.ts** | [workspace-store.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/workspace-store.ts) | 513 lines | Re-declares all default configuration states in-line for workspace initialization. |

---

## 2. Duplicate Logic

* **Workspace Defaults Re-declaration** (P1):  
  * **File:** [workspace-store.ts:L88-180](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/workspace-store.ts#L88-180) duplicates the exact structures of `DEFAULT_GITHUB_STATS`, `DEFAULT_TECH_STACK`, `DEFAULT_SOCIAL_LINKS` etc., which are already defined and exported in [readme-store.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/readme-store.ts). This causes synchronization issues when changing defaults.
* **Shared Route Copy-Pasting** (P1):  
  * **Files:** [app/share/readme/page.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/app/share/readme/page.tsx) and [app/share/roadmap/page.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/app/share/roadmap/page.tsx) duplicate the base64 decoding interface checks, body theme class lists overriding logic, notification toast overlay states, and suspense loading layouts.
* **Custom SVG Grid & Scaling Elements** (P2):  
  * **Files:** [BarChart.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/charts/BarChart.tsx) and [AreaChart.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/charts/AreaChart.tsx) duplicate grid-lines step generators and Y-axis coordinate calculations.

---

## 3. Dead Code

Several components, stores, and test blocks are fully declared but never imported or referenced in application routing:

* **Unused UI Components** (P1):  
  * [FocusTrap.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/FocusTrap.tsx) (115 lines) — Created to handle modal keyboard focus trapping, but never imported in any modal view.
  * [ErrorBoundary.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/ErrorBoundary.tsx) (67 lines) — Declared to trap app crashes, but never mounted in layouts or routers.
* **Unused Zustand Store** (P1):  
  * [template-store.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/template-store.ts) (337 lines) — Implements local template publishing, likes, downloads, and search. Fully unused.
  * [template-store.test.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/__tests__/template-store.test.ts) (108 lines) — Test file for the unused store.
* **Unused Component Export** (P2):  
  * `ChartSkeleton` in [Skeleton.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/Skeleton.tsx#L55-L69) — Never mounted in analytical or telemetry panels.

---

## 4. Mock / Demo Data

* **Showcase Seeds Bloat** (P1):  
  * **File:** [showcase-store.ts:L57-310](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/showcase-store.ts#L57-310) contains massive hardcoded JSON array profiles (`Sarah Chen`, `Evelyn Carter`, etc.) directly inside the store logic.
* **Template Seeds Bloat** (P1):  
  * **File:** [template-registry.ts:L86-483](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/template-registry.ts#L86-483) hardcodes all marketplace templates (`John Doe`, `Alex Rivera`) directly inside the registry module.

---

## 5. Unused Imports

Multiple files contain obsolete imports (unused libraries, types, or icons):

* **READMEBuilderPage.tsx** (P2):  
  * `Link` from `'next/link'` (Line 5)
  * `Check`, `Sparkles`, `ChevronRight` from `'lucide-react'` (Lines 14, 17, 19)
  * `GitHubStatsConfig`, `TechStackConfig`, `SocialLinksConfig` from `'@/stores/readme-store'` (Line 25)
  * `Technology` from `'@/utils/tech-registry'` (Line 28)
  * `SocialPlatform` from `'@/utils/social-registry'` (Line 29)
  * `TemplateCategory` from `'@/utils/template-registry'` (Line 32)
  * `getAIService` from `'@/utils/ai/ai-service'` (Line 33)
* **LandingPage.tsx** (P2):  
  * `FileCode`, `Shield`, `HelpCircle`, `FileDown` from `'lucide-react'`
* **ShowcaseGalleryPage.tsx** (P2):  
  * `Heart`, `Download`, `Upload`, `BookOpen`, `ExternalLink`, `ChevronDown` from `'lucide-react'`
* **ExportCenterPage.tsx** (P2):  
  * `useRef`, `useEffect` from `'react'`
  * `FileText`, `ExternalLink` from `'lucide-react'`
* **layout.tsx** (P2):  
  * `Metadata` from `'next'`
  * `ThemeProvider` from `'@/components/ThemeProvider'`

---

## 6. Technical Debt

* **Static Seed Data Bloat:** Static seed profiles in [showcase-store.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/stores/showcase-store.ts) and [template-registry.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/template-registry.ts) should be moved to separate `.json` config files.
* **Inline CSS & SVG Config Form bloating:** The dynamic badge parameters and styling forms (over 2000 lines in `READMEBuilderPage.tsx`) should be moved to a dedicated directory (`src/features/readme-builder/components/`).
* **Monolithic Markdown Generator:** The `markdown.ts` utility handles too many rendering formats and should be refactored into a modular layout pattern (e.g., `src/utils/markdown/generators/`).

---

## 7. Accessibility Issues

* **Label Tag Orphan Nodes** (P1):  
  * **Files:** [READMEBuilderPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/readme-builder/READMEBuilderPage.tsx) dynamically generates label elements (Lines 2857, 2882, 2891, 2944, 2952, etc.) for settings configuration inputs, but **lacks the `htmlFor` attribute** on `<label>` tags, and the corresponding `<Input>` components **lack `id` attributes**. Screen readers cannot associate labels with form inputs.
* **Invisible File Upload Elements** (P1):  
  * **Files:** `READMEBuilderPage.tsx` (Line 4072, 4751) and [ShowcaseGalleryPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/showcase/ShowcaseGalleryPage.tsx) (Line 251) render `<input type="file" className="hidden" />` elements without an `aria-label` or `id` connected to their styled trigger wrappers.
* **SVG Chart Data Telemetries** (P2):  
  * **Files:** [AreaChart.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/charts/AreaChart.tsx), [BarChart.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/charts/BarChart.tsx), and [DonutChart.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/components/charts/DonutChart.tsx) render SVGs directly, lacking `aria-label` definitions or nested `<title>`/`<desc>` elements, making their telemetry graphs inaccessible.
* **Incorrect Output Markdown Alt Tags** (P2):  
  * **File:** [markdown.ts:L621](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/markdown.ts#L621) outputs generated code blocks where the `<img>` tags are completely missing alt texts.

---

## 8. Performance Issues

* **Double Dynamic Import and Missing Fallback** (P1):  
  * **File:** [READMEBuilderPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/readme-builder/READMEBuilderPage.tsx) contains a double dynamic import of `@uiw/react-md-editor`.
  * The first import (Lines 38-48) correctly configures a `loading` shimmer spinner component.
  * The second import (Lines 51-54) overrides the first variable with a basic `{ ssr: false }` definition, **removing the loading spinner**. This triggers a layout shift during initial editor page load.
* **Showcase Cards Non-virtualization** (P2):  
  * **File:** [ShowcaseGalleryPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/showcase/ShowcaseGalleryPage.tsx) iterates directly over the entire list of `filteredShowcases` arrays. Loading dozens of items with complex previews at once degrades browser paint performance.

---

## 9. Refactor Priority

1. **P0 (Release Blockers):** Fix the double block-scoped variable declaration for `MDMarkdown` in `READMEBuilderPage.tsx` to restore application build capability.
2. **P1 (High Priority):**
   * Link input forms to labels by adding `htmlFor` and matching `id` values in `READMEBuilderPage.tsx` settings panel.
   * Remove the double dynamic import and restore the markdown loader spinner in `READMEBuilderPage.tsx`.
   * Delete unused stores (`template-store.ts`) and components (`FocusTrap.tsx`, `ErrorBoundary.tsx`).
   * Dry up `workspace-store.ts` default literals by importing them from `readme-store.ts`.
3. **P2 (Medium Priority):**
   * Decouple seed data objects from `showcase-store.ts` and `template-registry.ts`.
   * Add proper `aria-label`/`<title>` tags to analytical SVG charts (`AreaChart`, `BarChart`, `DonutChart`).
   * Clean up unused imports across all major pages.

---

## 10. Release Blockers

### P0: Double block-scoped variable declaration `MDMarkdown` in `READMEBuilderPage.tsx`
* **File:** [READMEBuilderPage.tsx](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/features/readme-builder/READMEBuilderPage.tsx)
* **Lines:**
  * **Line 38-48:** Declares `const MDMarkdown = dynamic(...)` with spinner fallback.
  * **Line 51-54:** Declares `const MDMarkdown = dynamic(...)` again in the same file scope, causing a compile-time `SyntaxError: Identifier 'MDMarkdown' has already been declared`.
* **Impact:** Prevents the project from building or deploying to Vercel/production.

### P0: Broken Placeholder Image References in Template Registry
* **File:** [template-registry.ts](file:///Users/sunilkumarkv/.gemini/antigravity/worktrees/owlroadmap/v1-1-0-audit/src/utils/template-registry.ts)
* **Lines:** Lines 92, 136, 180, etc. reference `/placeholder-minimal.png`, `/placeholder-modern.png`, `/placeholder-opensource.png`.
* **Impact:** These assets are missing from the public folder and will cause broken image icons on the template marketplace interface.
