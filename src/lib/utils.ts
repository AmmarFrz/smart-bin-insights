import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FillPrediction {
  text: string;
  hoursLeft: number;
  urgency: "safe" | "moderate" | "urgent" | "critical";
  color: string;
  icon: string;
}

export function getFillPrediction(currentPercentage: number): string {
  const prediction = getFillPredictionDetail(currentPercentage);
  return prediction.text;
}

export function getFillPredictionDetail(currentPercentage: number): FillPrediction {
  if (currentPercentage >= 95) {
    return {
      text: "Sudah Penuh — Segera Angkut!",
      hoursLeft: 0,
      urgency: "critical",
      color: "red",
      icon: "🔴"
    };
  }

  // Asumsi rata-rata kenaikan 5% per jam
  const percentLeft = 100 - currentPercentage;
  const hoursLeft = Math.ceil(percentLeft / 5);

  if (hoursLeft <= 4) {
    return {
      text: `Penuh dalam ~${hoursLeft} jam`,
      hoursLeft,
      urgency: "urgent",
      color: "red",
      icon: "🔴"
    };
  }

  if (hoursLeft <= 12) {
    return {
      text: `Penuh dalam ~${hoursLeft} jam`,
      hoursLeft,
      urgency: "moderate",
      color: "amber",
      icon: "🟡"
    };
  }

  if (hoursLeft > 24) {
    const days = Math.floor(hoursLeft / 24);
    return {
      text: `Estimasi penuh: ${days} hari lagi`,
      hoursLeft,
      urgency: "safe",
      color: "emerald",
      icon: "🟢"
    };
  }

  return {
    text: `Estimasi penuh: ${hoursLeft} jam lagi`,
    hoursLeft,
    urgency: "safe",
    color: "emerald",
    icon: "🟢"
  };
}
