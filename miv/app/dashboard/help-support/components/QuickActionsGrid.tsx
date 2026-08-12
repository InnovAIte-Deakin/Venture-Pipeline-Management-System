import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, MessageCircle, Phone } from "lucide-react"

export default function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">User guides & manuals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
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

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
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

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-sm text-muted-foreground">Call us directly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}