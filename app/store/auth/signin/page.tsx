"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Key } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      router.push("/store");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-light tracking-[-0.01em] mb-2">Sign In</h1>
          <p className="text-[13px] text-black/60">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[12px] tracking-wider uppercase text-black/60 mb-2">
              Email
            </label>
            <div className="relative border">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-black/10
                focus:outline-none focus:border-black text-[13px]"
                placeholder="your@email.com"
                style={{paddingLeft: "38px",}}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] tracking-wider uppercase text-black/60 mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-14 py-3 border border-black/10 focus:outline-none focus:border-black text-[13px]"
                placeholder="••••••••"
                style={{paddingLeft: "38px", paddingRight: "38px"}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white text-[12px] tracking-wider uppercase hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-black/50">
          Don&apos;t have an account?{" "}
          <Link href="/store/auth/signup" className="underline hover:text-black/60">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
