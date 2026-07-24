import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = "credora_admin_session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  if (!session?.value) {
    redirect("/admin/login");
  }

  try {
    const decoded = JSON.parse(Buffer.from(session.value, "base64").toString("utf-8"));
    if (!decoded.exp || decoded.exp < Date.now()) {
      redirect("/admin/login?expired=1");
    }
  } catch {
    redirect("/admin/login");
  }

  redirect("/admin/dashboard");
}
