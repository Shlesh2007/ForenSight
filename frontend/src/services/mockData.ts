import type { CaseSummary, CaseDetail, KeyIndicators } from '../types/case'
import type { GraphData } from '../types/graph'
import type { Message } from '../types/copilot'

export const mockCases: CaseSummary[] = [
  {
    id: 'case-001',
    name: 'NIST Hacking Case',
    description: 'Classic NIST instructional disk image — unauthorised access investigation.',
    created_at: '2024-03-10T09:00:00Z',
    artefact_count: 2,
    entity_count: 847,
    event_count: 4213,
    suspicious_count: 5,
  },
  {
    id: 'case-002',
    name: 'Ransomware Analysis',
    description: 'Memory dump and PCAP from a ransomware-infected workstation.',
    created_at: '2024-04-02T14:30:00Z',
    artefact_count: 3,
    entity_count: 1203,
    event_count: 8741,
    suspicious_count: 12,
  },
  {
    id: 'case-003',
    name: 'Insider Threat — HR Leak',
    description: 'Disk image of a laptop suspected of exfiltrating HR records.',
    created_at: '2024-05-15T11:00:00Z',
    artefact_count: 1,
    entity_count: 312,
    event_count: 1540,
    suspicious_count: 3,
  },
]

export const mockCaseDetail: CaseDetail = {
  ...mockCases[0],
  artefacts: [
    {
      id: 'art-001',
      name: 'hacking_case.E01',
      type: 'disk',
      size_bytes: 536870912,
      sha256: 'a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      uploaded_at: '2024-03-10T09:05:00Z',
      status: 'done',
    },
    {
      id: 'art-002',
      name: 'memory.dmp',
      type: 'memory',
      size_bytes: 1073741824,
      sha256: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
      uploaded_at: '2024-03-10T09:10:00Z',
      status: 'done',
    },
  ],
}

export const mockIndicators: KeyIndicators = {
  total_files: 847,
  total_processes: 23,
  total_network_endpoints: 14,
  suspicious_processes: 5,
  persistence_mechanisms: 2,
  events_per_hour: [
    { hour: '08:00', count: 12 },
    { hour: '09:00', count: 45 },
    { hour: '10:00', count: 210 },
    { hour: '11:00', count: 380 },
    { hour: '12:00', count: 95 },
    { hour: '13:00', count: 430 },
    { hour: '14:00', count: 612 },
    { hour: '15:00', count: 480 },
    { hour: '16:00', count: 290 },
    { hour: '17:00', count: 130 },
    { hour: '18:00', count: 40 },
  ],
}

export const mockGraph: GraphData = {
  nodes: [
    { id: 'p1', label: 'WINWORD.EXE', type: 'Process', attributes: { pid: 2340 } },
    { id: 'p2', label: 'cmd.exe', type: 'Process', attributes: { pid: 3120 }, suspicious: true },
    { id: 'p3', label: 'powershell.exe', type: 'Process', attributes: { pid: 4821 }, suspicious: true },
    { id: 'p4', label: 'curl.exe', type: 'Process', attributes: { pid: 5210 } },
    { id: 'f1', label: 'C:\\Users\\Admin\\update.exe', type: 'File', attributes: { size: 204800 }, suspicious: true },
    { id: 'f2', label: 'HKLM\\...\\Run\\Updater', type: 'File', attributes: {}, suspicious: true },
    { id: 'n1', label: '192.168.1.50', type: 'NetworkEndpoint', attributes: { port: 443 } },
    { id: 'u1', label: 'Administrator', type: 'User', attributes: {} },
    { id: 'h1', label: 'DESKTOP-XF3K2P', type: 'Host', attributes: {} },
  ],
  edges: [
    { id: 'e1', source: 'p1', target: 'p2', type: 'PARENT_OF', timestamp: '2024-03-10T14:01:00Z' },
    { id: 'e2', source: 'p2', target: 'p3', type: 'PARENT_OF', timestamp: '2024-03-10T14:01:05Z' },
    { id: 'e3', source: 'p3', target: 'p4', type: 'PARENT_OF', timestamp: '2024-03-10T14:01:10Z' },
    { id: 'e4', source: 'p3', target: 'n1', type: 'CONNECTED_TO', timestamp: '2024-03-10T14:01:08Z', confidence: 0.95 },
    { id: 'e5', source: 'p4', target: 'f1', type: 'ACCESSED', timestamp: '2024-03-10T14:01:15Z' },
    { id: 'e6', source: 'f1', target: 'f2', type: 'MODIFIED', timestamp: '2024-03-10T14:01:20Z' },
    { id: 'e7', source: 'u1', target: 'h1', type: 'AUTHENTICATED_AS', timestamp: '2024-03-10T08:30:00Z' },
    { id: 'e8', source: 'p1', target: 'u1', type: 'EXECUTED', timestamp: '2024-03-10T13:59:00Z' },
  ],
}

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I\'m ForenSight. Ask me anything about this investigation.',
    timestamp: new Date().toISOString(),
  },
]
