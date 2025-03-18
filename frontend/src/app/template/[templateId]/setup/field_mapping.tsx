'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from 'lucide-react';

interface FieldMappings {
  name?: string;
  description?: string;
  price?: string;
  color?: string;
  size?: string;
  category?: string;
  brand?: string;
  images?: string;
  [key: string]: string | undefined;
}

interface FieldMappingProps {
  connectionDetails: {
    mongodb_uri: string;
    db_name: string;
    collection_name: string;
  };
  onComplete: (mappings: FieldMappings) => void;
}

export function FieldMapping({ connectionDetails, onComplete }: FieldMappingProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mappings, setMappings] = useState<FieldMappings>({});

  const parseFieldMappings = (data: any) => {
    try {
      // Extract the field_mappings string and parse it
      const mappingsStr = data.field_mappings;
      if (typeof mappingsStr === 'string') {
        // Remove extra backslashes and parse the string
        const cleanStr = mappingsStr
          .replace(/\\"/g, '"')  // Replace \" with "
          .replace(/\\\\/g, '\\'); // Replace \\ with \
        
        // Parse the cleaned string to get the mappings object
        const parsedMappings = JSON.parse(cleanStr);
        
        // Convert to our expected format
        const formattedMappings: FieldMappings = {};
        Object.entries(parsedMappings).forEach(([key, value]) => {
          if (typeof value === 'string') {
            formattedMappings[key] = value;
          }
        });
        
        return formattedMappings;
      }
      return {};
    } catch (err) {
      console.error('Error parsing field mappings:', err);
      return {};
    }
  };

  const analyzeFields = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/analyze-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze fields');
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.field_mappings) {
        const parsedMappings = parseFieldMappings(data);
        console.log('Parsed mappings:', parsedMappings);
        setMappings(parsedMappings);
      } else {
        throw new Error('No field mappings received');
      }
    } catch (err: any) {
      console.error('Error in analyzeFields:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeFields();
  }, []);

  const getFieldLabel = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Field Mappings</h2>
      <p className="text-gray-600 mb-6">
        We've analyzed your database schema. Review and adjust the mappings if needed.
      </p>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2">Analyzing fields...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
          <Button
            onClick={analyzeFields}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && Object.keys(mappings).length > 0 && (
        <div className="space-y-4">
          {Object.entries(mappings).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  {getFieldLabel(key)}
                </label>
              </div>
              <Input
                value={value || ''}
                onChange={(e) => setMappings(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="flex-1"
                placeholder={`Enter field name for ${getFieldLabel(key)}`}
              />
            </div>
          ))}

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={analyzeFields}
              disabled={loading}
            >
              Reanalyze Fields
            </Button>
            <Button
              onClick={() => onComplete(mappings)}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Mappings
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && Object.keys(mappings).length === 0 && (
        <p>No valid mappings found. Please retry.</p>
      )}
    </Card>
  );
}