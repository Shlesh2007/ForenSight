export type ArtefactType = 'disk' | 'memory' | 'network' | 'mobile' | 'cloud'

export interface Artefact {
  id: string
  name: string
  type: ArtefactType
  size_bytes: number
  sha256: string
  uploaded_at: string
  status: 'pending' | 'parsing' | 'done' | 'error'
}

export interface CaseSummary {
  id: string
  name: string
  description: string
  created_at: string
  artefact_count: number
  entity_count: number
  event_count: number
  suspicious_count: number
}

export interface CaseDetail extends CaseSummary {
  artefacts: Artefact[]
}

export interface KeyIndicators {
  total_files: number
  total_processes: number
  total_network_endpoints: number
  suspicious_processes: number
  persistence_mechanisms: number
  events_per_hour: { hour: string; count: number }[]
}
