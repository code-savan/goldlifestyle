import { supabaseServer } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function getCurrentAdmin() {
  const sessionId = await getSession();
  if (!sessionId) return null;

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("admins")
    .select("id, email")
    .eq("id", sessionId)
    .single();

  if (error || !data) return null;
  return data;
}
