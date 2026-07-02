import type { NodeType } from '../../types/graph'

const ALL_TYPES: NodeType[] = ['Process', 'File', 'User', 'Host', 'NetworkEndpoint', 'Artefact']

interface Props {
  activeTypes: Set<NodeType>
  onToggle: (type: NodeType) => void
}

export default function GraphControls({ activeTypes, onToggle }: Props) {
  return (
    <div className="p-4 border-b border-gray-800">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filter Nodes</h3>
      <div className="space-y-1.5">
        {ALL_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeTypes.has(type)}
              onChange={() => onToggle(type)}
              className="w-3.5 h-3.5 accent-navy-500 cursor-pointer"
            />
            <span className={`text-sm transition-colors ${
              activeTypes.has(type) ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {type}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
