"use client";

import { useEffect, useState } from "react";

type UrgentEmail = { id: string; subject: string; from: string; urgencyScore: number };

export default function UrgentEmailToast() {
  const [items, setItems] = useState<UrgentEmail[]>([]);

  useEffect(() => {
    const es = new EventSource("/api/emails/stream");
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "urgent" && Array.isArray(data.emails)) {
          setItems(data.emails);
        }
      } catch {}
    };
    return () => es.close();
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {items.map((em) => (
        <div key={em.id} className="rounded-lg border border-red-300 bg-red-50 p-4 shadow-lg max-w-sm">
          <p className="font-semibold text-red-700">🚨 Urgent email</p>
          <p className="text-sm text-gray-800">{em.subject}</p>
          <p className="text-xs text-gray-500">from {em.from} • score {em.urgencyScore}</p>
        </div>
      ))}
    </div>
  );
}
