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
    <section className="mt-[100px]">
      <h3 className="minimal-heading" style={{ fontWeight: 500, marginBottom: 8 }}>Comments</h3>
      <div className="flex gap-4">

      <form onSubmit={submit} style={{ display: "grid", gap: 9, marginBottom: 16 }} className="w-3/8 sticky top-20 h-fit">
        <input
        className="placeholder:font-medium font-medium text-[14px] outline-[#1e1e1eb7]"
        placeholder="John Doe" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <textarea
        className="placeholder:font-medium font-medium text-[14px] outline-[#1e1e1eb7]"
        placeholder="Write a comment..." value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
        <button className="border border-[#1e1e1e] hover:text-[#ffffff] px-4 py-2 font-semibold w-full cursor-pointer bg-[#1e1e1e] text-white transition-all duration-300 text-[14px] flex-1" type="submit" disabled={loading}>{loading ? "Posting..." : "Post comment"}</button>
      </form>


      <ul style={{ display: "grid", gap: 12 }} className="w-5/8">
        {comments.map((c) => (
          <li key={c.id} className=" bg-gray-50 border border-gray-200 h-fit" style={{ padding: 16 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900 text-sm">{c.author || "Anonymous"}</div>
              <div className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
