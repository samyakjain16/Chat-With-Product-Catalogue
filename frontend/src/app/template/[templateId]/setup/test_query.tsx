// src/components/setup/test-queries.tsx
'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from 'lucide-react'

interface TestQueriesProps {
  connectionDetails: any;
  fieldMappings: any;
}

export function TestQueries({ connectionDetails, fieldMappings }: TestQueriesProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          ...connectionDetails
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Test Your Setup</h2>
      <p className="text-gray-600 mb-6">
        Try searching your product catalog to test the setup.
      </p>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: show me red t-shirts under $50"
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Results:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <pre className="text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}