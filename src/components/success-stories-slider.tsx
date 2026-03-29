"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, Star, TrendingUp, Users, Target } from "lucide-react"

interface SuccessStory {
  id: number
  name: string
  description: string
  metrics: string
  color: string
  bg: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  location: string
  year: string
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "GreenTech Solutions",
    description: "Achieved 95% GEDSI compliance and secured $2M in funding through our platform's comprehensive impact tracking and reporting tools.",
    metrics: "150% growth",
    color: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
    icon: TrendingUp,
    category: "Clean Energy",
    location: "Vietnam",
    year: "2024"
  },
  {
    id: 2,
    name: "EcoFarm Vietnam",
    description: "Serving 200+ rural communities with sustainable agriculture initiatives, creating lasting impact across Southeast Asia.",
    metrics: "500+ jobs created",
    color: "from-blue-500 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    icon: Users,
    category: "Agriculture",
    location: "Vietnam",
    year: "2024"
  },
  {
    id: 3,
    name: "TechStart Cambodia",
    description: "Digital inclusion initiative transforming youth employment through innovative technology training and placement programs.",
    metrics: "1000+ beneficiaries",
    color: "from-purple-500 to-pink-500",
    bg: "from-purple-50 to-pink-50",
    icon: Target,
    category: "Education",
    location: "Cambodia",
    year: "2024"
  },
  {
    id: 4,
    name: "HealthConnect Laos",
    description: "Revolutionizing healthcare access in rural areas through telemedicine and mobile health solutions.",
    metrics: "50+ clinics connected",
    color: "from-orange-500 to-red-500",
    bg: "from-orange-50 to-red-50",
    icon: Star,
    category: "Healthcare",
    location: "Laos",
    year: "2024"
  },
  {
    id: 5,
    name: "EduTech Myanmar",
    description: "Providing digital education solutions to underserved communities, reaching over 10,000 students annually.",
    metrics: "10,000+ students",
    color: "from-indigo-500 to-blue-500",
    bg: "from-indigo-50 to-blue-50",
    icon: TrendingUp,
    category: "Education",
    location: "Myanmar",
    year: "2024"
  }
]

export function SuccessStoriesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setSlideDirection('right')
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % successStories.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex, nextSlide])

  const prevSlide = () => {
    if (isTransitioning) return
    setSlideDirection('left')
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setSlideDirection(index > currentIndex ? 'right' : 'left')
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const getSlideTransform = (index: number) => {
    if (index === currentIndex) {
      return 'translateX(0) scale(1)'
    }
    
    if (slideDirection === 'right') {
      if (index < currentIndex) {
        return 'translateX(-100%) scale(0.95)'
      } else {
        return 'translateX(100%) scale(0.95)'
      }
    } else {
      if (index < currentIndex) {
        return 'translateX(-100%) scale(0.95)'
      } else {
        return 'translateX(100%) scale(0.95)'
      }
    }
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-8">
      {/* Main Slide Container */}
      <div 
        ref={containerRef}
        className="relative h-96 mb-8 overflow-hidden rounded-2xl"
      >
        {successStories.map((story, index) => (
          <div
            key={story.id}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              index === currentIndex
                ? "opacity-100 z-10"
                : "opacity-0 z-0"
            }`}
            style={{
              transform: getSlideTransform(index),
            }}
          >
            <Card className="relative bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 h-full shadow-xl hover:shadow-2xl group overflow-hidden">
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${story.bg} opacity-50`} />
              
              <CardContent className="relative p-8 h-full flex flex-col justify-between z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {story.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {story.location}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {story.year}
                      </Badge>
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-2">{story.name}</h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${story.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <story.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={`bg-gradient-to-r ${story.color} text-white border-0 shadow-lg text-sm`}>
                      {story.metrics}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <p className="text-gray-600 leading-relaxed text-lg">{story.description}</p>
                </div>

                {/* Progress indicator */}
                <div className="mt-6">
                  <div className="flex space-x-2">
                    {successStories.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? `bg-gradient-to-r ${story.color} w-12`
                            : "bg-gray-300 w-4 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${story.color} rounded-full opacity-10`} />
              <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br ${story.color} rounded-full opacity-10`} />
            </Card>
          </div>
        ))}
      </div>


    </div>
  )
}

export default SuccessStoriesSlider 