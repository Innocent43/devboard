export interface JobData {
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  JobDescription: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

export const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "Lagos, Nigeria",
    type: "Full-time",
    postedAt: "2 days ago",
  },
  // {
  //   id: "2",
  //   title: "Backend Engineer",
  //   company: "DataFlow Systems",
  //   location: "Remote",
  //   type: "Contract",
  //   postedAt: "5 days ago",
  // },
  // {
  //   id: "3",
  //   title: "UI/UX Designer",
  //   company: "PixelWorks",
  //   location: "Abuja, Nigeria",
  //   type: "Full-time",
  //   postedAt: "1 week ago",
  // },
];

// export const JobDataList: JobInterface[] = [
//   {
//     id: "1",
//     title: "Frontend Developer",
//     company: "TechCorp Inc.",
//     location: "Lagos, Nigeria",
//     type: "Full-time",
//     postedAt: "2 days ago",
//   },
//   {
//     id: "2",
//     title: "Backend Engineer",
//     company: "DataFlow Systems",
//     location: "Remote",
//     type: "Contract",
//     postedAt: "5 days ago",
//   },
//   {
//     id: "3",
//     title: "UI/UX Designer",
//     company: "PixelWorks",
//     location: "Abuja, Nigeria",
//     type: "Full-time",
//     postedAt: "1 week ago",
//   },
//   {
//     id: "4",
//     title: "Product Manager",
//     company: "Nexora",
//     location: "Remote",
//     type: "Full-time",
//     postedAt: "3 days ago",
//   },
//   {
//     id: "5",
//     title: "DevOps Engineer",
//     company: "CloudNest",
//     location: "Port Harcourt, Nigeria",
//     type: "Contract",
//     postedAt: "6 days ago",
//   },
//   {
//     id: "6",
//     title: "Mobile Developer",
//     company: "AppForge",
//     location: "Lagos, Nigeria",
//     type: "Part-time",
//     postedAt: "4 days ago",
//   },
// ];

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export const dummyApplication: Application[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "TechCorp Inc.",
    status: "Pending",
  },
  {
    id: "2",
    jobTitle: "Frontend Developer",
    company: "TechCorp Inc.",
    status: "Accepted",
  },
  {
    id: "3",
    jobTitle: "Frontend Developer",
    company: "TechCorp Inc.",
    status: "Rejected",
  },
];

export interface JobPosting {
  id: string;
  title: string;
  postedAt: string;
  applicants: number;
}

export const dummyPostings: JobPosting[] = [
  {
    id: "1",
    title: "Frontend Developer",
    postedAt: "3 days ago",
    applicants: 12,
  },
  {
    id: "2",
    title: "Backend Developer",
    postedAt: "6 days ago",
    applicants: 6,
  },
  {
    id: "3",
    title: "Software Developer",
    postedAt: "7 days ago",
    applicants: 4,
  },
];
