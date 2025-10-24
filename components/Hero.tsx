export default function Hero() {
  return (
    <section
      className="card-min max-w-7xl mx-auto w-full"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1.25fr 1fr",
        gap: 24,
        alignItems: "center",
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div style={{ padding: 8 }}>
        <h1 className="minimal-heading" style={{ fontSize: 40, lineHeight: 1.1, marginBottom: 12 }}>Simple is More</h1>
        <p style={{ color: "#666", maxWidth: 520, marginBottom: 16 }}>
          Elevate your everyday style with clean silhouettes, refined materials, and effortless fits.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/products" className="btn-min">Shop now</a>
          <a href="/products" className="btn-min" style={{ background: "#1c1c1c", color: "#fff" }}>Explore</a>
        </div>
      </div>
      <div style={{ position: "relative", minHeight: 350 }}>
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
