/**
 * Lightweight health-check endpoint used by container orchestrators
 * (AWS App Runner, ECS, Kubernetes) and the Dockerfile HEALTHCHECK.
 *
 * Returns 200 { ok: true } without touching the DB so it stays fast and
 * doesn't fail the probe when the DB is briefly unreachable.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    { ok: true, ts: new Date().toISOString() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
