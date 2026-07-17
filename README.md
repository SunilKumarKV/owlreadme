# 🦉 OwlREADME

OwlREADME is a professional, visual developer workspace that allows you to instantly generate beautiful GitHub Profile READMEs, customize step-by-step learning roadmaps, consult AI assistants for resume and timeline suggestions, and track repository metrics in dynamic, interactive dashboards.

Built with Next.js, React 19, and Tailwind CSS, OwlREADME runs entirely in the browser with offline-first local storage, allowing you to manage multiple project workspaces seamlessly with complete data privacy.

Live demo: https://owlreadme.com

---

## 🚀 Features

- **GitHub Repository Analyzer**: Automatically scans public repositories to calculate language frequencies, identify top starred or active repos, and recommend profile keywords.
- **Visual Profile README Editor**: Build professional markdown profiles with live side-by-side preview, social badges, location pins, and custom section overrides.
- **Milestone Roadmap Designer**: Map custom learning curriculums with visual timelines, using built-in presets or blank templates.
- **Secure Server-Routed Owl AI**: Get smart bio taglines, portfolio write-ups, and next-topic recommendations. Calls are proxied through a secure server-side API to protect credentials.
- **Interactive SVG Analytics Charts**: View data distributions for programming languages, exports history, and push schedules.
- **Multi-Workspace Hub**: Manage, rename, duplicate, and swap between multiple project workspaces with debounced local auto-saving.
- **Export Studio**: Download files (`README.md`, `roadmap.md`), package workspaces into ZIP archives, print PDF summaries, or copy public share URLs.

---

## 📸 Screenshots & Showcase

| Product Dashboard | Interactive Workspace Builder |
| --- | --- |
| ![Dashboard Screenshot](https://raw.githubusercontent.com/SunilKumarKV/owlreadme/main/public/branding/og-image.jpg) | ![Builder Screenshot](https://raw.githubusercontent.com/SunilKumarKV/owlreadme/main/public/branding/og-image-dark.jpg) |
| *View repository statistics, language graphs, and recent work* | *Build and customize live markdown profiles and milestones* |

| SVG Analytics Console | Owl AI Assistant |
| --- | --- |
| ![Analytics Screenshot](https://raw.githubusercontent.com/SunilKumarKV/owlreadme/main/public/branding/og-image-dark.jpg) | ![AI Assistant Screenshot](https://raw.githubusercontent.com/SunilKumarKV/owlreadme/main/public/branding/og-image.jpg) |
| *Visualize commit activities, repo breakdown, and export logs* | *Get smart bio recommendations and next-step guides* |

---

## 🛠️ Technologies Used

- **Framework**: Next.js (App Router, Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS & Custom CSS variables
- **State Management**: Zustand (with Persist localStorage middleware)
- **Icons**: Lucide React
- **Markdown Editor**: `@uiw/react-md-editor` (dynamic SSR-disabled load)
- **ZIP Compression**: `jszip`
- **Compiler/Bundler**: TypeScript, Turbopack, Vitest

---

## 📂 Project Structure

```text
├── .github/               # Issue templates, config, and workflows
├── docs/                  # Detailed guidebooks and community resources
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   ├── components/        # Reusable UI controls (Input, Button, Charts)
│   ├── config/            # Project-wide constants and branding info
│   ├── features/          # Core pages and layout views (dashboard, preview, builders)
│   ├── packages/          # Isolated engines (github client, readme engine, theme registry)
│   ├── stores/            # State stores (Zustand) for history, templates, and workspace
│   └── utils/             # Helper utilities (markdown compilers, sanitization, schemas)
├── package.json           # Scripts and package dependencies
└── tsconfig.json          # TypeScript compiler configuration
```

---

## 📦 Installation & Local Development

To run OwlREADME locally, ensure you have Node.js (v18+) and `pnpm` installed.

### 1. Clone the repository
```bash
git clone https://github.com/SunilKumarKV/owlreadme.git
cd owlreadme
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory. You can copy the template provided in `.env.example`:
```bash
cp .env.example .env.local
```
Add your keys:
```env
# Secure Server-Side Gemini API Key (Optional, for AI Assistant)
GEMINI_API_KEY=your_gemini_api_key_here

# Public App URL for Sitemap / Share Links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server
```bash
pnpm run dev
```

### 5. Open in browser
Navigate to [http://localhost:3000](http://localhost:3000) to view the SaaS landing page.

---

## 🏗️ Build & Production Instructions

To verify types, build, and run the production server locally:

```bash
# Run TypeScript compilation check
pnpm tsc --noEmit

# Run project linter
pnpm lint

# Run all unit tests
pnpm test

# Build production bundle
pnpm build

# Start the production build server
pnpm start
```

---

## 🗺️ Roadmap & Plans

See the full roadmap in [ROADMAP.md](ROADMAP.md).
- [x] **v0.1.0**: Core markdown generators & template pre-fills.
- [x] **v0.5.0**: Zustand workspaces, secure API route, SVG analytics, and SaaS landing.
- [x] **v1.1.0**: Responsive Showcase Gallery, Client-side Version Snapshot Diff/Restores, Share payload schema validation, and PDF sanitization.
- [ ] **v1.2.0**: GitHub OAuth sign-in integration and relational cloud syncing with PostgreSQL/Firestore to support user accounts.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our commit conventions, branch names, and pull request review flow.

### 🌱 Good First Issues
Browse our curated [Good First Issues](docs/good-first-issues.md) — every task includes a clear hint and files list to help get you started.

---

## 🙋 FAQ

#### Q: Where is my workspace data saved?
All workspace files, snapshots, history, and template settings are saved in your browser's local storage. None of your layout data is transmitted to our servers.

#### Q: How does the AI Assistant work?
If a Gemini API key is configured, your prompts are securely routed through our Next.js API endpoint proxy to keep API credentials secure from the client bundle.

#### Q: What formats can I export?
You can copy compiled markdown directly, download files (`README.md`, `roadmap.md`), package multiple workspaces into ZIP archives, or print a formatted PDF summary.

---

## 💬 Support & Contact

If you find a bug, have questions, or want to discuss enhancements:
* Open an issue on our [GitHub Issues](https://github.com/SunilKumarKV/owlreadme/issues) board.
* Start a thread on [GitHub Discussions](https://github.com/SunilKumarKV/owlreadme/discussions).
* For security vulnerabilities or private questions, email us at **support@owlreadme.com**.

---

## 🙏 Acknowledgements

OwlREADME is built with the support of the open-source ecosystem, including Next.js, React, Tailwind CSS, Zustand, and the broader developer tools community.

## ⚖️ License-

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
