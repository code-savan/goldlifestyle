export default function ShippingPage() {
  return (
    <main className="max-w-[1000px] mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <div className="text-[12px] tracking-[0.2em] uppercase text-black/50 mb-3">Support</div>
        <h1 className="text-[32px] md:text-[40px] font-light tracking-[-0.01em] text-black">Shipping Information</h1>
        <p className="text-[13px] text-black/60 mt-4 max-w-2xl mx-auto">Key details about timelines and availability.</p>
      </header>

      <section className="space-y-8">
        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Timeline</h2>
          <p className="text-[13px] text-black/70">Orders may take up to 30 days to ship and deliver. Thank you for your patience.</p>
        </div>

        <div className="border border-black/10 p-6 bg-white">
          <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Options at Checkout</h2>
          <p className="text-[13px] text-black/70">Shipping options are currently not available at checkout. A standard method will be used.</p>
        </div>
        {false && (
          <div className="border border-black/10 p-6 bg-white">
            <h2 className="text-[12px] tracking-widest uppercase text-black/60 mb-2">Tracking</h2>
            <p className="text-[13px] text-black/70">Tracking details will be provided here once finalized.</p>
          </div>
        )}
      </section>
    </main>
  );
}
