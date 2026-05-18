import { z } from "zod";

export const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Roofing",
  "Flooring",
  "Gardening",
  "Cleaning",
  "Other",
] as const;

export const STATUSES = ["Open", "In Progress", "Closed"] as const;

export const createJobSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  location: z.string().min(1, "Location is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  contactNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val), {
      message: "Please enter a valid phone number",
    }),
});

export type CreateJobFormValues = z.infer<typeof createJobSchema>;
