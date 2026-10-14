import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ probe: string }> },
) {
  const { probe } = await params;
  if (!["live", "ready"].includes(probe))
    return new Response(null, { status: 404 });
  try {
    if (probe === "ready") getDb().prepare("SELECT 1").get();
    return Response.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
