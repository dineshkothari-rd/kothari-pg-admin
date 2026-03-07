import type { ReactNode } from "react";

export interface StatItem {
  label: string;
  value: number;
  icon: ReactNode;
  gradient: string;
}

export interface RevenueItem {
  name: string;
  value: number;
}
