"use client";

import { useEffect, useState } from "react";

type Email = {
  id: string;
  from: string;
  subject: string;
  body: string;
  category: string;
  urgencyScore: number;
  aiSummary: string | null;
  status: string;
  createdAt: string;
};

function urgencyColor(score: number) {
  if (score >= 80) return "bg-red-100 text-red-700";
  if (score >= 50) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
}

export default function CommandCenter() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emails")
      .then((r) => r.json())
      .then((data) => {
        setEmails(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">AI Operations Manager</h1>
      <p className="text-gray-500 mt-2">Command Center — Urgency Inbox</p>

      {loading && <p className="mt-6 text-gray-400">Loading…</p>}

      {!loading && emails.length === 0 && (
        <p className="mt-6 text-gray-400">No emails yet. Run the Gmail scan to populate.</p>
      )}

      <div className="mt-6 space-y-3">
        {emails.map((e) => (
          <div key={e.id} className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">{e.subject}</p>
                <p className="text-sm text-gray-500">{e.from}</p>
                {e.aiSummary && <p className="text-sm text-gray-700 mt-1">{e.aiSummary}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${urgencyColor(e.urgencyScore)}`}>
                  {e.urgencyScore}
                </span>
                <span className="text-xs text-gray-400">{e.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
