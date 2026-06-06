import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4" aria-hidden="true">🚗</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h1>
        <p className="text-gray-500 mb-8">
          This listing doesn't exist or may have been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ← Back to Inventory
        </Link>
      </div>
    </div>
  )
}
