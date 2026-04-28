export interface Job {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobType: string;
  jobGeo: string;
  jobIndustry: string | string[];
  jobExcerpt: string;
  jobDescription?: string;
  pubDate: string;
  annualSalaryMin?: number;
  annualSalaryMax?: number;
  salaryCurrency?: string;
}

export interface JobicyResponse {
  status: string;
  count: num