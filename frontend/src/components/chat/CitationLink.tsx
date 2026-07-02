import { useState } from 'react'
import type { Citation } from '../../types/copilot'

interface Props {
  citation: Citation
}

export default function CitationLink({ citation }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        className="citation-link"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          // In production: navigate to the artefact offset
          console.log('Jump to event:', citation.event_id)
        }}
      >
        [E:{citation.event_id.slice(0, 8)}]
      </span>

      {showTooltip && (
        <span className="absolute bottom-full left-0 mb-2 z-50 w-64 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl text-xs text-left pointer-events-none">
          <div className="text-gray-400 font-mono mb-1">Event ID: {citation.event_id}</div>
          <div className="text-white mb-1">{citation.summary}</div>
          <div className="text-gray-500">Source: {citation.artefact_name}</div>
          {citation.timestamp && (
            <div className="text-gray-500 mt-0.5">
              {new Date(citation.timestamp).toISOString().replace('T', ' ').slice(0, 19)} UTC
            </div>
          )}
        </span>
      )}
    </span>
  )
}
