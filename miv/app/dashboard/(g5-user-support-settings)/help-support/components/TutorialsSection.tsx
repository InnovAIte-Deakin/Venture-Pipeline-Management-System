import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, ExternalLink } from "lucide-react"

export default function TutorialsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Tutorials</CardTitle>
        <CardDescription>
          Learn how to use the MIV Platform effectively with our video guides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <PlayCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Getting Started</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Learn the basics of navigating the platform and setting up your account
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <PlayCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Venture Intake Process</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Step-by-step guide to adding and analyzing new ventures
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <PlayCircle className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">GEDSI Tracking</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Understanding and managing GEDSI metrics and impact measurement
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <PlayCircle className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold">Advanced Analytics</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Using advanced features and generating comprehensive reports
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}