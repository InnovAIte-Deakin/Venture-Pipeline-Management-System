"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Calendar,
  CalendarIcon,
  Filter,
  X,
  Plus,
  Save,
  RotateCcw,
  Search,
  ChevronDown
} from "lucide-react"
import { format } from "date-fns"

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'multiselect' | 'range'
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FilterValue {
  field: string
  operator: string
  value: unknown
}

interface AdvancedFiltersProps {
  fields: FilterField[]
  onFiltersChange: (filters: FilterValue[]) => void
  savedFilters?: { name: string; filters: FilterValue[] }[]
  onSaveFilter?: (name: string, filters: FilterValue[]) => void
  className?: string
}

const operators = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'not_contains', label: 'Does not contain' }
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not equals' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: 'equals', label: 'On' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'between', label: 'Between' }
  ]
}

export function AdvancedFilters({
  fields,
  onFiltersChange,
  savedFilters = [],
  onSaveFilter,
  className = ""
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterValue[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [saveFilterName, setSaveFilterName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const addFilter = () => {
    const newFilter: FilterValue = {
      field: fields[0]?.key || '',
      operator: 'contains',
      value: ''
    }
    const newFilters = [...filters, newFilter]
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const updateFilter = (index: number, updates: Partial<FilterValue>) => {
    const newFilters = filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    )
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setFilters([])
    onFiltersChange([])
  }

  const loadSavedFilter = (savedFilter: { name: string; filters: FilterValue[] }) => {
    setFilters(savedFilter.filters)
    onFiltersChange(savedFilter.filters)
    setIsOpen(false)
  }

  const saveCurrentFilter = () => {
    if (saveFilterName && onSaveFilter) {
      onSaveFilter(saveFilterName, filters)
      setSaveFilterName("")
      setShowSaveDialog(false)
    }
  }

  const getFieldType = (fieldKey: string) => {
    return fields.find(f => f.key === fieldKey)?.type || 'text'
  }

  const getFieldOptions = (fieldKey: string) => {
    return fields.find(f => f.key === fieldKey)?.options || []
  }

  const renderFilterValue = (filter: FilterValue, index: number) => {
    const field = fields.find(f => f.key === filter.field)
    if (!field) return null

    switch (field.type) {
      case 'select':
        return (
          <Select
            value={String(filter.value)}
            onValueChange={(value) => updateFilter(index, { value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filter.value ? format(new Date(String(filter.value)), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              {/* Calendar component would go here */}
              <div className="p-4">
                <Input
                  type="date"
                  value={String(filter.value)}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                />
              </div>
            </PopoverContent>
          </Popover>
        )

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter number"
            value={String(filter.value)}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            className="w-48"
          />
        )

      default:
        return (
          <Input
            placeholder={field.placeholder || "Enter value"}
            value={String(filter.value)}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            className="w-48"
          />
        )
    }
  }

  const activeFiltersCount = filters.filter(f => f.value).length

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Advanced Filters</h3>
              <div className="flex items-center space-x-2">
                {filters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Saved Filters</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {savedFilters.map((savedFilter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedFilter(savedFilter)}
                    >
                      {savedFilter.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {filters.map((filter, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Filter {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Field</Label>
                    <Select
                      value={filter.field}
                      onValueChange={(value) => updateFilter(index, { field: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map(field => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Operator</Label>
                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(index, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators[getFieldType(filter.field) as keyof typeof operators]?.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Value</Label>
                  {renderFilterValue(filter, index)}
                </div>
              </div>
            ))}

            {/* Add Filter Button */}
            <Button
              variant="outline"
              onClick={addFilter}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {onSaveFilter && filters.length > 0 && (
                  <>
                    {showSaveDialog ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Filter name"
                          value={saveFilterName}
                          onChange={(e) => setSaveFilterName(e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm" onClick={saveCurrentFilter}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSaveDialog(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSaveDialog(true)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              <Button onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.filter(f => f.value).map((filter, index) => {
            const field = fields.find(f => f.key === filter.field)
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {field?.label}: {String(filter.value)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filters.indexOf(filter))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
