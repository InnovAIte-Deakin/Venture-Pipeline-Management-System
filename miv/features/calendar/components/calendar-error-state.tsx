import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarHeader } from "./calendar-header"
export function CalendarErrorState({ error, retry }: { error: string; retry(): void }) { return <div className="space-y-6"><CalendarHeader /><Card><CardContent className="p-6 text-center"><AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" /><p className="mb-4 text-red-600">Error: {error}</p><Button onClick={retry}>Retry</Button></CardContent></Card></div> }
