// src/components/sidebar.tsx
import Link from "next/link"
import { Settings, Home, Search, LineChart, Split, Zap, Database, MessageSquare, BarChart2, LayoutTemplate } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigation: NavigationSection[] = [
  {
    title: "SEARCH",
    items: [{ icon: Search, label: "Search", href: "#" }],
  },
  {
    title: "CONFIGURE",
    items: [
      { icon: Home, label: "Index", href: "/" },
      { icon: LayoutTemplate, label: "Templates", href: "/template" },
      { icon: Database, label: "Connect Database", href: "/connect" },
      { icon: MessageSquare, label: "Query Suggestions", href: "#" },
    ],
  },
  {
    title: "OBSERVE",
    items: [
      { icon: LineChart, label: "Analytics", href: "#" },
      { icon: Split, label: "A/B Testing", href: "#" },
    ],
  },
  {
    title: "ENHANCE",
    items: [
      { icon: Settings, label: "Rules", href: "#" },
      { icon: MessageSquare, label: "AI Synonyms", href: "#" },
      { icon: BarChart2, label: "Re-Ranking", href: "#" },
      { icon: Zap, label: "Query Categorization", href: "#" },
    ],
  },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 py-4 flex flex-col">
      {navigation.map((section) => (
        <div key={section.title} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-gray-500">{section.title}</h2>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  item.active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}