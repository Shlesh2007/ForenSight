export type NodeType = 'File' | 'Process' | 'User' | 'Host' | 'NetworkEndpoint' | 'Artefact'

export type RelationType =
  | 'EXECUTED'
  | 'PARENT_OF'
  | 'ACCESSED'
  | 'MODIFIED'
  | 'DELETED'
  | 'CONNECTED_TO'
  | 'RESOLVES_TO'
  | 'AUTHENTICATED_AS'
  | 'EXTRACTED_FROM'
  | 'DERIVED_BY'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  attributes: Record<string, unknown>
  suspicious?: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: RelationType
  timestamp?: string
  confidence?: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
