import SearchBar from "./SearchBar";

export default async function Home() {
  const response = await fetch(
    "https://jobicy.com/api/v2/remote-jobs?count=20&tag=react",
    { cache: "no-store" },
  );
  const data = await response.json();
  const jobs = data.jobs || [];
  // new section
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-12 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find Remote Developer Jobs
        </h1>
        <p className="text-gray-500 text-lg">
          Handpicked remote jobs for developers. Updated daily.
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <SearchBar jobs={jobs} />
      </div>
    </main>
  );
}
