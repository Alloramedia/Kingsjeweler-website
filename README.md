# Pit & Masa Website

**Bold cuisine. Refined event service.**

This is the source code for the [Pit & Masa](https://www.pitandmasa.com) website — a
full-service catering and cuisine company serving weddings, private events, and
corporate dining in Connecticut.

The site is a Next.js skeleton trimmed down to a lean set of catering-focused
pages.

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
pit-masa/
├── public/                   # Images and static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (Header, Footer, GA4, structured data)
│   │   ├── page.tsx          # Home page
│   │   ├── HomeClient.tsx    # Home page client component
│   │   ├── sitemap.ts        # Sitemap
│   │   ├── robots.ts         # Robots.txt
│   │   ├── manifest.ts       # PWA manifest
│   │   ├── menu/             # Menu page
│   │   ├── catering/         # Catering page
│   │   ├── events/           # Events page
│   │   ├── gallery/          # Gallery page
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact form + booking + thank-you
│   │   ├── website-policies/ # Privacy policy + terms of service
│   │   └── api/contact/      # Contact form API route
│   ├── components/           # Header, Footer, CTA, sections, structured data, etc.
│   └── lib/
│       ├── constants.ts      # Site config, nav links, footer links
│       ├── cta.ts            # Shared CTA content
│       └── utils.ts          # cn() utility
├── redirects.json            # Legacy URL → new URL mapping (currently empty)
├── next.config.ts            # Next.js config
└── package.json
```

> The application lives in the `pit-masa/` directory.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd pit-masa
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in `pit-masa/` with:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`) |
| `CONTACT_EMAIL` | Email address for contact form submissions |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, catering highlights, primary CTAs |
| `/menu` | Menu offerings |
| `/catering` | Catering services |
| `/events` | Events and private dining |
| `/gallery` | Photo gallery |
| `/about` | Company story |
| `/contact` | Lead intake form, booking, and thank-you flow |
| `/website-policies` | Privacy policy and terms of service |

## SEO Features

- **Per-page metadata** — Title, description, OpenGraph, Twitter cards
- **Sitemap + robots.txt** — Generated from the static routes
- **Structured data** — LocalBusiness and Organization schema
- **Image optimization** — AVIF/WebP via `next/image`

## Deployment

Optimized for deployment on:
- **Vercel** (recommended) — zero-config with Next.js
- **Netlify** — with `@netlify/plugin-nextjs`

## Contact Form

The contact form submits to `/api/contact`, which currently logs submissions to the
console. To integrate with an email service, update
`src/app/api/contact/route.ts` with the provider's send logic and supply credentials
via environment variables.

## License

Private — Pit & Masa. All rights reserved.
