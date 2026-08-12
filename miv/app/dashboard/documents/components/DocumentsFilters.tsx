'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface DocumentsFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  selectedType: string;
  setSelectedType: (value: string) => void;

  selectedVenture: string;
  setSelectedVenture: (value: string) => void;

  documentTypes: {
    value: string;
    label: string;
  }[];

  ventures: {
    value: string;
    label: string;
  }[];
}

export default function DocumentsFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedVenture,
  setSelectedVenture,
  documentTypes,
  ventures,
}: DocumentsFiltersProps) {
  return (
    <><Card className="rounded-2xl border border-slate-200 shadow-sm">
    <CardContent className="p-5 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200"
            />
          </div>
        </div>
  
        <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-full h-11 rounded-xl lg:w-52">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
  
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
  
            {documentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        <Select
          value={selectedVenture}
          onValueChange={setSelectedVenture}
        >
          <SelectTrigger className="w-full h-11 rounded-xl lg:w-52">
            <SelectValue placeholder="Venture" />
          </SelectTrigger>
  
          <SelectContent>
            {ventures.map(venture => (
              <SelectItem
                key={venture.value}
                value={venture.value}
              >
                {venture.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
      </div>
    </CardContent>
  </Card></>    
  );
}