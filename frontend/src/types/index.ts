export type JobStatus = "Open" | "In Progress" | "Closed";

export type JobCategory =
  | "Plumbing"
  | "Electrical"
  | "Painting"
  | "Joinery"
  | "Roofing"
  | "Flooring"
  | "Gardening"
  | "Cleaning"
  | "Other";

export interface JobRequest {
  _id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  contactName: string;
  contactEmail: string;
  contactNumber?: string;
  status: JobStatus;
  owner: string | { _id: string; name: string; email: string } | null;
  assignedTo?: string | { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  contactName: string;
  contactEmail: string;
  contactNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}
