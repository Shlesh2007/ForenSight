import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { LayoutDashboard, Share2, MessageSquare } from 'lucide-react'
import CaseDashboard from '../components/dashboard/CaseDashboard'
import GraphExplorer from '../components/graph/GraphExplorer'
import ChatPanel from '../components/chat/ChatPanel'
import EntityDrawer from '../components/entities/EntityDrawer'
import AppShell from '../components/layout/AppShell'
import { mockCaseDetail } from '../services/mockData'
import type { GraphNode } from '../types/graph'

type Tab = 'dashboard' | 'graph' | 'chat'

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(tabParam ?? 'dashboard')
  const [selectedEntity, setSelectedEntity] = useState<GraphNode | null>(null)

  // Sync tab when URL query param changes (e.g. sidebar navigation)
  useEffect(() => {
    if (tabParam && ['dashboard', 'graph', 'chat'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const caseData = mockCaseDetail

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard',      icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'graph',     label: 'Graph Explorer', icon: <Share2 className="w-4 h-4" /> },
    { id: 'chat',      label: 'Copilot Chat',   icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <AppShell caseId={caseId!} activePage={activeTab}>
      {/* Sub-tab bar — horizontally scrollable on mobile */}
      <div className="border-b border-gray-800 bg-gray-900/40 px-4 md:px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap h-10 ${
                activeTab === t.id
                  ? 'border-navy-400 text-navy-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.icon}
              {/* Hide label text on mobile, show on sm+ */}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && <CaseDashboard caseId={caseId!} />}
        {activeTab === 'graph' && (
          <GraphExplorerWithDrawer
            caseId={caseId!}
            onNodeSelect={setSelectedEntity}
          />
        )}
        {activeTab === 'chat' && <ChatPanel caseId={caseId!} />}
      </div>

      {/* Entity drawer — slides in from right */}
      <EntityDrawer entity={selectedEntity} onClose={() => setSelectedEntity(null)} />
    </AppShell>
  )
}

// Wrapper that intercepts GraphExplorer node clicks to open the EntityDrawer
import cytoscape from 'cytoscape'
import { mockGraph } from '../services/mockData'
import GraphControls from '../components/graph/GraphControls'
import type { NodeType } from '../types/graph'

const NODE_COLORS: Record<NodeType, string> = {
  Process:         '#7c3aed',
  File:            '#2563eb',
  User:            '#059669',
  Host:            '#0891b2',
  NetworkEndpoint: '#d97706',
  Artefact:        '#4b5563',
}

function GraphExplorerWithDrawer({
  caseId,
  onNodeSelect,
}: {
  caseId: string
  onNodeSelect: (node: GraphNode) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
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
            'background-color': (ele: cytoscape.NodeSingular) =>
              NODE_COLORS[ele.data('type') as NodeType] ?? '#4b5563',
            'border-width': (ele: cytoscape.NodeSingular) => (ele.data('suspicious') ? 3 : 1),
            'border-color': (ele: cytoscape.NodeSingular) =>
              ele.data('suspicious') ? '#f59e0b' : '#374151',
            label: 'data(label)',
            color: '#e5e7eb',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            width: 36,
            height: 36,
          },
        },
        {
          selector: 'node:selected',
          style: { 'border-color': '#60a5fa', 'border-width': 3 },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#374151',
            'target-arrow-color': '#374151',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': '8px',
            color: '#6b7280',
            'text-rotation': 'autorotate',
            'text-margin-y': -6,
          },
        },
        {
          selector: 'edge:selected',
          style: { 'line-color': '#60a5fa', 'target-arrow-color': '#60a5fa' },
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
      const graphNode = graphData.nodes.find((n) => n.id === node.data('id'))
      if (graphNode) {
        onNodeSelect(graphNode)
      }
    })

    cyRef.current = cy
    return () => cy.destroy()
  }, [])

  useEffect(() => {
    if (!cyRef.current) return
    cyRef.current.nodes().forEach((node) => {
      const type = node.data('type') as NodeType
      node.style('display', activeTypes.has(type) ? 'element' : 'none')
    })
  }, [activeTypes])

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <div className="flex-1 relative bg-gray-950">
        <div ref={containerRef} className="w-full h-full" />
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
      <div className="w-64 border-l border-gray-800 bg-gray-900 flex flex-col">
        <GraphControls
          activeTypes={activeTypes}
          onToggle={(t) => {
            setActiveTypes((prev) => {
              const next = new Set(prev)
              if (next.has(t)) next.delete(t)
              else next.add(t)
              return next
            })
          }}
        />
        <div className="flex-1 flex items-center justify-center text-gray-600 text-sm p-4 text-center">
          Click a node to open the Entity Drawer
        </div>
      </div>
    </div>
  )
}
