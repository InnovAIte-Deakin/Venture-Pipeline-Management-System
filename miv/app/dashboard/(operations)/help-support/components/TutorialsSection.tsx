import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, ExternalLink } from "lucide-react"

interface Tutorial {
  id: string
  title: string
  description: string
  iconClassName: string
  href: string
}

const tutorials: Tutorial[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of navigating the platform and setting up your account",
    iconClassName: "text-primary",
    href: "/dashboard",
  },
  {
    id: "venture-intake",
    title: "Venture Intake Process",
    description: "Step-by-step guide to adding and analyzing new ventures",
    iconClassName: "text-green-600",
    href: "/dashboard/venture-intake",
  },
  {
    id: "gedsi-tracking",
    title: "GEDSI Tracking",
    description: "Understanding and managing GEDSI metrics and impact measurement",
    iconClassName: "text-purple-600",
    href: "/dashboard/iris-metrics",
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Using advanced features and generating comprehensive reports",
    iconClassName: "text-orange-600",
    href: "/dashboard/advanced-reports",
  },
]

interface TutorialsSectionProps {
  searchValue?: string
}

export default function TutorialsSection({ searchValue = "" }: TutorialsSectionProps) {
  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredTutorials = tutorials.filter((tutorial) => {
    const searchableText = `${tutorial.title} ${tutorial.description}`.toLowerCase()
    return !normalizedSearch || searchableText.includes(normalizedSearch)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Tutorials</CardTitle>
        <CardDescription>
          Learn how to use the MIV Platform effectively with our video guides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredTutorials.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No matching tutorials found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <PlayCircle className={`h-5 w-5 ${tutorial.iconClassName}`} />
                <h3 className="font-semibold">{tutorial.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {tutorial.description}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={tutorial.href}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Guide
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
