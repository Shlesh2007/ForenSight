import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  HardDrive, Cpu, Wifi, CheckCircle, Clock, AlertCircle,
  RefreshCw, Search, ChevronLeft, ChevronRight,
} from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { mockCaseDetail, mockArtefactEvents, type ArtefactEvent } from '../services/mockData'
import type { Artefact } from '../types/case'

const PAGE_SIZE = 10

const EVENT_TYPE_OPTIONS = ['All', 'PROCESS_CREATE', 'FILE_ACCESS', 'FILE_WRITE', 'FILE_DELETE', 'FILE_COPY', 'NETWORK', 'AUTH', 'REGISTRY']

const EVENT_BADGE: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  AUTH:           'success',
  FILE_ACCESS:    'info',
  FILE_WRITE:     'warning',
  FILE_DELETE:    'danger',
  FILE_COPY:      'info',
  NETWORK:        'warning',
  PROCESS_CREATE: 'info',
  REGISTRY:       'danger',
}

function artefactIcon(type: Artefact['type']) {
  switch (type) {
    case 'disk':    return <HardDrive className="w-5 h-5 text-blue-400" />
    case 'memory':  return <Cpu className="w-5 h-5 text-purple-400" />
    case 'network': return <Wifi className="w-5 h-5 text-green-400" />
    default:        return <HardDrive className="w-5 h-5 text-gray-400" />
  }
}

function statusBadge(status: Artefact['status']) {
  const map = {
    done:    { variant: 'success' as const, label: 'Parsed' },
    parsing: { variant: 'warning' as const, label: 'Parsing' },
    pending: { variant: 'default' as const, label: 'Pending' },
    error:   { variant: 'danger' as const, label: 'Error' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function formatBytes(b: number) {
  if (b >= 1073741824) return `${(b / 1073741824).toFixed(1)} GB`
  if (b >= 1048576) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1024).toFixed(1)} KB`
}

function formatTs(iso: string) {
  return iso.replace('T', ' ').slice(0, 19) + ' UTC'
}

export default function ArtefactDetailPage() {
  const { caseId, artefactId } = useParams<{ caseId: string; artefactId: string }>()
  const { showToast } = useToast()

  const artefact = mockCaseDetail.artefacts.find((a) => a.id === artefactId) ?? mockCaseDetail.artefacts[0]

  // Filter state
  const [search, setSearch] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('All')
  const [minConfidence, setMinConfidence] = useState(0)
  const [page, setPage] = useState(1)

  const filtered = useMemo<ArtefactEvent[]>(() => {
    return mockArtefactEvents.filter((ev) => {
      if (eventTypeFilter !== 'All' && ev.eventType !== eventTypeFilter) return false
      if (ev.confidence < minConfidence) return false
      if (search && !ev.entity.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, eventTypeFilter, minConfidence])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleReparse() {
    showToast(`Re-parsing ${artefact.name}… (mock)`, 'info')
  }

  return (
    <AppShell caseId={caseId!} activePage="dashboard">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Artefact info card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="p-3 bg-gray-800 rounded-xl flex-shrink-0">
                {artefactIcon(artefact.type)}
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-bold text-white mb-1 truncate">{artefact.name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400">
                  <span className="capitalize">{artefact.type}</span>
                  <span>·</span><span>{formatBytes(artefact.size_bytes)}</span>
                  <span>·</span>{statusBadge(artefact.status)}
                </div>
                <p className="font-mono text-xs text-gray-600 mt-2 break-all">{artefact.sha256.slice(0, 32)}…</p>
              </div>
            </div>
            <button onClick={handleReparse}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors self-start sm:flex-shrink-0">
              <RefreshCw className="w-4 h-4" />Re-parse
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-base font-semibold text-white mb-4">Raw Events</h2>

          {/* Filter bar — stacked on mobile */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search entity…"
                className="w-full pl-8 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-navy-500" />
            </div>
            <select value={eventTypeFilter} onChange={(e) => { setEventTypeFilter(e.target.value); setPage(1) }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
              {EVENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">≥ {(minConfidence * 100).toFixed(0)}%</span>
              <input type="range" min={0} max={1} step={0.05} value={minConfidence}
                onChange={(e) => { setMinConfidence(parseFloat(e.target.value)); setPage(1) }}
                className="w-24 accent-navy-500" />
            </div>
            <span className="text-xs text-gray-500 self-center">{filtered.length} events</span>
          </div>

          {/* Table with horizontal scroll */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium text-right">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500 text-sm">No events match.</td></tr>
                  ) : pageItems.map((ev, i) => (
                    <tr key={ev.id} className={`border-b border-gray-800/60 hover:bg-gray-800/20 transition-colors ${i % 2 ? 'bg-gray-900/40' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{ev.id}</td>
                      <td className="px-4 py-3"><Badge variant={EVENT_BADGE[ev.eventType] ?? 'default'}>{ev.eventType}</Badge></td>
                      <td className="px-4 py-3 text-gray-300 max-w-[180px] truncate">{ev.entity}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{formatTs(ev.timestamp)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-semibold ${ev.confidence >= 0.95 ? 'text-green-400' : ev.confidence >= 0.85 ? 'text-amber-400' : 'text-red-400'}`}>
                          {(ev.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center text-gray-300">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-navy-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center text-gray-300">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
