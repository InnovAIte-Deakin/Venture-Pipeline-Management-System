import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface HelpHeaderProps {
  onContactSupport?: () => void
}

export default function HelpHeader({ onContactSupport }: HelpHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with using the MIV Platform and find answers to common questions
        </p>
      </div>
      <Button onClick={onContactSupport} className="w-full sm:w-auto">
        <Mail className="mr-2 h-4 w-4" />
        Contact Support
      </Button>
    </div>
  )
}
