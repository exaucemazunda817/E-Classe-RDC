"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PurchaseCourseButton({
  courseId,
  priceUSD,
  isLoggedIn,
}: {
  courseId: string;
  priceUSD: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose: "course", courseId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-8 py-3.5 rounded-full disabled:opacity-60"
      >
        {loading
          ? "Redirection..."
          : isLoggedIn
          ? `Acheter — ${(priceUSD / 100).toFixed(2)} $`
          : "Se connecter pour acheter"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
