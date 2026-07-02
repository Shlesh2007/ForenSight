import { Clock } from 'lucide-react'
import { mockGraph } from '../../services/mockData'

interface Props {
  caseId: string
}

export default function TimelineView({ caseId }: Props) {
  // Build a flat list of timestamped edges sorted chronologically
  const events = mockGraph.edges
    .filter((e) => e.timestamp)
    .map((e) => {
      const src = mockGraph.nodes.find((n) => n.id === e.source)
      const dst = mockGraph.nodes.find((n) => n.id === e.target)
      return {
        id: e.id,
        timestamp: e.timestamp!,
        label: `${src?.label ?? e.source} → ${e.type} → ${dst?.label ?? e.target}`,
        type: e.type,
        confidence: e.confidence ?? 1,
      }
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-navy-400" />
        Event Timeline
      </h2>

      <div className="relative border-l-2 border-gray-800 ml-3 space-y-0">
        {events.map((ev, i) => (
          <div key={ev.id} className="relative pl-8 pb-6">
            {/* Dot */}
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-navy-600 bg-gray-950" />

            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-mono text-xs text-gray-500">
                  {new Date(ev.timestamp).toISOString().replace('T', ' ').slice(0, 19)} UTC
                </span>
                <span className="text-xs text-navy-400 font-medium">{ev.type}</span>
              </div>
              <p className="text-sm text-gray-200 break-all">{ev.label}</p>
              {ev.confidence < 1 && (
                <span className="text-xs text-amber-500 mt-1 inline-block">
                  confidence: {(ev.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
