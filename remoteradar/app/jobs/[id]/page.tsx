import { Job, JobicyResponse } from "@/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "./BookmarkButton";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAllJobs(): Promise<Job[]> {
  try {
    const res = await fetch(
      "https://jobicy.com/api/v2/remote-jobs?count=50&tag=",
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) throw new Error("Failed");
    const data: JobicyResponse = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

async function getJob(id: string): Promise<Job | null> {
  const jobs = await getAllJobs();
  return jobs.find((j) => j.id.toString() === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Job Not Found — RemoteRadar" };
  return {
    title: `${job.jobTitle} at ${job.companyName} — RemoteRadar`,
    description:
      job.jobExcerpt ||
      `Apply for ${job.jobTitle} at ${job.companyName}. Remote position.`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const industry = Array.isArray(job.jobIndustry)
    ? job.jobIndustry
    : job.jobIndustry
      ? [job.jobIndustry]
      : [];

  const salary =
    job.annualSalaryMin && job.annualSalaryMax
      ? `$${(job.annualSalaryMin / 1000).toFixed(0)}k – $${(job.annualSalaryMax / 1000).toFixed(0)}k/yr`
      : null;

  const pubDate = new Date(job.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Back link */}
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
          marginBottom: 32,
          transition: "color 0.2s",
        }}
      >
        ← Back to jobs
      </Link>

      <div className="fade-in">
        {/* Header card */}
        <div
          className="card"
          style={{
            padding: 32,
            marginBottom: 20,
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Logo */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
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
                  width={72}
                  height={72}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 28,
                    color: "var(--accent)",
                  }}
                >
                  {job.companyName.charAt(0)}
                </span>
              )}
            </div>

            {/* Title + company */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(22px, 4vw, 30px)",
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  marginBottom: 6,
                  lineHeight: 1.2,
                }}
              >
                {job.jobTitle}
              </h1>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 16,
                }}
              >
                {job.companyName}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {job.jobGeo && (
                  <span className="tag tag-dim">🌍 {job.jobGeo}</span>
                )}
                {job.jobType && (
                  <span className="tag tag-dim">{job.jobType}</span>
                )}
                {industry.map((ind) => (
                  <span key={ind} className="tag tag-dim">
                    {ind}
                  </span>
                ))}
                {salary && <span className="tag tag-amber">{salary}</span>}
              </div>
            </div>

            {/* Bookmark */}
            <BookmarkButton job={job} />
          </div>

          {/* Posted date */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Posted {pubDate}
            </p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Apply Now ↗
            </a>
          </div>
        </div>

        {/* Job description */}
        <div
          className="card"
          style={{
            padding: 32,
            background: "var(--surface)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 20,
              color: "var(--text)",
            }}
          >
            Job Description
          </h2>

          {job.jobDescription ? (
            <div
              className="job-description"
              dangerouslySetInnerHTML={{ __html: job.jobDescription }}
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            />
          ) : job.jobExcerpt ? (
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              {job.jobExcerpt}
            </p>
          ) : (
            <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
              No description available.{" "}
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                View full listing ↗
              </a>
            </p>
          )}

          {/* CTA */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Apply for this role ↗
            </a>
            <Link
              href="/"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              ← More jobs
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .job-description h1, .job-description h2, .job-description h3 {
          font-family: var(--font-display);
          color: var(--text);
          margin: 24px 0 12px;
          font-weight: 700;
        }
        .job-description h2 { font-size: 18px; }
        .job-description h3 { font-size: 15px; }
        .job-description p { margin-bottom: 14px; }
        .job-description ul, .job-description ol {
          padding-left: 20px;
          margin-bottom: 14px;
        }
        .job-description li { margin-bottom: 6px; }
        .job-description a {
          color: var(--accent);
          text-decoration: none;
        }
        .job-description strong { color: var(--text); font-weight: 600; }
      `}</style>
    </div>
  );
}
