export default function ContactPage() {
  return (
    <main className="max-w-[1000px] mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <div className="text-[12px] tracking-[0.2em] uppercase text-black/50 mb-3">Support</div>
        <h1 className="text-[32px] md:text-[40px] font-light tracking-[-0.01em] text-black">Contact Us</h1>
        <p className="text-[13px] text-black/60 mt-4 max-w-2xl mx-auto">
          We’re here to help. Reach out with questions about orders, products, or anything else.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Email</h2>
          <p className="text-[13px] text-black/70 mb-3">support@goldlifestyle.com</p>
          <p className="text-[12px] text-black/50">We typically reply within 1 business day.</p>
        </div>

        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Hours</h2>
          <p className="text-[13px] text-black/70">Mon–Fri · 9:00–17:00 (UTC)</p>
        </div>

        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Social</h2>
          <p className="text-[13px] text-black/70">Instagram · Twitter · TikTok</p>
        </div>
      </section>
    </main>
  );
}
