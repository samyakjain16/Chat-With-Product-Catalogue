// src/app/dashboard/connect/page.tsx
'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database, Loader2 } from 'lucide-react'

interface ConnectionState {
  step: 'connect' | 'mapping'
  isLoading: boolean
  error: string
  success: boolean
  fieldMappings: any
}

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    mongodb_uri: '',
    db_name: '',
    collection_name: ''
  })

  const [state, setState] = useState<ConnectionState>({
    step: 'connect',
    isLoading: false,
    error: '',
    success: false,
    fieldMappings: null
  })

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setState(prev => ({ ...prev, isLoading: true, error: '' }))
    
    try {
      // First, test database connection
      const response = await fetch('http://localhost:8000/api/v1/connect-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to connect')
      }

      // If connection successful, analyze fields
      const mappingResponse = await fetch('http://localhost:8000/api/v1/analyze-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!mappingResponse.ok) {
        throw new Error('Failed to analyze fields')
      }

      const mappingData = await mappingResponse.json()
      setState(prev => ({
        ...prev,
        step: 'mapping',
        fieldMappings: mappingData.field_mappings,
        success: true
      }))
      
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || 'An unexpected error occurred'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {state.step === 'connect' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900">Connect Your Database</h1>
            <p className="mt-2 text-gray-600">
              Connect your MongoDB database to start using our platform's features.
            </p>

            <Card className="mt-6 p-6">
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    MongoDB URI
                  </label>
                  <Input
                    type="text"
                    placeholder="mongodb://localhost:27017"
                    value={formData.mongodb_uri}
                    onChange={(e) => setFormData({
                      ...formData,
                      mongodb_uri: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Database Name
                  </label>
                  <Input
                    type="text"
                    placeholder="your_database"
                    value={formData.db_name}
                    onChange={(e) => setFormData({
                      ...formData,
                      db_name: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Collection Name
                  </label>
                  <Input
                    type="text"
                    placeholder="products"
                    value={formData.collection_name}
                    onChange={(e) => setFormData({
                      ...formData,
                      collection_name: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                {state.error && (
                  <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                    {state.error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  {state.isLoading ? 'Connecting...' : 'Connect Database'}
                </Button>
              </form>
            </Card>
          </>
        ) : (
          <FieldMappings 
            mappings={state.fieldMappings}
            onUpdate={async (updatedMappings) => {
              // Handle mapping updates
            }}
          />
        )}
      </div>
    </div>
  )
}

// Field Mappings Component
function FieldMappings({ 
  mappings, 
  onUpdate 
}: { 
  mappings: Record<string, string>
  onUpdate: (mappings: Record<string, string>) => Promise<void>
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Field Mappings</h2>
      <p className="mt-2 text-gray-600">
        Review and update your field mappings if needed.
      </p>

      <Card className="mt-6 p-6">
        <div className="space-y-4">
          {Object.entries(mappings).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
              </div>
              <Input
                value={value}
                onChange={(e) => {
                  const newMappings = { ...mappings, [key]: e.target.value }
                  onUpdate(newMappings)
                }}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}