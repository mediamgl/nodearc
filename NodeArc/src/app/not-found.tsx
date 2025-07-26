// Create this file: src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-4">Could not find the requested resource</p>
        <Link
          href="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
