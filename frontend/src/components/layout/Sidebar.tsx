import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  Share2,
  Clock,
  MessageSquare,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  Home,
  User,
  ChevronUp,
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

interface Props {
  caseId: string
  activePage: string
  onClose?: () => void
}

export default function Sidebar({ caseId, activePage, onClose }: Props) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: `/cases/${caseId}?tab=dashboard`,
    },
    {
      id: 'graph',
      label: 'Graph Explorer',
      icon: <Share2 className="w-4 h-4" />,
      href: `/cases/${caseId}?tab=graph`,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Clock className="w-4 h-4" />,
      href: `/cases/${caseId}/timeline`,
    },
    {
      id: 'chat',
      label: 'Copilot Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      href: `/cases/${caseId}?tab=chat`,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-4 h-4" />,
      href: `/cases/${caseId}/reports`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      href: `/cases/${caseId}/settings`,
    },
  ]

  function handleLogout() {
    setProfileOpen(false)
    navigate('/login')
  }

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-shrink-0">
      {/* Logo — clicking goes back to case list */}
      <div
        className="px-5 py-5 border-b border-gray-800 flex items-center gap-2.5 cursor-pointer hover:bg-gray-800/40 transition-colors"
        onClick={() => { navigate('/'); onClose?.() }}
      >
        <ShieldCheck className="w-5 h-5 text-navy-400" />
        <span className="font-bold text-white text-sm tracking-tight">ForenSight AI</span>
      </div>

      {/* All Cases link */}
      <div className="px-3 pt-3">
        <button
          onClick={() => { navigate('/'); onClose?.() }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          All Investigations
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-navy-700/60 text-white border border-navy-600/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <span className={isActive ? 'text-navy-300' : 'text-gray-500'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Profile section with dropdown */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-3" ref={profileRef}>
        {/* Profile dropdown menu */}
        {profileOpen && (
          <div className="mb-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="text-sm font-medium text-white">S. Darji</div>
              <div className="text-xs text-gray-500 mt-0.5">s.darji@forensight.ai</div>
            </div>
            <div className="py-1">
              <button
                onClick={() => { setProfileOpen(false); navigate('/profile') }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings') }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
              >
                <Settings className="w-4 h-4" />
                App Settings
              </button>
              <div className="border-t border-gray-700 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Profile trigger button */}
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all ${
            profileOpen
              ? 'bg-gray-800 border border-gray-700'
              : 'hover:bg-gray-800/60 border border-transparent'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            SD
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-medium text-white truncate">S. Darji</div>
            <div className="text-[11px] text-gray-500 truncate">Investigator</div>
          </div>
          <ChevronUp
            className={`w-3.5 h-3.5 text-gray-500 transition-transform flex-shrink-0 ${
              profileOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </div>
    </aside>
  )
}
