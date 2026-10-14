export default function Loading() {
  return (
    <main
      className="container page-content"
      aria-busy="true"
      aria-label="Memuat halaman"
    >
      <div className="page-heading">
        <div className="skeleton" style={{ width: 150, height: 16 }} />
        <div
          className="skeleton"
          style={{ maxWidth: 640, height: 70, marginTop: 25 }}
        />
      </div>
      <div className="skeleton" style={{ height: 240 }} />
    </main>
  );
}
