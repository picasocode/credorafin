# CredoraFin — Deployment Guide

This project is configured for **Supabase local development** and **AWS deployment**.

- **Database**: PostgreSQL via Supabase (local for dev, Supabase Cloud or AWS RDS for prod)
- **ORM**: Prisma (schema lives in `prisma/schema.prisma`)
- **Runtime**: Next.js 16 standalone output (production-optimized)
- **Container**: Multi-stage Dockerfile (works on App Runner, ECS Fargate, EKS)

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| Bun | ≥ 1.1 | `curl -fsSL https://bun.sh/install \| bash` |
| Docker | ≥ 24 | https://docs.docker.com/get-docker |
| Supabase CLI | ≥ 1.150 | `brew install supabase/tap/supabase` (macOS) or [Linux/Windows](https://supabase.com/docs/guides/local-development) |
| AWS CLI | ≥ 2.13 | `brew install awscli` (only for AWS deploy) |

Verify:
```bash
node -v && bun -v && docker -v && supabase --version
```

---

## 2. Local development with Supabase local

### 2.1 Start Supabase local
```bash
supabase start
```
This launches local Postgres, Auth, Storage, Studio, and Inbucket (email) via Docker. The first run downloads images (~5 min).

Output will show connection details. The defaults baked into `.env` are:
```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

> If your `supabase status` shows different anon/service keys, copy them into `.env`.

### 2.2 Push the schema + seed
```bash
bun install                       # install deps (first time only)
bun run db:generate               # generate Prisma client for PostgreSQL
bun run db:push                   # create all 11 tables in local Supabase
bun run db:seed                   # seed admin user, 6 positions, 5 hero slides, 6 blog posts
```

Admin login after seeding: **admin@credora.in / credora@admin123**

### 2.3 Run the app
```bash
bun run dev
```
Open http://localhost:3000 (or use the preview panel).

### 2.4 Useful Supabase commands
```bash
supabase status                   # show running services + keys
supabase stop                     # stop local Supabase (keeps data)
supabase stop --backup            # stop + backup data for next start
supabase db reset                 # wipe + re-apply all migrations
supabase db push                  # apply new migrations
supabase studio                   # open local Studio at http://127.0.0.1:54323
```

### 2.5 Making schema changes
1. Edit `prisma/schema.prisma`.
2. Run `bun run db:push` (development — applies changes directly).
3. For a tracked migration instead: `bun run db:migrate -- --name describe_change`.
4. Mirror structural changes into `supabase/migrations/` if you want them
   applied via `supabase db push` from the Supabase side too.

---

## 3. Production database options

You have two supported paths. Pick ONE.

### Option A — Supabase Cloud (recommended, simplest)
1. Create a project at https://supabase.com/dashboard.
2. Project Settings → Database → Connection string → URI. Copy it.
3. Project Settings → API → copy `Project URL`, `anon public` key, `service_role` key.
4. Set these as production environment variables (see §4):
   ```
   DATABASE_URL=postgresql://postgres.xxxx:password@aws-0-region.pooler.supabase.com:5432/postgres?schema=public
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
5. Apply schema: `bun run db:push` (run once locally against the cloud DB,
   or the container does it on startup).
6. Seed: `bun run db:seed` (run once locally against the cloud DB).

### Option B — AWS RDS for PostgreSQL
1. Create an RDS PostgreSQL 15+ instance (free tier: `db.t4g.micro`).
2. Set `DATABASE_URL=postgresql://credora:password@<rds-endpoint>:5432/credora?schema=public`.
3. Ensure the RDS security group allows inbound 5432 from the ECS task / App Runner VPC.
4. Apply schema + seed as in Option A.
5. You can leave the `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY`
   vars unset if you don't use Supabase Storage/Auth (Prisma handles the DB).

---

## 4. AWS deployment

The Dockerfile produces a minimal standalone image (~150 MB) that runs on any
container host. Three supported AWS targets below — pick the simplest that
fits your scale.

### Required production environment variables
| Var | Required | Notes |
|-----|----------|-------|
| `DATABASE_URL` | yes | Supabase Cloud or RDS Postgres connection string |
| `NEXTAUTH_SECRET` | yes | long random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | yes | your public URL, e.g. `https://credora.example.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | if using Supabase | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | if using Supabase | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | if using Supabase | service role key (bypasses RLS) |
| `ADMIN_EMAIL` | recommended | seed admin email |
| `ADMIN_PASSWORD` | recommended | seed admin password |

### 4.1 AWS App Runner (simplest — recommended)
App Runner builds the image from your repo and auto-deploys on push.

1. Push this repo to GitHub / CodeCommit.
2. AWS Console → App Runner → Create service → Source: code repository.
3. Pick the repo + branch. App Runner auto-detects `apprunner.yaml`.
4. Under **Build** settings, the Dockerfile builds the standalone image.
5. Under **Environment variables**, add every required var from the table above.
   Mark secrets as **secret** type (backed by Secrets Manager / Parameter Store).
6. Create service. App Runner assigns a `*.awsapprunner.com` URL.
7. Map your domain: App Runner → Custom domains → add `credora.example.com`.
8. The container runs `prisma db push` on every start, so schema stays in sync.

```bash
# CLI equivalent:
aws apprunner create-service \
  --service-name credorafin \
  --source-configuration file://apprunner.yaml \
  --instance-configuration '{"Cpu":"1024","Memory":"2048"}'
```

### 4.2 AWS ECS Fargate (more control)
1. Build + push the image to ECR:
   ```bash
   aws ecr create-repository --repository-name credorafin
   docker build -t credorafin .
   docker tag credorafin:latest <ACCT>.dkr.ecr.<REGION>.amazonaws.com/credorafin:latest
   aws ecr get-login-password | docker login --username AWS --password-stdin <ACCT>.dkr.ecr.<REGION>.amazonaws.com
   docker push <ACCT>.dkr.ecr.<REGION>.amazonaws.com/credorafin:latest
   ```
2. Store secrets in AWS Secrets Manager (one secret per env var) — note each ARN.
3. Edit `aws-ecs/task-definition.json`: replace every `<...>` placeholder
   (account ID, region, ECR image, role ARNs, secret ARNs).
4. Register + run:
   ```bash
   aws ecs register-task-definition --cli-input-json file://aws-ecs/task-definition.json
   aws ecs create-cluster --cluster-name credorafin-prod
   aws ecs run-task \
     --cluster credorafin-prod \
     --task-definition credorafin \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[<SUBNET>],securityGroups=[<SG>],assignPublicIp=ENABLED}"
   ```
5. Put an Application Load Balancer in front of the service for HTTPS + custom domain.

### 4.3 AWS Amplify Hosting (easiest for SSR Next.js, no Docker)
Amplify natively supports Next.js 16 (SSR/SSG) without a Dockerfile.
1. AWS Console → Amplify → New app → Host web app → connect repo.
2. Build settings: Amplify auto-detects Next.js. No custom buildspec needed.
3. Add the same environment variables in Amplify → App settings → Environment variables.
4. Amplify provisions SSR resources automatically. Custom domain via Amplify console.

> Note: with Amplify, set `DATABASE_URL` to the Supabase Cloud / RDS string —
> Amplify does NOT run `supabase start`; it only needs the connection string.

---

## 5. CI/CD skeleton (GitHub Actions → ECR → ECS)

A minimal workflow (`.github/workflows/deploy.yml`):
```yaml
name: deploy
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - uses: aws-actions/amazon-ecr-login@v2
      - run: |
          docker build -t credorafin .
          docker tag credorafin ${{ secrets.ECR_URI }}:latest
          docker push ${{ secrets.ECR_URI }}:latest
      - run: |
          aws ecs update-service --cluster credorafin-prod \
            --service credorafin --force-new-deployment
```

---

## 6. Troubleshooting

**`supabase start` fails** — ensure Docker daemon is running (`docker info`).
On Linux, add yourself to the `docker` group: `sudo usermod -aG docker $USER`.

**Prisma `Database connection error`** — confirm Supabase is up (`supabase status`)
and `DATABASE_URL` matches the `DB URL` line (port 54322 for local).

**Container healthcheck fails** — `curl http://127.0.0.1:3000/api/health` from
inside the container. If the app starts but the DB is unreachable, the health
endpoint still returns 200 (by design) so probes don't bounce the container
during a transient DB outage. Check container logs for Prisma errors instead.

**`prisma db push` inside container fails on first deploy** — make sure the
production `DATABASE_URL` allows connections from the container's VPC/security
group. For Supabase Cloud, no IP allowlist is needed. For RDS, allow the ECS
security group on port 5432.

**Need to re-seed production** — connect to the prod DB and run:
```bash
DATABASE_URL=<prod-url> bun run db:seed
```
The seed is idempotent (positions/posts skip if exist; hero slides are synced).

---

## 7. File reference

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Single source of truth for the DB schema (PostgreSQL) |
| `supabase/config.toml` | Local Supabase service config |
| `supabase/migrations/00000000000000_init.sql` | Complete SQL migration (11 tables + RLS) |
| `supabase-schema.sql` | Convenience copy of the migration (paste into Supabase Studio) |
| `.env.example` | Template for all env vars |
| `Dockerfile` | Multi-stage standalone production image |
| `.dockerignore` | Keeps the image small |
| `apprunner.yaml` | AWS App Runner config |
| `aws-ecs/task-definition.json` | ECS Fargate task definition template |
| `src/lib/db.ts` | Prisma client (production-safe logging) |
| `src/lib/supabase.ts` | Supabase server + browser clients (for Storage/Auth) |
| `src/app/api/health/route.ts` | Health-check endpoint for container probes |
