"use client";
// import { JobInterface } from "@/app/components/data";
import Link from "next/link";

export interface JobInterface {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

export default function JobdataCard({ data }: { data: JobInterface }) {
  return (
    <Link href={`/jobs/${data.id}`}>
      <div className="bg-white  w-full ma-w-md h-[160px] rounded-xl p-4 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold">{data.title}</h2>
        <h3 className="text-gray-600 font-medium">{data.company}</h3>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>{data.location}</span>
          <span>{data.type}</span>
          <span className="truncate">{data.postedAt}</span>
        </div>
      </div>
    </Link>
  );
}

export interface Searchprop {
  value: string;
  onChange: (text: string) => void;
}
export function SearchInput({ value, onChange }: Searchprop) {
  return (
    <div className="w-full sm:max-w-90 md:max-w-md max-w-md mx-aut my- px-4">
      <input
        className="w-full border bg-white border-gray-300 rounded-lg p-3 shadow-sm docus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search jobs by title or company"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export interface LocationInterface {
  value: string;
  onChange: (text: string) => void;
}

export function LocationComponent({ value, onChange }: LocationInterface) {
  return (
    <div className="w-full sm:max-w-40  lg:max-w-50 max-w-md px-4">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-xl w-full   p-3 bg-white shadow-sm focus:outline-none"
      >
        <option value="">All Locations</option>
        <option value="Lagos, Nigeria">Lagos, Nigeria</option>
        <option value="Abuja, Nigeria">Abuja, Nigeria</option>
        <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
        <option value="Remote">Remote</option>
      </select>
    </div>
  );
}

// export interface typeInterface {
//   value: string;
//   onChange: (text: string) => void;
// }

// export function TypefilterComponent({ value, onChange }: typeInterface) {
//   return (
//     <div className="w-full sm:max-w-50 max-w-md px-4">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="border  w-full border-gray-300 rounded-xl p-3 bg-white shadow-sm focus:outline-none"
//       >
//         <option value="">All Types</option>
//         <option value="Full-time">Full-time</option>
//         <option value="Part-time">Part-time</option>
//         <option value="Contract">Contract</option>
//       </select>
//     </div>
//   );
// }
