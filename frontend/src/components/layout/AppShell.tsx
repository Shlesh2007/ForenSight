import { useState } from 'react'
import type { ReactNode } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { mockCaseDetail } from '../../services/mockData'

interface Props {
  caseId: string
  activePage: string
  children: ReactNode
}

export default function AppShell({ caseId, activePage, children }: Props) {
  const caseData = mockCaseDetail
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Derive active sidebar item from URL so highlight is always correct
  function deriveActivePage(): string {
    const path = location.pathname
    const tab = new URLSearchParams(location.search).get('tab')
    if (path.endsWith('/timeline')) return 'timeline'
    if (path.endsWith('/reports'))  return 'reports'
    if (path.endsWith('/settings')) return 'settings'
    if (tab === 'graph')   return 'graph'
    if (tab === 'chat')    return 'chat'
    if (tab === 'dashboard' || path.match(/\/cases\/[^/]+$/) ) return 'dashboard'
    return activePage
  }

  const resolvedPage = deriveActivePage()

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:block sticky top-0 h-screen flex-shrink-0">
        <Sidebar caseId={caseId} activePage={resolvedPage} />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar caseId={caseId} activePage={resolvedPage} onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-gray-900/60 border-b border-gray-800 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — only on mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white truncate max-w-[160px] sm:max-w-xs">{caseData.name}</h1>
            <span className="hidden sm:block text-gray-700">·</span>
            <span className="hidden sm:block text-xs text-gray-500 capitalize">{resolvedPage.replace('-', ' ')}</span>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0">
            <Search className="w-4 h-4" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
