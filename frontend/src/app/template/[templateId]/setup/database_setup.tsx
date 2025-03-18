// src/components/setup/database-setup.tsx
'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio_group'
import { Database, Loader2 } from 'lucide-react'

interface DatabaseOption {
  id: string;
  name: string;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    type: string;
  }>;
}

const databaseOptions: DatabaseOption[] = [
  {
    id: 'mongodb',
    name: 'MongoDB',
    fields: [
      { 
        key: 'mongodb_uri',
        label: 'MongoDB URI',
        placeholder: 'mongodb://localhost:27017',
        type: 'password'  // Changed to password type
      },
      {
        key: 'db_name',
        label: 'Database Name',
        placeholder: 'your_database',
        type: 'text'
      },
      {
        key: 'collection_name',
        label: 'Collection Name',
        placeholder: 'products',
        type: 'text'
      }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL',
    fields: [
      {
        key: 'host',
        label: 'Host',
        placeholder: 'localhost',
        type: 'text'
      },
      {
        key: 'port',
        label: 'Port',
        placeholder: '3306',
        type: 'text'
      },
      {
        key: 'database',
        label: 'Database Name',
        placeholder: 'your_database',
        type: 'text'
      },
      {
        key: 'username',
        label: 'Username',
        placeholder: 'root',
        type: 'text'
      },
      {
        key: 'password',
        label: 'Password',
        placeholder: '********',
        type: 'password'
      }
    ]
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    fields: [
      {
        key: 'host',
        label: 'Host',
        placeholder: 'localhost',
        type: 'text'
      },
      {
        key: 'port',
        label: 'Port',
        placeholder: '5432',
        type: 'text'
      },
      {
        key: 'database',
        label: 'Database Name',
        placeholder: 'your_database',
        type: 'text'
      },
      {
        key: 'username',
        label: 'Username',
        placeholder: 'postgres',
        type: 'text'
      },
      {
        key: 'password',
        label: 'Password',
        placeholder: '********',
        type: 'password'
      }
    ]
  }
]

interface DatabaseSetupProps {
  onComplete: (connectionDetails: any) => void;
}

export function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [selectedDb, setSelectedDb] = useState('mongodb')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/connect-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to connect')
      }

      onComplete(formData)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const selectedDatabase = databaseOptions.find(db => db.id === selectedDb)

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select Database</h2>
      
      <RadioGroup
        value={selectedDb}
        onValueChange={setSelectedDb}
        className="space-y-2 mb-6"
      >
        {databaseOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <label htmlFor={option.id} className="text-sm font-medium">
              {option.name}
            </label>
          </div>
        ))}
      </RadioGroup>

      <form onSubmit={handleConnect} className="space-y-4">
        {selectedDatabase?.fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key] || ''}
              onChange={(e) => setFormData({
                ...formData,
                [field.key]: e.target.value
              })}
              className="mt-1"
            />
          </div>
        ))}

        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Connect Database
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}