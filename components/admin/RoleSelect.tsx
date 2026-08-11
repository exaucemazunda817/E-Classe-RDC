"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  { value: "STUDENT", label: "Étudiant" },
  { value: "FORMATEUR", label: "Formateur" },
  { value: "ADMIN", label: "Admin" },
];

export default function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: e.target.value }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }

    router.refresh();
  }

  return (
    <div className="shrink-0">
      <select
        defaultValue={currentRole}
        onChange={handleChange}
        disabled={loading}
        className="text-xs font-semibold text-brand-navy border border-brand-line rounded-full px-3 py-1.5 bg-white disabled:opacity-60"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
