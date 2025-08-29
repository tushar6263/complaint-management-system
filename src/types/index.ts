// src/types/index.ts

export const CATEGORIES = ["Product", "Service", "Support"] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;
export const STATUSES = ["Pending", "In Progress", "Resolved"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];

export interface ComplaintDTO {
  _id: string; // make required since DB always assigns one
  title: string;
  category: Category;
  priority: Priority;
  status: Status;
  dateSubmitted?: string; // optional
  createdAt?: string; // optional (for sorting/display fallback)
}

