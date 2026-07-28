# Security Policy

## Supported Versions

We actively maintain and provide security updates for the latest minor release of the current major version of OwlREADME.

| Version | Supported | Minimum Node.js Version |
| :--- | :--- | :--- |
| `v1.1.x` | ✅ Supported | `>= 22.0.0` |
| `< v1.1.0` | ❌ Unsupported | N/A |

---

## Production Security Controls

OwlREADME incorporates multiple defense-in-depth security layers:

### 1. Strict Content Security Policy (CSP)
Production deployments enforce a CSP header without `'unsafe-eval'`:
- Script execution is strictly restricted to trusted origins (`'self'`, Google Tag Manager).
- Frame embedding is denied (`frame-ancestors 'none'`).

### 2. Secret Protection & API Key Transport
- Client browsers never interact with external AI API keys directly.
- Server-side AI proxy (`/api/ai`) passes credentials using secure HTTP headers (`x-goog-api-key`) rather than URL query parameters.

### 3. Server-Side Request Forgery (SSRF) Protection
- Raw GitHub README imports enforce strict hostname allowlisting (`raw.githubusercontent.com`, `gist.githubusercontent.com`), preventing requests against local or cloud metadata IPs (`169.254.169.254`).

### 4. API Rate Limiting
- The `/api/ai` endpoint is protected by an in-memory sliding-window rate limiter (`10 requests / 60 seconds per IP`). Exceeded quotas return HTTP 429 status codes with `Retry-After` headers.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not report it publicly via GitHub issues**.

Instead, send a detailed security report to our team:
- **Email:** `support@owlreadme.com`

### Report Guidelines
Please include:
1. Description of the vulnerability and potential security impact.
2. Step-by-step instructions to reproduce the issue (including sample payloads or proof-of-concept scripts).
3. System details (Node.js version, browser environment, operating system).

---

## Vulnerability Handling Process

1. **Acknowledgement:** We will acknowledge receipt of your report within **48 hours**.
2. **Investigation:** Our team will investigate and verify the finding within **5 business days**.
3. **Remediation:** Confirmed vulnerabilities will be patched in a security release.
4. **Advisory:** A security advisory will be published upon release, crediting the reporter (unless anonymity is requested).

We request that you adhere to **Responsible Disclosure** guidelines, allowing at least **90 days** for remediation prior to public disclosure.
