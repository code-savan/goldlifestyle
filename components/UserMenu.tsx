"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

export default function UserMenu({ email }: { email: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Generate avatar URL from email (Adventurer style)
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(email)}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/store/auth/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
    }
  };

  const modalContent = showConfirm ? (
    <div
      className="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowConfirm(false);
        }
      }}
    >
      <div
        className="bg-white border border-black/10 shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-medium mb-2">Sign Out</h3>
        <p className="text-[13px] text-black/60 mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="px-4 py-2 text-[12px] tracking-wider uppercase border border-black/10 hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="px-4 py-2 text-[12px] tracking-wider uppercase bg-black text-white hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full overflow-hidden border border-black/10 hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <img
            src={avatarUrl}
            alt={email}
            className="w-full h-full object-cover"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-black/10 shadow-lg z-50">
            <div className="p-4 border-b border-black/10">
              <p className="text-[12px] text-black/60 mb-1">Signed in as</p>
              <p className="text-[13px] font-medium text-black break-all">{email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowConfirm(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
