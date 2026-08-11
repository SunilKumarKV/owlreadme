# 🦉 OwlREADME — Release Notes

All notable releases of OwlREADME are documented here in reverse-chronological order.
For a full feature roadmap, see [ROADMAP.md](ROADMAP.md). For all changes, see [CHANGELOG.md](../CHANGELOG.md).

---

## 🚀 v0.5.0 — Workspace Suite & Security
**Released: 2026-06-26**

This release transforms OwlREADME from a single-page tool into a full developer workspace platform.

### Highlights
- **🔐 Secure AI Proxy** — Gemini API keys are now protected server-side via a Next.js App Router API route, eliminating any client-side credential exposure.
- **🗂️ Multi-Workspace Hub** — Create, rename, duplicate, delete, and auto-restore multiple named project workspaces persisted to local storage with 500ms debounce auto-saving.
- **📊 SVG Analytics Console** — Visual language distribution donut, export frequency bar chart, and weekday activity area chart — all built with vanilla SVG, zero external charting dependencies.
- **🤖 Owl AI Assistant** — Dashboard panel offering three assistant modes: README writer, Roadmap advisor, and Profile improver. Powered by Gemini with a smart offline fallback.
- **🔍 GitHub Repository Analyzer** — Automatically scans public repos to compute language frequencies, top starred/active repositories, and tech stack suggestions.
- **🌐 Public Share Pages** — Generate encoded share URLs for both README profiles (`/share/readme`) and Learning Roadmaps (`/share/roadmap`) with theme support.
- **📦 Export Studio Overhaul** — Multi-file ZIP packaging, styled PDF printing, copy-to-clipboard, and an export session history log.
- **🎨 SaaS Product Landing Page** — Full hero section, feature grid, interactive template tabs, testimonials, a How-It-Works timeline, and FAQ accordion.
- **♿ W3C Accessibility (a11y)** — ARIA tablist roles, properly coupled `<label>` + `id` bindings, and arrow-key-navigable radio groups.
- **🛡️ Production DevOps** — `vercel.json` security headers, Open Graph image, analytics integration hooks, and `robots.txt`/`sitemap.xml`.

### Upgrade Notes
This release is backwards compatible with v0.1.0 local storage data. On first load, legacy data is automatically migrated into a "Default Workspace".

---

## 🌱 v0.1.0 — MVP (Minimum Viable Product)
**Released: 2026-06-12**

The initial public release of OwlREADME.

### Highlights
- **README Builder** — Edit profile fields (name, role, about, skills, projects, socials) and preview them rendered as markdown.
- **Roadmap Builder** — Manage a list of learning milestones with prefilled Frontend/Backend/DevOps templates.
- **GitHub Sync** — Fetch a GitHub user's public profile data (avatar, followers, public repos, star counts) and pre-fill the README form.
- **Template System** — Switch between Minimal, Professional, Developer, and Portfolio README styles.
- **Live Preview** — A dedicated preview pane rendering the raw generated markdown in real time.
- **Basic Export** — Download `README.md` and `roadmap.md` as plain text files.

---

## 🗺️ Upcoming: v1.0.0 — Production Auth & Cloud Sync
**Target: Q3 2026**

- **GitHub OAuth Login** — Full authentication for private repo access and elevated API rate limits.
- **Relational Cloud Sync** — PostgreSQL / Firestore database to persist workspaces across devices and accounts.
- **Visual Roadmap Canvas** — Drag-and-drop node graph replacing the list-based editor.
- **Static Share Page SEO** — Pre-rendered public profile and roadmap pages for search engine indexing.
---

*OwlREADME follows [Semantic Versioning](https://semver.org/).*
