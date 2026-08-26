# Developer Doc Platform

A developer documentation platform built with [VitePress](https://vitepress.dev/) and Markdown. It delivers systematic tutorials across 18 technology tracks and centrally indexes official docs, standards, and the tooling ecosystem.

> 中文版：[README.md](./README.md)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Content Organization](#content-organization)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **18 technology tracks**: Frontend, backend, databases, DevOps, the C-family, and more — each organized into five consistent chapters: Basics → Advanced → Project → Engineering → Ecosystem.
- **Links to official, first-hand docs**: Tutorials focus on concepts, paths, and trade-offs; API signatures, config options, and version differences link straight to official docs to avoid stale second-hand info.
- **Traceable standards**: Curated entry points to authoritative specs such as WHATWG, W3C, ECMA, ISO, IETF RFC, OCI, and OpenAPI.
- **One-stop tooling index**: Package managers, build tools, linters, test runners, CI/CD, and observability tools categorized by responsibility for quick selection.
- **Local full-text search**: Built-in mini-search with a Chinese UI — no third-party service required.
- **Versioned archives**: Historical versions (v1.0 latest / v0.9 archive) via the `versions/` directory and the navbar switcher.
- **Markdown + Git workflow**: Any page can be fixed via the "Edit this page on GitHub" link in the footer.

## Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) 1.6.4, a static site generator built on [Vue](https://vuejs.org/) 3
- **Content format**: Markdown first, with Vue components embedded where interactivity helps
- **Package manager**: npm (also compatible with pnpm / yarn)
- **Search**: Built-in mini-search local full-text search, no backend required
- **Deployment**: Pure static output, supports Docker / Vercel / Netlify / GitHub Pages / Cloudflare Pages

## Getting Started

**Prerequisites**

- Node.js 18+ (20 LTS recommended)
- npm / pnpm / yarn (any one)

**Local development**

```bash
npm install        # install dependencies
npm run dev        # start the dev server (default http://localhost:5173)
npm run build      # build for production (output to docs/.vitepress/dist/)
npm run preview    # preview the production build
```

## Project Structure

```
developer-doc-platform/
├── docs/              # documentation source
│   ├── .vitepress/   # config and theme
│   ├── guide/        # platform guides
│   ├── tutorials/    # tech tutorials (18 tracks)
│   ├── reference/    # official docs / standards / tooling index
│   ├── versions/     # historical version archives
│   ├── public/       # static assets
│   └── index.md      # home page
├── .gitignore
├── package.json      # dependencies and scripts
└── README.md
```

Directory responsibilities:

- **docs/.vitepress/**: `config.ts` main site config, `sidebar.ts` auto-generated sidebar, `theme/` theme and style overrides.
- **docs/guide/**: Documentation for the platform itself (structure, configuration, deployment).
- **docs/tutorials/**: Tutorials for 18 technology tracks — one subdirectory per track, each with five standard chapters.
- **docs/reference/**: Official documentation index, standards, and tooling/package-manager index.
- **docs/versions/**: Historical version archives, accessible via the navbar version switcher.
- **docs/public/**: Site static assets (e.g. `favicon.svg`, `logo.svg`).

## Content Organization

### Tutorials

18 technology tracks, each in its own subdirectory with an `index.md` and five standard chapters:

1. **Basics** (`01-basics.md`) — core syntax, common APIs, examples
2. **Advanced** (`02-advanced.md`) — deeper mechanics and advanced usage
3. **Project** (`03-project.md`) — end-to-end project practice
4. **Engineering** (`04-engineering.md`) — architecture, security, testing, performance, CI/CD
5. **Ecosystem** (`05-ecosystem.md`) — comparison and selection of related tools, libraries, and frameworks

### Reference

- `reference/official-docs.md` — official documentation index per track
- `reference/standards.md` — standards and specifications entry points
- `reference/tooling.md` — tooling and package-manager index

### Adding content

1. Read [Project Structure](docs/guide/project-structure.md) to learn the directory conventions.
2. When adding a new track, copy an existing tutorial's five-chapter structure and add links to the official docs index.
3. Before changing the site's appearance or structure, check [Configuration](docs/guide/configuration.md).
4. Before publishing, verify against the [Deployment Guide](docs/guide/deployment.md).

## Configuration

Site behavior is centralized in `docs/.vitepress/config.ts`:

- **Navbar**: Tutorials, Reference, Platform, version switcher (v1.0 / v0.9)
- **Sidebar**: Auto-generated by `sidebar.ts` from the file system (numeric-prefix ordering, excludes `versions/` and similar)
- **Search**: Local search with a fully localized Chinese UI
- **Language**: `zh-CN`, all UI labels localized
- **Edit link**: Points to the GitHub source file to ease community contributions

Full configuration reference: [docs/guide/configuration.md](docs/guide/configuration.md).

## Deployment

The build output is pure static files in `docs/.vitepress/dist/`, deployable to any static host:

- **Docker**: `Dockerfile` + nginx
- **Vercel / Netlify / Cloudflare Pages**: Git-based auto deploy — build command `npm run build`, publish directory `docs/.vitepress/dist`
- **GitHub Pages**: GitHub Actions CI/CD

Detailed steps, Nginx config, custom domains, and DNS: [docs/guide/deployment.md](docs/guide/deployment.md).

## Contributing

This site is maintained with Markdown + Git:

- Open any page on GitHub and click "Edit this page on GitHub" in the footer to submit a fix.
- Follow the existing directory and five-chapter conventions; prefer linking to official docs for technical details.

## License

Released under the MIT License.
