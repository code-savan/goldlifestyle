"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

export default function CommentsClient({ productId }: { productId: string }) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; body: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setInitialLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/comments`);
      const json = await res.json();
      if (res.ok) setComments(json.comments || []);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

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
        toast({ title: "Comment posted", description: "Your comment has been added" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-[24px] font-light tracking-[-0.01em] mb-2">Reviews & Questions</h2>
        <div className="flex items-center gap-3 text-[13px] text-black/50">
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Comments List */}
        <div className="lg:col-span-2">
          {initialLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-black/10 p-6 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-black/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-black/10" />
                      <div className="h-2 w-32 bg-black/5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-black/5" />
                    <div className="h-3 w-3/4 bg-black/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="border border-dashed border-black/20 p-12 text-center">
              <p className="text-[13px] text-black/50 font-light">No comments yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {comments.map((c) => (
                <article key={c.id} className="border-b border-black/10 pb-8 last:border-0 hover:opacity-90 transition-opacity">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-light">
                        {String((c.author || "A").trim()[0] || "A").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h3 className="text-[13px] font-light text-black">
                          {c.author || "Anonymous"}
                        </h3>
                        <time className="text-[11px] text-black/40 whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <p className="text-[14px] leading-relaxed text-black/70 font-light whitespace-pre-line">
                        {c.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-[15px] font-light tracking-wider uppercase mb-6">Leave a Comment</h3>
            <form onSubmit={submit} className="border border-black/10 p-6 space-y-6">
              <div>
                <label htmlFor="comment-author" className="block text-[11px] tracking-wider uppercase text-black/50 mb-2">
                  Name
                </label>
                <input
                  id="comment-author"
                  type="text"
                  className="w-full border border-black/20 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="comment-body" className="block text-[11px] tracking-wider uppercase text-black/50 mb-2">
                  Comment
                </label>
                <textarea
                  id="comment-body"
                  className="w-full border border-black/20 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors resize-none"
                  placeholder="Share your thoughts..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || body.trim().length === 0}
                className="w-full border border-black bg-black text-white py-3 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
