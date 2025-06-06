import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function calculateProfitLoss(qty: number, buyPrice: number, currentPrice: number) {
  const investment = qty * buyPrice;
  const currentValue = qty * currentPrice;
  const pl = currentValue - investment;
  const plPercentage = (pl / investment) * 100;
  
  return {
    pl,
    plPercentage,
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}