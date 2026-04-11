"use client";

import { useState } from "react";

export default function SearchBar({ jobs }) {
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");

  const filtered = jobs.filter((job) => {
    const title = (job.jobTitle || "").toLowerCase();
    const company = (job.companyName || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      search === "" || title.includes(query) || company.includes(query);

    const matchesType =
      jobType === "all" ||
      (job.jobType || "").toLowerCase() === jobType.toLowerCase();

    return matchesSearch && matchesType;
  });
  console.log("Jobs data:", jobs[0]);
  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="contract">Contract</option>
          <option value="part-time">Part Time</option>
        </select>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Showing {filtered.length} jobs
      </p>

      {filtered.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {job.jobTitle || job.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{job.companyName}</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Remote
            </span>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {job.jobType && (
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                {job.jobType}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
