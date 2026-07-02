import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, LayoutDashboard, Share2, MessageSquare } from 'lucide-react'
import CaseDashboard from '../components/dashboard/CaseDashboard'
import GraphExplorer from '../components/graph/GraphExplorer'
import ChatPanel from '../components/chat/ChatPanel'
import { mockCaseDetail } from '../services/mockData'

type Tab = 'dashboard' | 'graph' | 'chat'

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const caseData = mockCaseDetail // replace with API call in production

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'graph',     label: 'Graph Explorer', icon: <Share2 className="w-4 h-4" /> },
    { id: 'chat',      label: 'Copilot Chat', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShieldCheck className="text-navy-400 w-6 h-6" />
          <span className="font-bold text-white">{caseData.name}</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-sm">{caseData.artefact_count} artefacts</span>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 -mb-px">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? 'border-navy-400 text-navy-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && <CaseDashboard caseId={caseId!} />}
        {activeTab === 'graph'     && <GraphExplorer caseId={caseId!} />}
        {activeTab === 'chat'      && <ChatPanel caseId={caseId!} />}
      </div>
    </div>
  )
}
