# CPM Project Website

Companion site for the MICRO 2026 paper
**"Non-intrusive Cache Side Channel Protection Near Memory"** (CPM).

Live production URL: https://seam-proj.netlify.app

## Site Contents

The single landing page (`pages/index.js`) walks through the paper in five sections:

- **Hero / Abstract** — the non-intrusive positioning and what CPM delivers.
- **Motivation** — why memory sharing is disabled in data centers today (reuse-based side channels, current practice, why prior hardware defenses are too invasive).
- **Approach** — the "merge at the memory endpoint" idea, a 3-figure comparison of current deployment / prior defenses / CPM, a components-touched table, and the OS-side procedures + KSM integration + full Linux patch file-by-file overview.
- **Generality** — multi-socket support, huge pages, and applicability to conflict side channels.
- **Evaluation** — Flush+Reload across six scenarios (containers / VMs / host × same-core / different-core), access-latency distribution, performance and memory-saving stats, and VM-density sensitivity.
- **Download** — the Linux 5.10.235 kernel patch served at `/seam_v5.10.235.patch`.

## Repo Layout

```
pages/          Next.js pages (index.js is the whole site)
components/     Header/Footer
styles/         globals.css
public/         Static assets served at site root: figures, favicon, kernel patch
files/          Source-of-truth for the paper PDF and kernel patch (master copy
                of seam_v5.10.235.patch is kept here; public/ is a copy)
netlify.toml    Netlify build config (publishes .next/)
```

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000 with hot reload
```

Edit `pages/index.js` and the page auto-reloads.

## Build

```bash
npm run build    # produces .next/ (Netlify publishes this)
```

## Deploy

Deploys are GitHub-driven: **pushing to `main` auto-publishes to production** via Netlify's GitHub integration. No manual step needed.

Draft / preview deploys via the Netlify CLI:

```bash
netlify deploy          # draft URL, does NOT touch production
netlify deploy --prod   # promote to seam-proj.netlify.app
```

Check deploy status:

```bash
netlify status
```

## Updating the Kernel Patch

`files/seam_v5.10.235.patch` is the source of truth. The download link on the site points to `public/seam_v5.10.235.patch`, so after editing the patch, sync the copy:

```bash
cp files/seam_v5.10.235.patch public/seam_v5.10.235.patch
```

Then commit both and push.
