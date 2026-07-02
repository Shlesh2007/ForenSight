import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, Search, Filter } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import { mockTimelineEvents, type TimelineEvent } from '../services/mockData'

const EVENT_TYPES = ['AUTH', 'FILE_ACCESS', 'FILE_WRITE', 'FILE_DELETE', 'FILE_COPY', 'NETWORK', 'PROCESS_CREATE', 'REGISTRY']
const ENTITY_TYPES = ['Process', 'File', 'User', 'Host', 'NetworkEndpoint']

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

function formatTs(iso: string) {
  return iso.replace('T', ' ').slice(0, 19) + ' UTC'
}

function inferEntityType(source: string): string {
  if (/\.exe|\.vbs|\.bat/i.test(source)) return 'Process'
  if (/\\\\/i.test(source) || /administrator|guest/i.test(source)) return 'User'
  if (/\d{1,3}\.\d{1,3}/.test(source)) return 'NetworkEndpoint'
  if (/desktop|server|host/i.test(source)) return 'Host'
  return 'File'
}

export default function TimelinePage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2024-03-10')
  const [endDate, setEndDate] = useState('2024-03-10')
  const [selectedEventTypes, setSelectedEventTypes] = useState<Set<string>>(new Set(EVENT_TYPES))
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<Set<string>>(new Set(ENTITY_TYPES))
  const [showFilters, setShowFilters] = useState(false)

  function toggleEventType(t: string) {
    setSelectedEventTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  function toggleEntityType(t: string) {
    setSelectedEntityTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  const filtered = useMemo<TimelineEvent[]>(() => {
    return mockTimelineEvents.filter((ev) => {
      const date = ev.timestamp.slice(0, 10)
      if (date < startDate || date > endDate) return false
      if (!selectedEventTypes.has(ev.eventType)) return false
      const entityType = inferEntityType(ev.source)
      if (!selectedEntityTypes.has(entityType)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!ev.source.toLowerCase().includes(q) && !ev.target.toLowerCase().includes(q) && !ev.relation.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, startDate, endDate, selectedEventTypes, selectedEntityTypes])

  return (
    <AppShell caseId={caseId!} activePage="timeline">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-navy-400" />
            Event Timeline
          </h1>
          <span className="text-sm text-gray-500">{filtered.length} events</span>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entities…"
              className="w-full pl-8 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-navy-500"
            />
          </div>
          {/* Date range */}
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500" />
            <span className="text-gray-500 text-sm flex-shrink-0">—</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500" />
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm transition-colors flex-shrink-0 ${showFilters ? 'bg-navy-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-800">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Type</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {EVENT_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white">
                      <input type="checkbox" checked={selectedEventTypes.has(t)} onChange={() => toggleEventType(t)} className="accent-navy-500" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Entity Type</p>
                <div className="space-y-1.5">
                  {ENTITY_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white">
                      <input type="checkbox" checked={selectedEntityTypes.has(t)} onChange={() => toggleEntityType(t)} className="accent-navy-500" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            No events match the current filters.
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-800 ml-3 space-y-0">
            {filtered.map((ev) => (
              <div key={ev.id} className="relative pl-8 pb-5">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-navy-600 bg-gray-950" />
                <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-gray-500">{formatTs(ev.timestamp)}</span>
                    <Badge variant={EVENT_BADGE[ev.eventType] ?? 'default'}>{ev.eventType}</Badge>
                    <span className="text-[11px] text-gray-600 ml-auto">from {ev.artefact}</span>
                  </div>
                  <p className="text-sm text-gray-200">
                    <span className="text-white font-medium">{ev.source}</span>
                    <span className="text-gray-500 mx-2 text-xs">{ev.relation}</span>
                    <span className="text-white font-medium">{ev.target}</span>
                  </p>
                  {ev.confidence < 0.9 && (
                    <span className="text-[11px] text-amber-500 mt-1 inline-block">
                      confidence: {(ev.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
