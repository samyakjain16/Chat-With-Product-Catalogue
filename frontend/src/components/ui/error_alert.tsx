// src/components/ui/error-alert.tsx
import { XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ title = "Error", message, onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try Again
        </button>
      )}
    </Alert>
  )
}