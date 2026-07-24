# Credora Financial — Corporate Website

> A modern, enterprise-grade financial services website for **Credora Financial**, built with Next.js 16, TypeScript, Tailwind CSS 4, and Prisma. Features a Tata Capital-inspired hero section, product catalog, service pages, blog, admin dashboard, and full contact/career/referral workflows.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + tw-animate-css |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Animations** | Framer Motion 12 |
| **Database** | SQLite via Prisma ORM |
| **Auth** | NextAuth.js (admin panel) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **State** | Zustand + TanStack React Query |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + design system
│   ├── about/                    # About Us page
│   ├── admin/                    # Admin dashboard + login
│   ├── api/                      # API routes
│   │   ├── contact/              # Contact form handler
│   │   ├── brochure/             # Brochure download/upload
│   │   ├── careers/              # Job applications handler
│   │   ├── positions/            # Job positions CRUD
│   │   └── admin/                # Admin CRUD (contacts, referrals, etc.)
│   ├── blog/                     # Blog listing + [id] pages
│   ├── careers/                  # Careers page
│   ├── contact/                  # Contact page
│   ├── emi-calculator/           # EMI Calculator tool
│   ├── products/                 # Product pages
│   │   ├── msme-loans/
│   │   ├── project-finance/
│   │   ├── supply-chain-finance/
│   │   ├── cross-border-finance/
│   │   └── specialized-finance/
│   ├── services/                 # Service pages
│   │   ├── credit-repair/
│   │   ├── fund-raising/
│   │   ├── pre-underwriting-loan-structuring/
│   │   └── end-to-end-support/
│   ├── referral-partner/         # Referral partner program
│   ├── privacy-policy/
│   └── terms-and-conditions/
│
├── components/
│   ├── sections/                 # Page section components
│   │   ├── Hero.tsx              # Hero banner (Tata Capital style)
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Site footer
│   │   ├── AboutUs.tsx
│   │   ├── Products.tsx
│   │   ├── Services.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── WhatWeDo.tsx
│   │   ├── KeyNumbers.tsx
│   │   ├── ProcessFlow.tsx
│   │   ├── CTABanner.tsx
│   │   ├── ReferralPartner.tsx
│   │   └── ContactUs.tsx
│   └── ui/                       # shadcn/ui primitives
│
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── supabase.ts               # Supabase client
│   ├── animations.ts             # Framer Motion animation helpers
│   └── utils.ts                  # Utility functions (cn, etc.)
│
└── prisma/
    └── schema.prisma             # Database schema (SQLite)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm** or **bun** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/picasocode/credorafin.git
cd credorafin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Initialize the database
npx prisma db push
npx prisma generate

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (if used)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Admin seed (optional — used on first run)
ADMIN_EMAIL="admin@credora.in"
ADMIN_PASSWORD="changeme"
```

---

## Key Features

### Public Website

- **Hero Section** — Tata Capital-inspired full-width banner with carousel, left text + right image layout, product quick links strip, and stats bar
- **Products** — MSME Loans, Project Finance, Supply Chain Finance, Cross-Border Finance, Specialized Finance
- **Services** — Credit Repair, Fund Raising, Pre-Underwriting & Loan Structuring, End-to-End Support
- **EMI Calculator** — Interactive loan EMI calculator with amortization schedule
- **Blog** — SEO-friendly blog with MDX-powered articles
- **Careers** — Job listings with application form and resume upload
- **Referral Partner** — Partner registration and program details
- **Contact** — Multi-field inquiry form with backend storage

### Admin Dashboard

- Secure login with role-based access (super_admin / admin / viewer)
- Contact inquiry management with status tracking
- Referral partner management with approval workflow
- Job position CRUD (create, edit, deactivate)
- Job application review pipeline
- Brochure upload and management per product
- Product content overrides (title, description, brochure)
- Dashboard stats and analytics

### Design System

- **Brand Colors**: Deep Indigo `#1C1D62`, Brand Blue `#304AC0`, Logo Navy `#13277E`, Logo Green `#87B73C`
- **Typography**: Poppins font family with optimized rendering
- **Components**: Consistent shadcn/ui primitives with Credora theming
- **Interactions**: Smooth hover transitions, card lifts, scroll reveals
- **Custom scrollbar**, gradient text utilities, decorative dividers, and link underline animations

---

## Database Schema

The app uses **SQLite** via Prisma with the following models:

| Model | Purpose |
|-------|---------|
| `AdminUser` | Admin dashboard users with role-based access |
| `ContactInquiry` | Contact form submissions with status pipeline |
| `ReferralPartner` | Referral partner registrations with approval flow |
| `JobPosition` | Job listings with skills, salary, and active status |
| `JobApplication` | Career applications with resume uploads |
| `BrochureDownload` | Brochure download tracking with email capture |
| `BrochureFile` | Uploaded brochure files per product |
| `ProductOverride` | Product content overrides from admin |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build (Turbopack) with standalone output |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:reset` | Reset database (destroys data) |

---

## Deployment

The project is configured for **standalone output** (`output: "standalone"` in `next.config.ts`), making it compatible with:

- **Docker** — Copy `.next/standalone`, `.next/static`, and `public/` into a minimal container
- **Vercel** — Push to GitHub and connect the repo for zero-config deployment
- **VPS / Bare Metal** — Run `npm run build && npm run start`

The build script automatically copies static assets and public files into the standalone output directory.

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit contact inquiry |
| `POST` | `/api/careers` | Submit job application |
| `GET` | `/api/positions` | List active job positions |
| `GET` | `/api/brochure?slug=msme-loans` | Get brochure for a product |
| `GET` | `/api/brochure/download/[slug]` | Download brochure PDF |
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/me` | Get current admin user |
| `GET/POST` | `/api/admin/contacts` | List/create contact inquiries |
| `GET/POST` | `/api/admin/referrals` | List/create referral partners |
| `GET/POST` | `/api/admin/positions` | List/create job positions |
| `GET/POST` | `/api/admin/applications` | List/create job applications |
| `GET/POST` | `/api/admin/brochures` | List/upload brochure files |
| `GET/POST` | `/api/admin/products` | List/update product overrides |
| `GET` | `/api/admin/stats` | Dashboard statistics |

---

## Image Assets

Product, service, and page images are stored in `public/images/`:

```
public/images/
├── credora-logo.png              # Primary logo
├── credora-logo-full.png         # Full logo with text
├── blog/                         # Blog post images
├── pages/                        # Page-specific images
│   ├── hero-indian-team.png      # Hero carousel slide 1
│   ├── indian-professional.png   # Hero carousel slide 2
│   ├── office-india.png          # Hero carousel slide 3
│   └── ...
├── products/                     # Product page images
└── services/                     # Service page images
```

---

## License

Proprietary — All rights reserved by Credora Financial.
