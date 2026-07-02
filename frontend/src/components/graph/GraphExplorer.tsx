import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import { mockGraph } from '../../services/mockData'
import GraphControls from './GraphControls'
import type { NodeType } from '../../types/graph'

const NODE_COLORS: Record<NodeType, string> = {
  Process:         '#7c3aed',
  File:            '#2563eb',
  User:            '#059669',
  Host:            '#0891b2',
  NetworkEndpoint: '#d97706',
  Artefact:        '#4b5563',
}

interface Props {
  caseId: string
}

export default function GraphExplorer({ caseId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const [selectedNode, setSelectedNode] = useState<{ label: string; type: string; attributes: Record<string, unknown> } | null>(null)
  const [activeTypes, setActiveTypes] = useState<Set<NodeType>>(
    new Set(['Process', 'File', 'User', 'Host', 'NetworkEndpoint'])
  )

  const graphData = mockGraph

  useEffect(() => {
    if (!containerRef.current) return

    const elements = [
      ...graphData.nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label.length > 22 ? n.label.slice(-22) : n.label,
          fullLabel: n.label,
          type: n.type,
          suspicious: n.suspicious ?? false,
          attributes: n.attributes,
        },
      })),
      ...graphData.edges.map((e) => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.type,
          confidence: e.confidence ?? 1,
        },
      })),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: cytoscape.NodeSingular) => NODE_COLORS[ele.data('type') as NodeType] ?? '#4b5563',
            'border-width': (ele: cytoscape.NodeSingular) => ele.data('suspicious') ? 3 : 1,
            'border-color': (ele: cytoscape.NodeSingular) => ele.data('suspicious') ? '#f59e0b' : '#374151',
            'label': 'data(label)',
            'color': '#e5e7eb',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'width': 36,
            'height': 36,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#60a5fa',
            'border-width': 3,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#374151',
            'target-arrow-color': '#374151',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'color': '#6b7280',
            'text-rotation': 'autorotate',
            'text-margin-y': -6,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#60a5fa',
            'target-arrow-color': '#60a5fa',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 600,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 120,
        fit: true,
        padding: 40,
      } as cytoscape.LayoutOptions,
    })

    cy.on('tap', 'node', (evt) => {
      const node = evt.target
      setSelectedNode({
        label: node.data('fullLabel'),
        type: node.data('type'),
        attributes: node.data('attributes'),
      })
    })

    cy.on('tap', (evt) => {
      if (evt.target === cy) setSelectedNode(null)
    })

    cyRef.current = cy
    return () => cy.destroy()
  }, [])

  // Filter nodes by type
  useEffect(() => {
    if (!cyRef.current) return
    cyRef.current.nodes().forEach((node) => {
      const type = node.data('type') as NodeType
      if (activeTypes.has(type)) {
        node.style('display', 'element')
      } else {
        node.style('display', 'none')
      }
    })
  }, [activeTypes])

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Graph canvas */}
      <div className="flex-1 relative bg-gray-950">
        <div ref={containerRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-800 rounded-xl p-3 text-xs space-y-1.5">
          {(Object.entries(NODE_COLORS) as [NodeType, string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
              <span className="text-gray-400">{type}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-700">
            <span className="w-3 h-3 rounded-full inline-block border-2 border-amber-400 bg-transparent" />
            <span className="text-amber-400">Suspicious</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-72 border-l border-gray-800 bg-gray-900 flex flex-col">
        <GraphControls activeTypes={activeTypes} onToggle={(t) => {
          setActiveTypes((prev) => {
            const next = new Set(prev)
            if (next.has(t)) next.delete(t)
            else next.add(t)
            return next
          })
        }} />

        {/* Node detail */}
        {selectedNode ? (
          <div className="p-4 border-t border-gray-800 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white mb-1 break-all">{selectedNode.label}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: NODE_COLORS[selectedNode.type as NodeType] + '33', color: NODE_COLORS[selectedNode.type as NodeType] }}
            >
              {selectedNode.type}
            </span>
            <div className="mt-4 space-y-2">
              {Object.entries(selectedNode.attributes).map(([k, v]) => (
                <div key={k} className="text-xs">
                  <span className="text-gray-500">{k}: </span>
                  <span className="text-gray-300 font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm p-4 text-center">
            Click a node to see its details
          </div>
        )}
      </div>
    </div>
  )
}
