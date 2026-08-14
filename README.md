# King's Jeweler Website

**Fine Jewelry. Family Service.**

This is the source code for the [King's Jeweler](https://www.kingsjewelerct.com) website — a
family jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut.
Engagement rings, custom design, watch batteries, expert repairs, and fair gold buying.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Analytics | Google Analytics 4 (via `@next/third-parties`) |
| Fonts | Red Hat Display + Red Hat Text (via `next/font`) |

## Project Structure

```
kings-jeweler/
├── public/                   # Images and static assets
├── content/
│   └── overrides.json        # Published admin content (repo backup)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (Header, Footer, GA4, structured data)
│   │   ├── page.tsx          # Home page
│   │   ├── HomeClient.tsx    # Home page client component
│   │   ├── sitemap.ts        # Sitemap
│   │   ├── robots.ts         # Robots.txt
│   │   ├── manifest.ts       # PWA manifest
│   │   ├── services/         # Services page
│   │   ├── gallery/          # Gallery page
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact form + meeting + thank-you
│   │   ├── website-policies/ # Privacy policy + terms of service
│   │   ├── admin/            # Protected admin dashboard
│   │   └── api/              # Contact + admin API routes
│   ├── components/           # Header, Footer, CTA, sections, structured data, etc.
│   └── lib/
│       ├── constants.ts      # Site config, nav links, footer links
│       ├── cta.ts            # Shared CTA content
│       ├── admin/            # Admin auth, storage, content schema
│       └── utils.ts          # cn() utility
├── redirects.json            # Legacy URL → new URL mapping
├── next.config.ts            # Next.js config
└── package.json
```

> The application lives in the `kings-jeweler/` directory.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd kings-jeweler
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Or from the repo root: `make dev`

### Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in `kings-jeweler/` with:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`) |
| `CONTACT_EMAIL` | Email address for contact form submissions |
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard |
| `GITHUB_CONTENT_PATH` | Optional — repo path for the published-content backup (default `kings-jeweler/content/overrides.json`) |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, services highlights, gold buying, FAQs |
| `/services` | Services — rings, custom design, repairs, watch batteries, appraisals |
| `/gallery` | Photo gallery of custom work and showcase pieces |
| `/about` | Store story |
| `/contact` | Visit info, lead intake form, and thank-you flow |
| `/website-policies` | Privacy policy and terms of service |
| `/admin` | Protected content-management dashboard |

## SEO Features

- **Per-page metadata** — Title, description, OpenGraph, Twitter cards
- **Sitemap + robots.txt** — Generated from the static routes
- **Structured data** — JewelryStore, Organization, and FAQPage schema
- **Image optimization** — AVIF/WebP via `next/image`

## Deployment

Deployed on **Netlify** with `@netlify/plugin-nextjs` (build base: `kings-jeweler/`,
see `netlify.toml`). Also compatible with Vercel.

## Contact Form

The contact form submits to `/api/contact`. To integrate with an email service, update
`src/app/api/contact/route.ts` with the provider's send logic and supply credentials
via environment variables.

## License

Private — King's Jeweler. All rights reserved.
