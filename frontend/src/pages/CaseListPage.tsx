import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Plus, Clock, Database, AlertTriangle, X } from 'lucide-react'
import { mockCases } from '../services/mockData'
import type { CaseSummary } from '../types/case'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function CaseListPage() {
  const navigate = useNavigate()
  const [cases] = useState<CaseSummary[]>(mockCases)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  function handleCreate() {
    if (!form.name.trim()) return
    setShowModal(false)
    setForm({ name: '', description: '' })
    navigate(`/cases/case-001`)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-navy-400 w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">ForenSight AI</span>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline ml-1">v0.1-demo</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Case</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Investigations</h1>
        <p className="text-gray-400 text-sm mb-6">{cases.length} active cases</p>

        <div className="grid gap-3 md:gap-4">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/cases/${c.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 cursor-pointer hover:border-navy-600 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg font-semibold text-white group-hover:text-navy-300 transition-colors truncate">
                    {c.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{c.description}</p>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap flex-shrink-0 hidden sm:flex">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(c.created_at)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-4 text-xs md:text-sm">
                <Stat icon={<Database className="w-3 h-3 md:w-3.5 md:h-3.5" />} label="Artefacts" value={c.artefact_count} />
                <Stat icon={<Database className="w-3 h-3 md:w-3.5 md:h-3.5" />} label="Entities" value={c.entity_count.toLocaleString()} />
                <Stat icon={<Database className="w-3 h-3 md:w-3.5 md:h-3.5" />} label="Events" value={c.event_count.toLocaleString()} />
                {c.suspicious_count > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {c.suspicious_count} suspicious
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* New Case Modal — slides up from bottom on mobile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl p-6 md:p-8 w-full sm:max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Create New Case</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Case Name *</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-navy-500"
                  placeholder="e.g. Ransomware Incident 2024"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-navy-500 resize-none h-20"
                  placeholder="Brief description of the investigation..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim()}
                className="w-full bg-navy-700 hover:bg-navy-600 disabled:opacity-40 text-white py-3 rounded-lg font-medium text-sm transition-colors"
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <span className="flex items-center gap-1.5 text-gray-400">
      <span className="text-gray-500">{icon}</span>
      <span className="text-gray-200 font-medium">{value}</span>
      <span>{label}</span>
    </span>
  )
}
