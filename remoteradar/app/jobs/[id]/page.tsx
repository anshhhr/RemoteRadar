// import Link from "next/link";

// export default async function JobPage({ params, searchParams }) {
//   const { id } = await params;
//   const { title, company, type } = await searchParams;

//   const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?jobId=${id}`, {
//     cache: "no-store",
//   });
//   const data = await res.json();
//   const job = data.jobs?.[0];

//   return (
//     <main className="min-h-screen bg-gray-50 py-8 px-6">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
//           <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//           <p className="text-gray-500 mt-1">{company}</p>
//           <div className="flex gap-2 mt-4">
//             <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
//               Remote
//             </span>
//             {type && (
//               <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
//                 {type}
//               </span>
//             )}
//           </div>
//           {job && (
//             <div className="mt-6 border-t pt-6">
//               <p className="text-gray-700 text-sm leading-relaxed">
//                 {job.jobExcerpt}
//               </p>
//               <a
//                 href={job.url}
//                 target="_blank"
//                 className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-600"
//               >
//                 Apply Now →
//               </a>
//             </div>
//           )}
//           <Link
//             href="/"
//             className="mt-4 text-sm text-gray-400 hover:text-gray-600 block"
//           >
//             ← Back
//           </Link>
//           ← Back
//         </div>
//       </div>
//     </main>
//   );
// }
