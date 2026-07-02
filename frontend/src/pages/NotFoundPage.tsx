import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="w-16 h-16 text-gray-700 mb-6" />
      <h1 className="text-8xl font-bold text-gray-800 mb-4 leading-none">404</h1>
      <h2 className="text-xl font-semibold text-white mb-3">Page not found</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        The route you're looking for doesn't exist. It may have been moved or deleted.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Investigations
      </Link>
    </div>
  )
}
