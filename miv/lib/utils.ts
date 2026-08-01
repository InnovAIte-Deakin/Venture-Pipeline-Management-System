import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapRole(prismaRole: string | null | undefined): string {
  const r = (prismaRole || '').toUpperCase();
  if (r === 'USER') return 'founder';
  if (r === 'ANALYST' || r === 'GEDSI_ANALYST') return 'miv_analyst';
  if (r === 'ADMIN' || r === 'MANAGER') return 'admin';
  return r.toLowerCase();
}
