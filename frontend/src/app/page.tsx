
// src/app/page.tsx
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

import { Share2 } from 'lucide-react'
import { SearchResults } from '../components/search_results'
export default function DashboardPage() {
  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Application", href: "/" },
          { label: "Dashboard", href: "/" }
        ]}
      />
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-12 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">Customize your search experience</h2>
          <p className="mt-4 text-lg text-gray-600">
            Promote or hide items, boost categories, remove words from your query, create banners,
            redirect users to another page, and much more.
          </p>
          <div className="mt-6 flex gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Create your first Rule
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      <SearchResults />
    </div>
  )
}