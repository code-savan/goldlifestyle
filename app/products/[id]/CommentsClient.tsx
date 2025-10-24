"use client";
import { useEffect, useState } from "react";

export default function CommentsClient({ productId }: { productId: string }) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; body: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/products/${productId}/comments`);
    const json = await res.json();
    if (res.ok) setComments(json.comments || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
      });
      if (res.ok) {
        setAuthor("");
        setBody("");
        await load();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginTop: 32 }}>
      <h3 className="minimal-heading" style={{ fontWeight: 600, marginBottom: 8 }}>Comments</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <textarea placeholder="Write a comment" value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
        <button className="btn-min" type="submit" disabled={loading}>{loading ? "Posting..." : "Post comment"}</button>
      </form>
      <ul style={{ display: "grid", gap: 12 }}>
        {comments.map((c) => (
          <li key={c.id} className="card-min" style={{ padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{c.author || "Anonymous"}</div>
            <div style={{ color: "#666", fontSize: 12 }}>{new Date(c.created_at).toLocaleString()}</div>
            <p style={{ marginTop: 6 }}>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
