# CredoraFin — Lightweight Deployment Guide (PM2 + Bun)

> **Method:** PM2 process manager + Bun build + Next.js standalone server.
> **No Docker, no containers.** Footprint ~40 MB RAM in production.
> Fully version-pinned for reproducible builds.

---

## Pinned versions (do not change without testing)

| Tool   | Version   | Purpose                          | Pinned in        |
|--------|-----------|----------------------------------|------------------|
| Node   | 22.11.0   | LTS runtime for PM2 + standalone | `.nvmrc`         |
| Bun    | 1.3.14    | Package manager + build          | `.bun-version`   |
| PM2    | 5.4.2     | Process manager / auto-restart   | install command  |
| Next.js| 16.1.x    | Framework (from package.json)    | `package.json`   |

---

## One-time server setup (Ubuntu / Debian VPS)

Run these **once** on a fresh server.

### 1. System packages
```bash
sudo apt update && sudo apt install -y curl git build-essential python3
```

### 2. Node.js 22.11.0 LTS (via nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22.11.0
nvm use 22.11.0
nvm alias default 22.11.0
node -v   # → v22.11.0
```

### 3. Bun 1.3.14
```bash
curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.14"
source ~/.bashrc
bun -v    # → 1.3.14
```

### 4. PM2 5.4.2
```bash
npm install -g pm2@5.4.2
pm2 -v    # → 5.4.2
```

### 5. Clone the project
```bash
cd ~
git clone <your-repo-url> credorafin
cd credorafin
nvm use            # reads .nvmrc → 22.11.0
```

### 6. Configure environment
```bash
cp .env.example .env
nano .env          # set DATABASE_URL, NEXTAUTH_SECRET, SMTP creds, etc.
```

> The SQLite database file lives at `db/app.db` (path from `DATABASE_URL`).
> PM2 runs from the project root, so relative `file:./db/app.db` paths work.

### 7. Install, build, and start
```bash
bun install --frozen-lockfile
bunx prisma generate
bunx prisma db push --skip-generate
bun run build
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
```

### 8. Auto-start on reboot (run once)
```bash
pm2 startup systemd
# PM2 prints a command containing your user — copy & run that exact line.
# Then:
pm2 save
```

### 9. (Recommended) Log rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 10. Reverse proxy (Caddy / Nginx)
Point your reverse proxy at `127.0.0.1:3000`. A `Caddyfile` is already
included in this repo for reference.

---

## Everyday updates — ONE command

From the project directory on the server:

```bash
./deploy.sh
```

That single command does everything:

1. `git pull --ff-only`
2. `bun install --frozen-lockfile`
3. `bunx prisma generate`
4. `bunx prisma db push --skip-generate`
5. `bun run build` (produces `.next/standalone/server.js`)
6. `pm2 startOrReload ecosystem.config.cjs --update-env` ← **zero-downtime reload**
7. `pm2 save`
8. health-check `GET /api/health`

To update **without pulling** (e.g. local test build):

```bash
./deploy.sh --no-pull
```

---

## Common PM2 commands

| Action                | Command                              |
|-----------------------|--------------------------------------|
| Status                | `pm2 status`                         |
| Live logs             | `pm2 logs credorafin`                |
| CPU/Mem dashboard     | `pm2 monit`                          |
| Zero-downtime reload  | `pm2 reload credorafin --update-env` |
| Hard restart          | `pm2 restart credorafin`             |
| Stop                  | `pm2 stop credorafin`                |
| Delete from PM2       | `pm2 delete credorafin`              |
| List saved processes  | `pm2 list`                           |

---

## Why this method (vs Docker)

| Concern        | Docker           | PM2 + Bun (this)     |
|----------------|------------------|----------------------|
| RAM overhead   | ~150–250 MB      | ~40 MB               |
| Disk           | image layers GBs | just node_modules    |
| Update         | rebuild image    | `./deploy.sh`        |
| Zero-downtime  | compose restart  | `pm2 reload`         |
| Logs           | `docker logs`    | `pm2 logs` + rotate  |
| Boot persistence| compose enable   | `pm2 startup`        |
| Portability    | any container host| any Linux VPS       |

This is the lightest **standard** deployment that still gives you process
supervision, auto-restart, log management, and reboot persistence.
