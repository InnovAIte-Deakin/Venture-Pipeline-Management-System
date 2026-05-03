"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', current: segments.length === 0 }
    ]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
        current: index === segments.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400 mb-4">
      {breadcrumbs.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1 text-slate-400" />
          )}
          
          {item.current ? (
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href || '#'}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center"
            >
              {index === 0 ? (
                <Home className="h-4 w-4" />
              ) : (
                item.label
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 

// test comment