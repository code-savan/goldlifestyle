import { supabaseServer } from "@/lib/supabase/server";
import { hashPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const sb = supabaseServer();

    // Check if email already exists
    const { data: existing } = await sb
      .from("admins")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password and create admin
    const passwordHash = await hashPassword(password);
    const { data: admin, error } = await sb
      .from("admins")
      .insert({
        email,
        password_hash: passwordHash,
      })
      .select("id, email")
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Failed to create admin account" },
        { status: 500 }
      );
    }

    // Create session
    await createSession(admin.id);

    return NextResponse.json({ admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
