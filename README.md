# Portfolio Frontend

A React and TypeScript portfolio website built with Vite. The site loads portfolio content from a backend API and presents it through responsive pages for projects, skills, experience, education, services, and contact.

## Features

- API-backed profile, project, career, education, skills, language, service, and social data
- Home page with hero, about, and featured projects sections
- Project listing and slug-based project detail pages
- Loading and error states for API-backed sections
- Contact form and newsletter subscription integrations
- Responsive navigation, SEO metadata, smooth scrolling, and theme support
- SPA fallback configuration for Vercel and Netlify-style deployments

## Routes

| Route | Page |
| --- | --- |
| `/` | Home and featured projects |
| `/about` | About, services, and languages |
| `/projects` | All projects |
| `/projects/:slug` | Project details |
| `/skills` | Skills and professional traits |
| `/experience` | Career timeline |
| `/education` | Education and learning |
| `/contact` | Contact form |

## Getting Started

Requirements: Node.js 20.19 or newer and a running portfolio API.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:5173` by default.

The frontend uses `http://localhost:5000` as the API URL by default. Set `API_URL` when the backend runs elsewhere:

```bash
API_URL=https://api.example.com npm run dev
```

## Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Project Structure

```text
src/
├── components/   # Portfolio sections and reusable UI components
├── hooks/         # Shared React hooks
├── lib/api.ts     # API client, data normalization, and API types
├── pages/         # Route-level portfolio pages
├── App.tsx        # Data loading and application routes
└── main.tsx       # Application entry point
public/            # Static metadata, redirects, and public assets
```

## Deployment

Build the application with `npm run build` and deploy the generated `dist/` directory. Configure `API_URL` in the deployment environment and ensure the hosting provider rewrites application routes to `index.html`.
