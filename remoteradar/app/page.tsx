import { Job, JobicyResponse } from "@/types";
import SearchBar from "./SearchBar";

async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch(
      "https://jobicy.com/api/v2/remote-jobs?count=50&tag=",
      {
        next: { revalidate: 3600 }, // ISR — revalidate every hour
      },
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data: JobicyResponse = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "72px 24px 56px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Grid BG */}
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(245,166,35,0.1) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {/* Live badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--green-dim)",
              border: "1px solid rgba(34,211,165,0.2)",
              borderRadius: 100,
              padding: "6px 14px",
              marginBottom: 24,
            }}
          >
            <span className="pulse-dot" />
            <span
              style={{
                fontSize: 12,
                color: "var(--green)",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
              }}
            >
              {jobs.length} live remote jobs
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            Your radar for
            <br />
            <span style={{ color: "var(--accent)" }}>remote work.</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "clamp(15px, 2vw, 18px)",
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Real-time remote job listings from companies worldwide. Search,
            filter, bookmark — all in one place.
          </p>
        </div>
      </section>

      {/* Search + Jobs */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <SearchBar jobs={jobs} />
      </section>
    </div>
  );
}
