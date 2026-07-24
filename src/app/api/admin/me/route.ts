import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "credora_admin_session";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookie) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const decoded = JSON.parse(Buffer.from(cookie, "base64").toString("utf-8"));

    if (!decoded.exp || decoded.exp < Date.now()) {
      return NextResponse.json({ error: "Session expired." }, { status: 401 });
    }

    return NextResponse.json({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      exp: decoded.exp,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }
}
