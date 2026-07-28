# 🦉 OwlREADME

[![Build & Test Suite](https://github.com/SunilKumarKV/owlreadme/actions/workflows/ci.yml/badge.svg)](https://github.com/SunilKumarKV/owlreadme/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](package.json)
[![pnpm Version](https://img.shields.io/badge/pnpm-10.15.0-blue)](package.json)

**OwlREADME** is an enterprise-grade, visual developer workspace that enables developers to instantly generate stunning GitHub Profile READMEs, design step-by-step learning roadmaps, consult AI assistants for resume suggestions, inspect repository analytics, and showcase layouts in an interactive community gallery.

Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**, OwlREADME features an offline-first architecture powered by Zustand local persistence, strict Content Security Policy protections, and zero-compromise type safety.

🔗 **Live Demo:** [https://owlreadme.vercel.app](https://owlreadme.vercel.app)

---

## 🌟 Key Features

- **GitHub Repository Analyzer**: Automatically scans public repositories to calculate language frequencies, star counts, and recommend profile keywords.
- **Visual Profile README Builder**: Design markdown profiles with live side-by-side previews, social badges, location pins, and custom section overrides.
- **Milestone Roadmap Designer**: Map custom learning curriculums with visual timelines using built-in developer presets or blank canvases.
- **README Showcase Gallery (`/gallery`)**: Explore responsive community profile cards, inspect raw Markdown, and clone layout presets directly into your workspace.
- **Version Control & Snapshots**: In-memory and local timeline history supporting undo/redo stacks, Ctrl+Z/Ctrl+Y shortcuts, manual snap points, and side-by-side diff comparisons.
- **Secure Server-Routed Owl AI**: Consult smart bio taglines, portfolio write-ups, and learning steps via a secure server route (`/api/ai`) that protects API credentials.
- **Interactive SVG Analytics Charts**: View data distributions for programming languages, exports history, and push schedules.
- **Multi-Workspace Management**: Auto-saving workspace hub supporting multiple project configurations, renaming, duplication, and session restoration.
- **Export Studio**: Download files (`README.md`, `roadmap.md`), package workspaces into ZIP archives, print PDF summaries, or generate public share URLs.

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Next.js 16 Frontend                              │
│                                                                             │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐   │
│   │ React 19 UI / Views │   │  Zustand Workspace  │   │ UIW MD Preview  │   │
│   │ (App Router & Pages)│◄──┤ Local Persist Store │◄──┤ (Client-side)   │   │
│   └──────────┬──────────┘   └─────────────────────┘   └─────────────────┘   │
└──────────────┼──────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Next.js API Proxy & Server                         │
│                                                                             │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐   │
│   │  /api/ai Route      │   │  Rate Limiter       │   │ Strict CSP      │   │
│   │  (Server Proxy)     │◄──┤  (10 req/min per IP)│   │ (Vercel Headers)│   │
│   └──────────┬──────────┘   └─────────────────────┘   └─────────────────┘   │
└──────────────┼──────────────────────────────────────────────────────────────┘
               │ Secure Header (x-goog-api-key)
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           External Integrations                             │
│                                                                             │
│   ┌─────────────────────┐                           ┌───────────────────┐   │
│   │ Google Gemini API   │                           │ GitHub REST/GQL   │   │
│   └─────────────────────┘                           └───────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

```text
owlreadme/
├── .github/               # CI/CD workflows, issue templates, dependabot
├── docs/                  # Detailed documentation and community guides
├── public/                # Static branding assets and images
│   └── branding/          # Logos, favicons, open graph cards
├── scripts/               # CI dashboard generation scripts
├── src/
│   ├── app/               # Next.js App Router (pages & /api/ai proxy)
│   ├── components/        # Reusable UI controls (Button, Input, Dropdown, FocusTrap)
│   ├── config/            # Branding constants, SEO defaults, asset links
│   ├── design-system/     # Design tokens and global CSS themes
│   ├── features/          # Feature modules (dashboard, preview, readme-builder, showcase)
│   ├── packages/          # Decoupled engines:
│   │   ├── ai-platform/   # Multi-provider AI adapters & prompt builders
│   │   ├── api-client/    # Unified HTTP request manager & caching
│   │   ├── github/        # GitHub API client, validators & parser
│   │   ├── rate-limiter/  # Sliding-window rate limiter
│   │   ├── readme-engine/ # Markdown generator & section registries
│   │   └── theme-engine/  # Color themes & CSS variable compiler
│   ├── stores/            # Zustand state stores (readme, roadmap, workspace, theme)
│   ├── test/              # Vitest setup & testing utilities
│   ├── types/             # Shared TypeScript type declarations
│   └── utils/             # Helper utilities (markdown, export, validators)
├── next.config.ts         # Next.js configuration
├── package.json           # Package configuration & scripts
├── playwright.config.ts   # Playwright E2E test configuration
├── tsconfig.json          # TypeScript strict configuration
├── vercel.json            # Deployment headers & Content Security Policy
└── vitest.config.ts       # Vitest unit test configuration
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` for local development:

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-side Gemini API key for Owl AI services | Optional (Fallback to rule engine) | `""` |
| `NEXT_PUBLIC_APP_URL` | Public canonical application URL for SEO & metadata | Optional | `http://localhost:3000` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Optional Google Analytics Measurement ID | Optional | `""` |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: `>= 22.0.0`
- **pnpm**: `10.15.0`

```bash
# 1. Clone the repository
git clone https://github.com/SunilKumarKV/owlreadme.git
cd owlreadme

# 2. Install dependencies
pnpm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

OwlREADME includes a multi-layered testing suite comprising unit, integration, accessibility, and Playwright E2E regression tests.

```bash
# Run TypeScript type check
pnpm exec tsc --noEmit

# Run ESLint static analysis
pnpm lint

# Run Vitest unit & integration tests
pnpm test

# Run Vitest with coverage report
pnpm test:coverage

# Run Playwright E2E smoke tests
pnpm test:smoke

# Run Playwright accessibility tests
pnpm test:a11y

# Run full CI test suite (type-check + lint + coverage + E2E)
pnpm test:ci
```

---

## 🚢 Production Deployment

OwlREADME is optimized for deployment on **Vercel** or any Node.js container runner.

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start
```

### Deployment Configuration (`vercel.json`)
The application includes production security headers:
- `Content-Security-Policy`: Strict CSP without `'unsafe-eval'`.
- `X-Frame-Options: DENY`: Anti-clickjacking protection.
- `X-Content-Type-Options: nosniff`: Anti-MIME sniffing.
- `Strict-Transport-Security`: HSTS preloaded.

---

## 🔌 API Overview

### `POST /api/ai`
Proxies AI requests to Google Gemini server-side using HTTP header authorization (`x-goog-api-key`).

- **Rate Limit:** 10 requests per 60 seconds per IP.
- **Max Body Size:** 50 KB.
- **Allowed Actions:** `readme`, `roadmap`, `profile`, `improve`.

```json
// Request Body
{
  "action": "readme",
  "payload": {
    "name": "Developer Name",
    "role": "Full Stack Engineer",
    "skills": "React, TypeScript, Node.js"
  }
}

// Success Response (200 OK)
{
  "data": {
    "tagline": "Crafting resilient web applications...",
    "suggestedSections": ["Projects", "Tech Stack"]
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Branch naming guidelines (`feat/`, `fix/`, `docs/`, `refactor/`).
- Conventional Commit formats (`feat(api): ...`).
- Submitting Pull Requests and running test suites.

---

## 🔒 Security Policy

Please see [SECURITY.md](SECURITY.md) for details on reporting security vulnerabilities and our disclosure policy.

---

## 🗺️ Project Roadmap

- [x] Next.js 16 & React 19 Upgrade
- [x] README Showcase Gallery under `/gallery`
- [x] Client-Side Version Control Snapshots & Timeline Diff
- [x] Strict CSP Header Enforcement & Server API Key Proxying
- [ ] GitHub OAuth Sign-In Integration
- [ ] Relational Cloud Database Synchronization (PostgreSQL)
- [ ] Drag-and-Drop Node Canvas for Roadmaps

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Is my data sent to external servers?**  
A: No. Workspace data is stored locally in your browser via Zustand `localStorage`. Only explicitly initiated AI requests are sent via `/api/ai`.

**Q: Can I use OwlREADME without an API key?**  
A: Yes! If `GEMINI_API_KEY` is not set, OwlREADME automatically falls back to an internal rule-based synthesis engine.

---

## 🛠️ Troubleshooting

**Issue: `pnpm install` fails due to Node version mismatch.**  
*Fix:* Ensure Node.js `>= 22.0.0` is active in your shell (`node -v`).

**Issue: Playwright tests fail locally.**  
*Fix:* Run `pnpm exec playwright install --with-deps` to download browser binaries.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
