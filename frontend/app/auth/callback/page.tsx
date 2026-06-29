"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [message, setMessage] = useState("Finishing sign-in…");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const status = params.get("status");
    if (status === "error") {
      const reason = params.get("message") || "Sign-in failed";
      router.replace(`/login?status=error&message=${encodeURIComponent(reason)}`);
      return;
    }

    refresh().then((ok) => {
      if (ok) {
        setMessage("Signed in! Redirecting…");
        router.replace("/dashboard");
      } else {
        router.replace(
          `/login?status=error&message=${encodeURIComponent("Could not complete sign-in")}`,
        );
      }
    });
  }, [params, refresh, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#facc15]" />
        <p className="text-sm text-gray-400">{message}</p>
      </motion.div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CallbackInner />
    </Suspense>
  );
}
