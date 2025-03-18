// src/components/search-results.tsx
import { Card } from "@/components/ui/card"
import { ArrowUpCircle, Filter, XCircle, ArrowRight } from 'lucide-react'

const searchResults = [
  {
    title: "Promote results",
    icon: ArrowUpCircle,
    description: "Boost specific results to the top",
  },
  {
    title: "Filter results",
    icon: Filter,
    description: "Remove unwanted results",
  },
  {
    title: "Hide results",
    icon: XCircle,
    description: "Completely hide specific results",
  },
  {
    title: "Redirect to a page",
    icon: ArrowRight,
    description: "Send users to a specific destination",
  },
]

export function SearchResults() {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {searchResults.map((result) => (
        <Card key={result.title} className="p-6">
          <result.icon className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 font-semibold text-gray-900">{result.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{result.description}</p>
        </Card>
      ))}
    </div>
  )
}