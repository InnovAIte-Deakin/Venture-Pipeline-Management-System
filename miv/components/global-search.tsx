"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Search,
  Building2,
  Users,
  FileText,
  DollarSign,
  FolderKanban,
  Award,
  Calendar,
  TrendingUp,
  X,
  Loader2,
  Clock,
  ChevronRight,
  Command
} from "lucide-react"

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  description?: string
  type: 'venture' | 'user' | 'document' | 'fund' | 'project' | 'gedsi' | 'capital' | 'task'
  url: string
  metadata?: {
    status?: string
    stage?: string
    amount?: number
    date?: string
  }
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

const RESULT_TYPE_CONFIG = {
  venture: {
    icon: Building2,
    label: 'Ventures',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  user: {
    icon: Users,
    label: 'Users',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  document: {
    icon: FileText,
    label: 'Documents',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  fund: {
    icon: DollarSign,
    label: 'Funds',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  project: {
    icon: FolderKanban,
    label: 'Projects',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  gedsi: {
    icon: Award,
    label: 'GEDSI Metrics',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  capital: {
    icon: TrendingUp,
    label: 'Capital Activities',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
  task: {
    icon: Calendar,
    label: 'Tasks',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10'
  }
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('miv_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.results)
      } else {
        console.error('Search failed:', response.statusText)
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, results])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('miv_recent_searches', JSON.stringify(updated))

    // Navigate to result
    router.push(result.url)
    onClose()
  }

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('miv_recent_searches')
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        <div className="w-full max-w-2xl bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700">
            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search ventures, documents, users, funds..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 outline-none text-lg"
            />
            {isLoading && <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />}
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800/50 rounded-lg transition-colors group"
                    >
                      <Clock className="h-4 w-4 text-slate-500 group-hover:text-slate-400" />
                      <span className="text-sm text-slate-300 group-hover:text-slate-100">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && !isLoading && results.length === 0 && (
              <div className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 mb-2">No results found</p>
                <p className="text-sm text-slate-500">
                  Try searching for ventures, documents, or users
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div ref={resultsRef} className="py-2">
                {Object.entries(groupedResults).map(([type, items]) => {
                  const config = RESULT_TYPE_CONFIG[type as keyof typeof RESULT_TYPE_CONFIG]
                  if (!config) return null

                  return (
                    <div key={type} className="mb-4">
                      <div className="px-4 py-2 flex items-center gap-2">
                        <config.icon className={cn("h-4 w-4", config.color)} />
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {config.label}
                        </h3>
                        <span className="text-xs text-slate-500">({items.length})</span>
                      </div>
                      <div className="space-y-1 px-2">
                        {items.map((result, index) => {
                          const globalIndex = results.indexOf(result)
                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSelectResult(result)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                                globalIndex === selectedIndex
                                  ? "bg-slate-800 ring-2 ring-blue-500/50"
                                  : "hover:bg-slate-800/50"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg flex-shrink-0",
                                config.bgColor
                              )}>
                                <config.icon className={cn("h-4 w-4", config.color)} />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-sm font-medium text-slate-100 group-hover:text-white truncate">
                                  {result.title}
                                </div>
                                {result.subtitle && (
                                  <div className="text-xs text-slate-400 truncate">
                                    {result.subtitle}
                                  </div>
                                )}
                                {result.description && (
                                  <div className="text-xs text-slate-500 truncate mt-0.5">
                                    {result.description}
                                  </div>
                                )}
                                {result.metadata && (
                                  <div className="flex items-center gap-2 mt-1">
                                    {result.metadata.status && (
                                      <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                        {result.metadata.status}
                                      </span>
                                    )}
                                    {result.metadata.stage && (
                                      <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                        {result.metadata.stage}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Esc</kbd>
                  Close
                </span>
              </div>
              {results.length > 0 && (
                <span className="text-slate-400">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook to control global search
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}