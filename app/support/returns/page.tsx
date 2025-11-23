export default function ReturnsPage() {
  return (
    <main className="max-w-[1000px] mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <div className="text-[12px] tracking-[0.2em] uppercase text-black/50 mb-3">Support</div>
        <h1 className="text-[32px] md:text-[40px] font-light tracking-[-0.01em] text-black">Refunds & Returns Policy</h1>
        <p className="text-[13px] text-black/60 mt-4 max-w-2xl mx-auto">Please read carefully before purchasing.</p>
      </header>

      <section className="space-y-8">
        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">No Refunds or Returns</h2>
          <p className="text-[13px] text-black/70">All sales are final. We do not offer refunds, returns, or exchanges under any circumstances.</p>
        </div>
        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Order Accuracy</h2>
          <p className="text-[13px] text-black/70">Please review your order carefully before placing it. If you need help prior to checkout, contact us via the <a href="/support/contact" className="underline">Contact</a> page.</p>
        </div>
      </section>
    </main>
  );
}
