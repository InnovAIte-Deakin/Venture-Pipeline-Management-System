"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, MessageCircle, Phone } from "lucide-react"

interface QuickActionsGridProps {
  onOpenFaq?: () => void
  onOpenTutorials?: () => void
  onOpenContact?: () => void
}

const supportPhone = "+85517350544"

export default function QuickActionsGrid({
  onOpenFaq,
  onOpenTutorials,
  onOpenContact,
}: QuickActionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        role="button"
        tabIndex={0}
        onClick={onOpenFaq}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpenFaq?.()
        }}
        className="cursor-pointer hover:shadow-md transition-shadow"
      >
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">User guides & manuals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        role="button"
        tabIndex={0}
        onClick={onOpenTutorials}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpenTutorials?.()
        }}
        className="cursor-pointer hover:shadow-md transition-shadow"
      >
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Video className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Step-by-step guides</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        role="button"
        tabIndex={0}
        onClick={onOpenContact}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpenContact?.()
        }}
        className="cursor-pointer hover:shadow-md transition-shadow"
      >
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Get instant help</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <a href={`tel:${supportPhone}`} className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-sm text-muted-foreground">Call us directly</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
