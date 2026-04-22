"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types";

export default function BookmarkButton({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("rr_bookmarks") || "[]");
      setSaved(stored.includes(job.id));
    } catch {}
  }, [job.id]);

  const toggle = () => {
    try {
      const bookmarks: number[] = JSON.parse(
        localStorage.getItem("rr_bookmarks") || "[]",
      );
      const savedJobs: Job[] = JSON.parse(
        localStorage.getItem("rr_saved_jobs") || "[]",
      );

      if (saved) {
        localStorage.setItem(
          "rr_bookmarks",
          JSON.stringify(bookmarks.filter((id) => id !== job.id)),
        );
        localStorage.setItem(
          "rr_saved_jobs",
          JSON.stringify(savedJobs.filter((j) => j.id !== job.id)),
        );
        setSaved(false);
      } else {
        localStorage.setItem(
          "rr_bookmarks",
          JSON.stringify([...bookmarks, job.id]),
        );
        if (!savedJobs.find((j) => j.id === job.id)) {
          localStorage.setItem(
            "rr_saved_jobs",
            JSON.stringify([...savedJobs, job]),
          );
        }
        setSaved(true);
      }
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className={`bookmark-btn${saved ? " saved" : ""}`}
      title={saved ? "Remove bookmark" : "Save job"}
      style={{ width: 42, height: 42 }}
      aria-label={saved ? "Remove bookmark" : "Save job"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
