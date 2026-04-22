import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--accent)",
          marginBottom: 16,
          letterSpacing: "0.1em",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: "-0.03em",
          marginBottom: 12,
          color: "var(--text)",
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 15 }}>
        The job or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
        Back to jobs
      </Link>
    </div>
  );
}
