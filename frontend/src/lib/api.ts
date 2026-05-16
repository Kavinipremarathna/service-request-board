import axios from "axios";
import type {
  JobRequest,
  CreateJobInput,
  ApiResponse,
  JobStatus,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("srb_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap errors into readable messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export const jobsApi = {
  getAll: async (params?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<JobRequest[]>> => {
    const { data } = await api.get("/jobs", { params });
    return data;
  },
  getById: async (id: string): Promise<ApiResponse<JobRequest>> => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },
  create: async (payload: CreateJobInput): Promise<ApiResponse<JobRequest>> => {
    const { data } = await api.post("/jobs", payload);
    return data;
  },
  updateStatus: async (
    id: string,
    status: JobStatus,
  ): Promise<ApiResponse<JobRequest>> => {
    const { data } = await api.patch(`/jobs/${id}`, { status });
    return data;
  },
  delete: async (id: string): Promise<ApiResponse<Record<string, never>>> => {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },
};

export const userApi = {
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
  updateProfile: async (payload: { name?: string; email?: string }) => {
    const { data } = await api.put("/auth/me", payload);
    return data;
  },
  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const { data } = await api.put("/auth/me/password", payload);
    return data;
  },
};

export default api;
