# Contributing to OwlREADME

Thank you for your interest in contributing to OwlREADME! We welcome contributions in bug fixes, performance optimizations, accessibility enhancements, documentation, and new feature additions.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `>= 22.0.0`
- **pnpm**: `10.15.0`

### 2. Setup Workflow
```bash
# 1. Fork & Clone the repository
git clone https://github.com/your-username/owlreadme.git
cd owlreadme

# 2. Install dependencies
pnpm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start local development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 🌿 Branch Naming Conventions

Prefix branch names based on the nature of your work:

- `feat/` — New features (e.g. `feat/oauth-github-auth`)
- `fix/` — Bug fixes (e.g. `fix/focus-trap-raf-cleanup`)
- `docs/` — Documentation updates (e.g. `docs/update-security-policy`)
- `refactor/` — Code quality or type refactoring (e.g. `refactor/api-routes`)
- `perf/` — Performance optimizations (e.g. `perf/showcase-memoization`)
- `test/` — Adding or updating test suites (e.g. `test/add-playwright-smoke`)

---

## ✍️ Commit Conventions

We follow **Conventional Commits**:

```text
<type>(<scope>): <short description>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation-only changes
- `style`: Formatting or white-space changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance tasks, dependencies, or configuration updates

### Examples
- `feat(api): secure Gemini prompts behind Next route proxy`
- `fix(security): remove unsafe-eval from Content Security Policy`
- `docs(readme): update node version requirements to v22`

---

## 🔄 Pull Request Process

1. **Create a Feature Branch**: Cut your branch from `main`.
2. **Implement Changes**: Adhere to TypeScript strict type safety, React 19 standards, and Tailwind CSS v4 patterns.
3. **Run Quality & Test Suite**:
   ```bash
   # Run full CI quality check before pushing
   pnpm test:ci
   ```
4. **Submit Pull Request**: Open a PR targeting `main`. Provide a clear summary of changes and testing steps.
5. **Code Review & Merge**: Address feedback from maintainers. PRs are squash-merged upon approval.

---

## 🔒 Security Vulnerabilities

Please do not report security vulnerabilities via public GitHub issues. Follow the disclosure instructions in [SECURITY.md](SECURITY.md).

---

## 📄 License

By contributing to OwlREADME, you agree that your contributions will be licensed under the [MIT License](LICENSE).
