import { Frown, Meh, Smile } from "lucide-react";

export const moodIcons: Record<string, any> = {
  happy: Smile,
  optimistic: Smile,
  good: Smile,
  positive: Smile,
  grateful: Smile,
  sad: Frown,
  stressed: Frown,
  relieved: Frown,
  anxious: Frown,
  neutral: Meh,
  calm: Meh,
  mixed: Meh,
};

export const moodColors: Record<string, string> = {
  happy: "#22c55e",
  optimistic: "#22c55e",
  good: "#22c55e",
  positive: "#22c55e",
  grateful: "#22c55e",
  sad: "#ef4444",
  stressed: "#f59e0b",
  relieved: "#f59e0b",
  anxious: "#f59e0b",
  neutral: "#6b7280",
  calm: "#6b7280",
  mixed: "#8b5cf6",
};