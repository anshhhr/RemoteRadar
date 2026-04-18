import Link from "next/link";

export default async function JobPage({ params }) {
  const { id } = params;

  const response = await fetch(
    `https://jobicy.com/api/v2/remote-jobs?jobId=${id}`,
    { cache: "no-store" },
  );
  const data = await response.json();
  const job = data.jobs?.[0];

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Job not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-blue-500 text-sm mb-6 inline-block hover:underline"
        >
          Back to jobs
        </Link>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <a>
            <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
            <p className="text-gray-500 mt-1">{job.companyName}</p>
            <div className="flex gap-2 mt-4">
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Remote
              </span>
              {job.jobType && (
                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                  {job.jobType}
                </span>
              )}
            </div>
            <div className="mt-6 border-t pt-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {job.jobExcerpt}
              </p>
            </div>
            href={job.url}
            target="_blank" rel="noopener noreferrer" className="mt-6
            inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-sm
            hover:bg-blue-600" Apply Now
          </a>
        </div>
      </div>
    </main>
  );
}
