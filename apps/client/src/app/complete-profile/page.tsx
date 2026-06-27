"use client";

import { useState } from "react";

export default function CompleteProfile() {
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
      }),
    });

    window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-4">Complete Your Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 w-full rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-3 mt-4 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
