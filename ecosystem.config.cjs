/**
 * CredoraFin — PM2 process definition (light, no Docker)
 * ------------------------------------------------------------------
 * Runtime : Node.js (via nvm, see .nvmrc) — runs the Next.js
 *           standalone server.js produced by `next build`.
 * Manager : PM2
 *
 * Commands:
 *   pm2 start ecosystem.config.cjs            # first start
 *   pm2 reload credorafin --update-env        # zero-downtime reload
 *   pm2 restart credorafin                    # hard restart
 *   pm2 logs credorafin                       # tail logs
 *   pm2 monit                                 # CPU/mem dashboard
 *   pm2 status                                # process table
 *
 * Boot persistence (run once on the server):
 *   pm2 startup                               # follow printed instructions
 *   pm2 start ecosystem.config.cjs && pm2 save
 */
module.exports = {
  apps: [
    {
      name: "credorafin",
      script: ".next/standalone/server.js",
      cwd: __dirname,

      // Single fork — Next.js standalone handles its own event loop.
      // (Cluster mode is not used to keep memory footprint minimal and
      // avoid Prisma client connection storms on SQLite.)
      instances: 1,
      exec_mode: "fork",

      // Resilience
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000, // 3s backoff between restarts
      max_memory_restart: "512M", // auto-recycle on memory leak

      // Production env (override per-host with: pm2 restart --update-env)
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        NEXT_TELEMETRY_DISABLED: "1",
      },

      // Logging
      out_file: "./logs/out.log",
      error_file: "./logs/err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      time: true,

      // Graceful shutdown — Next.js standalone closes fast, give it 5s
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
