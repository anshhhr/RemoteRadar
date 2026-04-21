"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";

interface Props {
  jobs: Job[];
}

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rr_bookmarks");
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (id: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((b) => b !== id)
        : [...prev, id];
      try {
        localStorage.setItem("rr_bookmarks", JSON.stringify(next));
        // Also persist job data for saved page
        const jobs = JSON.parse(localStorage.getItem("rr_saved_jobs") || "[]");
        if (prev.includes(id)) {
          const updated = jobs.filter((j: Job) => j.id !== id);
          localStorage.setItem("rr_saved_jobs", JSON.stringify(updated));
        }
      } catch {}
      return next;
    });
  };

  return { bookmarks, toggle };
}

export default function SearchBar({ jobs }: Props) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [industry, setIndustry] = useState("");
  const { bookmarks, toggle } = useBookmarks();

  // Persist job data when bookmarking (for saved page)
  const handleBookmark = (job: Job) => {
    const isBookmarked = bookmarks.includes(job.id);
    if (!isBookmarked) {
      try {
        const saved = JSON.parse(localStorage.getItem("rr_saved_jobs") || "[]");
        const already = saved.find((j: Job) => j.id === job.id);
        if (!already) {
          localStorage.setItem(
            "rr_saved_jobs",
            JSON.stringify([...saved, job]),
          );
        }
      } catch {}
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem("rr_saved_jobs") || "[]");
        localStorage.setItem(
          "rr_saved_jobs",
          JSON.stringify(saved.filter((j: Job) => j.id !== job.id)),
        );
      } catch {}
    }
    toggle(job.id);
  };

  // Extract unique values for filters
  const locations = useMemo(() => {
    const locs = new Set(jobs.map((j) => j.jobGeo).filter(Boolean));
    return Array.from(locs).sort();
  }, [jobs]);

  const types = useMemo(() => {
    const t = new Set(jobs.map((j) => j.jobType).filter(Boolean));
    return Array.from(t).sort();
  }, [jobs]);

  const industries = useMemo(() => {
    const ind = new Set<string>();
    jobs.forEach((j) => {
      const v = j.jobIndustry;
      if (Array.isArray(v)) v.forEach((i) => ind.add(i));
      else if (v) ind.add(v);
    });
    return Array.from(ind).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return jobs.filter((job) => {
      const matchQuery =
        !q ||
        job.jobTitle.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.jobExcerpt?.toLowerCase().includes(q);
      const matchLocation = !location || job.jobGeo === location;
      const matchType = !type || job.jobType === type;
      const matchIndustry =
        !industry ||
        (Array.isArray(job.jobIndustry)
          ? job.jobIndustry.includes(industry)
          : job.jobIndustry === industry);
      return matchQuery && matchLocation && matchType && matchIndustry;
    });
  }, [jobs, query, location, type, industry]);

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setType("");
    setIndustry("");
  };

  const hasFilters = query || location || type || industry;

  return (
    <div>
      {/* Search + Filters */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 28,
        }}
      >
        {/* Search row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-dim)"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="input-base"
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost"
              style={{ whiteSpace: "nowrap" }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            className="input-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "auto", minWidth: 160 }}
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            className="input-base"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "auto", minWidth: 160 }}
          >
            <option value="">All job types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="input-base"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{ width: "auto", minWidth: 180 }}
          >
            <option value="">All industries</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "job" : "jobs"} found
          {hasFilters && " (filtered)"}
        </p>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔭</div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
            }}
          >
            No jobs found
          </p>
          <p style={{ fontSize: 14 }}>
            Try adjusting your search or clearing the filters.
          </p>
        </div>
      ) : (
        <div
          className="stagger"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={bookmarks.includes(job.id)}
              onBookmark={() => handleBookmark(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
  isBookmarked,
  onBookmark,
}: {
  job: Job;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const industry = Array.isArray(job.jobIndustry)
    ? job.jobIndustry[0]
    : job.jobIndustry;

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.pubDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const timeLabel =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  const salary =
    job.annualSalaryMin && job.annualSalaryMax
      ? `$${(job.annualSalaryMin / 1000).toFixed(0)}k–$${(job.annualSalaryMax / 1000).toFixed(0)}k`
      : null;

  return (
    <div
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

      {/* Main content */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
          <Link
            href={`/jobs/${job.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--text)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            {job.jobTitle}
          </Link>
          {daysAgo <= 3 && (
            <span
              className="tag tag-green"
              style={{ fontSize: 10, padding: "2px 8px" }}
            >
              NEW
            </span>
          )}
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          {job.companyName}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {job.jobGeo && <span className="tag tag-dim">🌍 {job.jobGeo}</span>}
          {job.jobType && <span className="tag tag-dim">{job.jobType}</span>}
          {industry && <span className="tag tag-dim">{industry}</span>}
          {salary && <span className="tag tag-amber">{salary}</span>}
          <span className="tag tag-dim">{timeLabel}</span>
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
          onClick={(e) => {
            e.preventDefault();
            onBookmark();
          }}
          className={`bookmark-btn${isBookmarked ? " saved" : ""}`}
          title={isBookmarked ? "Remove bookmark" : "Save job"}
          aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <Link
          href={`/jobs/${job.id}`}
          style={{
            fontSize: 12,
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            whiteSpace: "nowrap",
          }}
        >
          View →
        </Link>
      </div>
    </div>
  );
}
