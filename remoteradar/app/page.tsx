export default async function Home() {
  const response = await fetch(
    "https://jobicy.com/api/v2/remote-jobs?count=10&tag=react",
  );
  const data = await response.json();
  const jobs = data.jobs || [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-12 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find Remote Developer Jobs
        </h1>
        <p className="text-gray-500 text-lg">
          Handpicked remote jobs for developers. Updated daily.
        </p>
      </div>

      {/* Jobs */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-gray-400 text-sm mb-4">Showing {jobs.length} jobs</p>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {job.jobTitle}
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
    </main>
  );
}
