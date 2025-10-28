export default function Hero() {
  return (
    <section
      className="card-min w-full"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1.25fr 1fr",
        gap: 16,
        alignItems: "center",
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div style={{ padding: 8 }}>
        <h1 className="minimal-heading" style={{ fontSize: 36, lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.02em" }}>Simple is More</h1>
        <p style={{ color: "#6b7280", maxWidth: 520, marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
          Elevate your everyday style with clean silhouettes, refined materials, and effortless fits.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/products" className="btn-min hover-dim">Shop now</a>
          <a href="/products" className="btn-min hover-dim" style={{ background: "#1c1c1c", color: "#fff" }}>Explore</a>
        </div>
      </div>
      <div style={{ position: "relative", minHeight: 320 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0lbMK4GF_MjX9zBsiVuQAcUvhPDIdvBTtGGwPCTrEZHYTDfuETb5xC20bgeWxqrBcR8qpE9qp4KfxoBS4YfHzjeeaxIENmBZlF0J8q3VSJsVmd7VTEzLujDeTHg5gAERwpx7xq2Mq9EEJJUFVVt1ZDfouGmC9md0BJS7XSX-tW8Mjb9enAEExX2l9EMc/s16000/20250822_201141.jpg"
          alt="Collection"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
