"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";

export default function SavedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem("rr_saved_jobs") || "[]");
      setJobs(stored);
    } catch {
      setJobs([]);
    }
  }, []);

  const remove = (id: number) => {
    try {
      const bookmarks: number[] = JSON.parse(
        localStorage.getItem("rr_bookmarks") || "[]",
      );
      localStorage.setItem(
        "rr_bookmarks",
        JSON.stringify(bookmarks.filter((b) => b !== id)),
      );
      const saved: Job[] = JSON.parse(
        localStorage.getItem("rr_saved_jobs") || "[]",
      );
      const updated = saved.filter((j) => j.id !== id);
      localStorage.setItem("rr_saved_jobs", JSON.stringify(updated));
      setJobs(updated);
    } catch {}
  };

  const clearAll = () => {
    try {
      localStorage.removeItem("rr_bookmarks");
      localStorage.removeItem("rr_saved_jobs");
      setJobs([]);
    } catch {}
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              marginBottom: 16,
            }}
          >
            ← Back to jobs
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(26px, 5vw, 40px)",
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            Saved Jobs
            <span
              style={{
                marginLeft: 12,
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(14px, 2vw, 18px)",
                color: "var(--accent)",
                fontWeight: 400,
              }}
            >
              {jobs.length}
            </span>
          </h1>
        </div>

        {jobs.length > 0 && (
          <button
            onClick={clearAll}
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div
          className="card fade-in"
          style={{
            textAlign: "center",
            padding: "80px 24px",
            border: "1px dashed var(--border)",
            background: "transparent",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🔖</div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 10,
              color: "var(--text)",
            }}
          >
            No saved jobs yet
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              marginBottom: 28,
            }}
          >
            Bookmark jobs from the listing to save them here.
          </p>
          <Link
            href="/"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div
          className="stagger"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {jobs.map((job) => {
            const industry = Array.isArray(job.jobIndustry)
              ? job.jobIndustry[0]
              : job.jobIndustry;
            const salary =
              job.annualSalaryMin && job.annualSalaryMax
                ? `$${(job.annualSalaryMin / 1000).toFixed(0)}k–$${(job.annualSalaryMax / 1000).toFixed(0)}k`
                : null;

            return (
              <div
                key={job.id}
                className="card"
                style={{
                  padding: "18px 20px",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {job.companyLogo ? (
                    <Image
                      src={job.companyLogo}
                      alt={job.companyName}
                      width={48}
                      height={48}
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: 18,
                        color: "var(--accent)",
                      }}
                    >
                      {job.companyName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <Link
                    href={`/jobs/${job.id}`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text)",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {job.jobTitle}
                  </Link>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 13,
                      marginBottom: 10,
                    }}
                  >
                    {job.companyName}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {job.jobGeo && (
                      <span className="tag tag-dim">🌍 {job.jobGeo}</span>
                    )}
                    {job.jobType && (
                      <span className="tag tag-dim">{job.jobType}</span>
                    )}
                    {industry && (
                      <span className="tag tag-dim">{industry}</span>
                    )}
                    {salary && <span className="tag tag-amber">{salary}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => remove(job.id)}
                    className="bookmark-btn saved"
                    title="Remove bookmark"
                    aria-label="Remove bookmark"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Apply ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
