import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatScore(score: number): string {
  return `${score}%`;
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "beginner": return "text-success";
    case "intermediate": return "text-warning";
    case "advanced": return "text-destructive";
    default: return "text-muted-foreground";
  }
}

export function getLevelBadgeClass(level: string): string {
  switch (level) {
    case "beginner": return "bg-success/10 text-success border-success/20";
    case "intermediate": return "bg-warning/10 text-warning border-warning/20";
    case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
}
