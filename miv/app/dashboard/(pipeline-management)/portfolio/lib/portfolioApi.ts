import type { VentureRecord, VenturesResponse } from "../types"
const isVenture = (value: unknown): value is VentureRecord => { if (typeof value !== "object" || value === null) return false; const item = value as Record<string, unknown>; return typeof item.id === "string" && typeof item.name === "string" }
export const fetchVentures = async (signal?: AbortSignal): Promise<VentureRecord[]> => {
  const response = await fetch("/api/ventures?limit=100", { signal })
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  const data: unknown = await response.json(); const ventures = (data as Partial<VenturesResponse>)?.ventures
  if (!Array.isArray(ventures)) throw new Error("The ventures response has an invalid format")
  return ventures.filter(isVenture)
}
