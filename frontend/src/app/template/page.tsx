'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb } from "@/components/breadcrumb"

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  aspectRatio: string;
}

const templates: Template[] = [
  {
    id: 'clothing',
    title: 'Apparel Catalogue',
    description: 'A template for showcasing fashion items with elegant layouts and multiple product views.',
    image: '/images/clothing-template2.png',  // Local image path
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: 'electronics',
    title: 'Electronics Catalogue',
    description: 'Display your latest tech products with detailed specifications and feature highlights.',
    image: '/images/electronics-catalogue.png',  // Local image path
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: 'home-decor',
    title: 'Home Decor Catalogue',
    description: 'Showcase interior design products with room settings and style combinations.',
    image: '/images/home-decour.png',  // Local image path
    aspectRatio: 'aspect-[4/3]'
  },
  /*
  {
    id: 'sports',
    title: 'Sports Equipment Catalogue',
    description: 'Feature athletic gear and accessories with dynamic layouts and category organization.',
    image: '/images/clothing-template2.png',  // Local image path
    aspectRatio: 'aspect-[4/3]'
  }
    */
]

export default function TemplatesPage() {
  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Application", href: "/" },
          { label: "My First Application", href: "#" },
          { label: "Templates", href: "/templates" }
        ]}
      />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Templates</h1>
          <p className="mt-2 text-gray-600">
            Choose from a variety of product catalogue templates to showcase your items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="mt-2 text-gray-600 h-20">{template.description}</p>
            <div className={`mt-4 relative w-full ${template.aspectRatio} overflow-hidden rounded-lg bg-gray-100`}>
              <Image
                src={template.image}
                alt={`${template.title} preview`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <Link 
              href={`/template/${template.id}/setup`}
              className="mt-6 w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Use Template
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}