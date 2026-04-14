export default async function JobPage({ params }) {
  const { id } = params;

  const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?jobId=${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  console.log("API data:", JSON.stringify(data));
  const job = data.jobs?.find((j) => j.id == id);
  //   console.log("Full data:", Object.keys(data));
  if (!job) {
    return <div>job not found</div>;
  }
  return <div>{job.jobTitle}</div>;
}
