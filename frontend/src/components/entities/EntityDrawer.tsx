import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import type { GraphNode, NodeType } from '../../types/graph'

interface Props {
  entity: GraphNode | null
  onClose: () => void
}

const NODE_COLORS: Record<NodeType, string> = {
  Process:         '#7c3aed',
  File:            '#2563eb',
  User:            '#059669',
  Host:            '#0891b2',
  NetworkEndpoint: '#d97706',
  Artefact:        '#4b5563',
}

const BADGE_VARIANT: Record<NodeType, 'info' | 'warning' | 'success' | 'default' | 'danger'> = {
  Process:         'warning',
  File:            'info',
  User:            'success',
  Host:            'info',
  NetworkEndpoint: 'warning',
  Artefact:        'default',
}

interface RelatedEvent {
  id: string
  timestamp: string
  description: string
}

function getMockEvents(node: GraphNode): RelatedEvent[] {
  const base = '2024-03-10T14:'
  return [
    { id: 'ev1', timestamp: `${base}01:00Z`, description: `${node.label} was observed in memory` },
    { id: 'ev2', timestamp: `${base}01:05Z`, description: `${node.label} initiated network connection` },
    { id: 'ev3', timestamp: `${base}01:10Z`, description: `${node.label} accessed system registry` },
    { id: 'ev4', timestamp: `${base}01:20Z`, description: `${node.label} wrote to temp directory` },
    { id: 'ev5', timestamp: `${base}02:00Z`, description: `${node.label} terminated process tree` },
  ].slice(0, node.type === 'NetworkEndpoint' ? 3 : 5)
}

function formatTs(iso: string) {
  return iso.replace('T', ' ').slice(0, 19) + ' UTC'
}

export default function EntityDrawer({ entity, onClose }: Props) {
  const events = entity ? getMockEvents(entity) : []
  const confidence = entity?.suspicious ? 0.91 : 0.42

  return (
    <Drawer open={!!entity} onClose={onClose} title="Entity Detail">
      {entity && (
        <div className="px-6 py-5 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={BADGE_VARIANT[entity.type]}>{entity.type}</Badge>
              {entity.suspicious && (
                <Badge variant="danger">Suspicious</Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-white break-all leading-snug">
              {entity.label}
            </h3>
          </div>

          {/* Confidence */}
          <div className="bg-gray-800/60 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">Confidence Score</span>
              <span className={`text-xs font-semibold ${
                confidence >= 0.8 ? 'text-red-400' :
                confidence >= 0.5 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  confidence >= 0.8 ? 'bg-red-500' :
                  confidence >= 0.5 ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Attributes */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Attributes
            </h4>
            {Object.keys(entity.attributes).length === 0 ? (
              <p className="text-xs text-gray-600">No attributes recorded.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(entity.attributes).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 min-w-[80px] flex-shrink-0">{k}</span>
                    <span className="text-gray-300 font-mono break-all">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related events */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Related Events
            </h4>
            <div className="space-y-2">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-gray-800/60 border border-gray-700/40 rounded-lg px-3 py-2.5"
                >
                  <p className="text-xs text-gray-300 mb-1">{ev.description}</p>
                  <span className="text-[11px] font-mono text-gray-600">{formatTs(ev.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color chip */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: NODE_COLORS[entity.type] }}
            />
            Graph node colour: {entity.type}
          </div>
        </div>
      )}
    </Drawer>
  )
}
