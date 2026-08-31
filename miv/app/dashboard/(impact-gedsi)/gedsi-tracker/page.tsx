"use client"

import { GedsiTrackerContent } from "./components/gedsi-tracker-content"
import { useGedsiData } from "./hooks/use-gedsi-data"

export default function GEDSITrackerPage() {
  const gedsiTracker = useGedsiData()

  return <GedsiTrackerContent state={gedsiTracker} />
}
