// src/components/breadcrumb.tsx
import Link from "next/link"
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
            <Link
              href={item.href}
              className={`text-sm ${
                index === items.length - 1
                  ? "text-gray-500"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}