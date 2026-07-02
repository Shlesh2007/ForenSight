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

// ── Extended mock data ────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string
  timestamp: string
  eventType: string
  source: string
  relation: string
  target: string
  confidence: number
  artefact: string
}

export const mockTimelineEvents: TimelineEvent[] = [
  { id: 'tl-001', timestamp: '2024-03-10T08:30:00Z', eventType: 'AUTH', source: 'Administrator', relation: 'AUTHENTICATED_AS', target: 'DESKTOP-XF3K2P', confidence: 0.99, artefact: 'hacking_case.E01' },
  { id: 'tl-002', timestamp: '2024-03-10T08:45:12Z', eventType: 'FILE_ACCESS', source: 'explorer.exe', relation: 'ACCESSED', target: 'C:\\Users\\Admin\\Documents', confidence: 0.97, artefact: 'hacking_case.E01' },
  { id: 'tl-003', timestamp: '2024-03-10T09:10:44Z', eventType: 'PROCESS_CREATE', source: 'svchost.exe', relation: 'PARENT_OF', target: 'cmd.exe', confidence: 0.91, artefact: 'memory.dmp' },
  { id: 'tl-004', timestamp: '2024-03-10T09:22:30Z', eventType: 'NETWORK', source: 'chrome.exe', relation: 'CONNECTED_TO', target: '8.8.8.8:443', confidence: 0.88, artefact: 'memory.dmp' },
  { id: 'tl-005', timestamp: '2024-03-10T10:01:05Z', eventType: 'FILE_WRITE', source: 'cmd.exe', relation: 'MODIFIED', target: 'C:\\Windows\\Temp\\payload.tmp', confidence: 0.93, artefact: 'hacking_case.E01' },
  { id: 'tl-006', timestamp: '2024-03-10T10:15:20Z', eventType: 'REGISTRY', source: 'reg.exe', relation: 'MODIFIED', target: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', confidence: 0.96, artefact: 'hacking_case.E01' },
  { id: 'tl-007', timestamp: '2024-03-10T10:30:00Z', eventType: 'PROCESS_CREATE', source: 'WINWORD.EXE', relation: 'PARENT_OF', target: 'cmd.exe', confidence: 0.99, artefact: 'memory.dmp' },
  { id: 'tl-008', timestamp: '2024-03-10T10:31:05Z', eventType: 'PROCESS_CREATE', source: 'cmd.exe', relation: 'PARENT_OF', target: 'powershell.exe', confidence: 0.99, artefact: 'memory.dmp' },
  { id: 'tl-009', timestamp: '2024-03-10T10:31:10Z', eventType: 'PROCESS_CREATE', source: 'powershell.exe', relation: 'PARENT_OF', target: 'curl.exe', confidence: 0.97, artefact: 'memory.dmp' },
  { id: 'tl-010', timestamp: '2024-03-10T10:32:11Z', eventType: 'NETWORK', source: 'powershell.exe', relation: 'CONNECTED_TO', target: '192.168.1.50:443', confidence: 0.95, artefact: 'memory.dmp' },
  { id: 'tl-011', timestamp: '2024-03-10T10:32:15Z', eventType: 'FILE_ACCESS', source: 'curl.exe', relation: 'ACCESSED', target: 'C:\\Users\\Admin\\update.exe', confidence: 0.94, artefact: 'memory.dmp' },
  { id: 'tl-012', timestamp: '2024-03-10T10:32:20Z', eventType: 'FILE_WRITE', source: 'update.exe', relation: 'MODIFIED', target: 'HKLM\\...\\Run\\Updater', confidence: 0.92, artefact: 'hacking_case.E01' },
  { id: 'tl-013', timestamp: '2024-03-10T11:00:00Z', eventType: 'NETWORK', source: 'update.exe', relation: 'CONNECTED_TO', target: '10.0.0.5:8080', confidence: 0.87, artefact: 'memory.dmp' },
  { id: 'tl-014', timestamp: '2024-03-10T11:05:33Z', eventType: 'FILE_DELETE', source: 'powershell.exe', relation: 'DELETED', target: 'C:\\Windows\\Temp\\payload.tmp', confidence: 0.90, artefact: 'hacking_case.E01' },
  { id: 'tl-015', timestamp: '2024-03-10T11:20:48Z', eventType: 'AUTH', source: 'Administrator', relation: 'AUTHENTICATED_AS', target: '\\\\FILESERVER01', confidence: 0.85, artefact: 'hacking_case.E01' },
  { id: 'tl-016', timestamp: '2024-03-10T11:45:00Z', eventType: 'FILE_COPY', source: 'xcopy.exe', relation: 'ACCESSED', target: 'D:\\HR\\employees.xlsx', confidence: 0.98, artefact: 'hacking_case.E01' },
  { id: 'tl-017', timestamp: '2024-03-10T12:00:10Z', eventType: 'NETWORK', source: 'ftp.exe', relation: 'CONNECTED_TO', target: '203.0.113.42:21', confidence: 0.89, artefact: 'memory.dmp' },
  { id: 'tl-018', timestamp: '2024-03-10T12:10:05Z', eventType: 'PROCESS_CREATE', source: 'schtasks.exe', relation: 'PARENT_OF', target: 'update.exe', confidence: 0.88, artefact: 'memory.dmp' },
  { id: 'tl-019', timestamp: '2024-03-10T13:00:00Z', eventType: 'FILE_WRITE', source: 'notepad.exe', relation: 'MODIFIED', target: 'C:\\Users\\Admin\\Desktop\\notes.txt', confidence: 0.70, artefact: 'hacking_case.E01' },
  { id: 'tl-020', timestamp: '2024-03-10T13:30:00Z', eventType: 'REGISTRY', source: 'powershell.exe', relation: 'MODIFIED', target: 'HKCU\\Software\\Classes\\ms-settings\\shell\\open\\command', confidence: 0.93, artefact: 'hacking_case.E01' },
  { id: 'tl-021', timestamp: '2024-03-10T14:00:00Z', eventType: 'PROCESS_CREATE', source: 'eventvwr.exe', relation: 'PARENT_OF', target: 'cmd.exe', confidence: 0.94, artefact: 'memory.dmp' },
  { id: 'tl-022', timestamp: '2024-03-10T14:45:00Z', eventType: 'NETWORK', source: 'mshta.exe', relation: 'CONNECTED_TO', target: '198.51.100.7:80', confidence: 0.81, artefact: 'memory.dmp' },
  { id: 'tl-023', timestamp: '2024-03-10T15:00:00Z', eventType: 'FILE_ACCESS', source: 'wscript.exe', relation: 'ACCESSED', target: 'C:\\ProgramData\\dropper.vbs', confidence: 0.96, artefact: 'hacking_case.E01' },
  { id: 'tl-024', timestamp: '2024-03-10T15:30:22Z', eventType: 'AUTH', source: 'Guest', relation: 'AUTHENTICATED_AS', target: 'DESKTOP-XF3K2P', confidence: 0.72, artefact: 'hacking_case.E01' },
  { id: 'tl-025', timestamp: '2024-03-10T16:00:00Z', eventType: 'PROCESS_CREATE', source: 'wmic.exe', relation: 'PARENT_OF', target: 'mshta.exe', confidence: 0.88, artefact: 'memory.dmp' },
]

export interface ArtefactEvent {
  id: string
  eventType: string
  entity: string
  timestamp: string
  confidence: number
}

export const mockArtefactEvents: ArtefactEvent[] = [
  { id: 'ae-001', eventType: 'PROCESS_CREATE', entity: 'WINWORD.EXE (PID 2340)', timestamp: '2024-03-10T13:59:00Z', confidence: 0.99 },
  { id: 'ae-002', eventType: 'PROCESS_CREATE', entity: 'cmd.exe (PID 3120)', timestamp: '2024-03-10T14:01:00Z', confidence: 0.99 },
  { id: 'ae-003', eventType: 'PROCESS_CREATE', entity: 'powershell.exe (PID 4821)', timestamp: '2024-03-10T14:01:05Z', confidence: 0.98 },
  { id: 'ae-004', eventType: 'PROCESS_CREATE', entity: 'curl.exe (PID 5210)', timestamp: '2024-03-10T14:01:10Z', confidence: 0.97 },
  { id: 'ae-005', eventType: 'NETWORK', entity: '192.168.1.50:443', timestamp: '2024-03-10T14:01:08Z', confidence: 0.95 },
  { id: 'ae-006', eventType: 'FILE_ACCESS', entity: 'C:\\Users\\Admin\\update.exe', timestamp: '2024-03-10T14:01:15Z', confidence: 0.94 },
  { id: 'ae-007', eventType: 'FILE_WRITE', entity: 'HKLM\\...\\Run\\Updater', timestamp: '2024-03-10T14:01:20Z', confidence: 0.92 },
  { id: 'ae-008', eventType: 'REGISTRY', entity: 'HKCU\\Software\\Classes\\ms-settings', timestamp: '2024-03-10T14:05:00Z', confidence: 0.93 },
  { id: 'ae-009', eventType: 'FILE_DELETE', entity: 'C:\\Windows\\Temp\\payload.tmp', timestamp: '2024-03-10T11:05:33Z', confidence: 0.90 },
  { id: 'ae-010', eventType: 'NETWORK', entity: '10.0.0.5:8080', timestamp: '2024-03-10T11:00:00Z', confidence: 0.87 },
  { id: 'ae-011', eventType: 'AUTH', entity: 'Administrator → DESKTOP-XF3K2P', timestamp: '2024-03-10T08:30:00Z', confidence: 0.99 },
  { id: 'ae-012', eventType: 'FILE_ACCESS', entity: 'D:\\HR\\employees.xlsx', timestamp: '2024-03-10T11:45:00Z', confidence: 0.98 },
  { id: 'ae-013', eventType: 'NETWORK', entity: '203.0.113.42:21', timestamp: '2024-03-10T12:00:10Z', confidence: 0.89 },
  { id: 'ae-014', eventType: 'PROCESS_CREATE', entity: 'schtasks.exe (PID 6100)', timestamp: '2024-03-10T12:10:05Z', confidence: 0.88 },
  { id: 'ae-015', eventType: 'FILE_COPY', entity: 'xcopy.exe → D:\\HR\\employees.xlsx', timestamp: '2024-03-10T11:45:05Z', confidence: 0.96 },
  { id: 'ae-016', eventType: 'REGISTRY', entity: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', timestamp: '2024-03-10T10:15:20Z', confidence: 0.96 },
  { id: 'ae-017', eventType: 'PROCESS_CREATE', entity: 'eventvwr.exe (PID 7200)', timestamp: '2024-03-10T14:00:00Z', confidence: 0.94 },
  { id: 'ae-018', eventType: 'NETWORK', entity: '198.51.100.7:80', timestamp: '2024-03-10T14:45:00Z', confidence: 0.81 },
  { id: 'ae-019', eventType: 'FILE_ACCESS', entity: 'C:\\ProgramData\\dropper.vbs', timestamp: '2024-03-10T15:00:00Z', confidence: 0.96 },
  { id: 'ae-020', eventType: 'PROCESS_CREATE', entity: 'wmic.exe (PID 8800)', timestamp: '2024-03-10T16:00:00Z', confidence: 0.88 },
]

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  timestamp: string
  hash: string
}

export const mockAuditLog: AuditLogEntry[] = [
  { id: 'al-001', actor: 'S. Darji', action: 'Case created', timestamp: '2024-03-10T09:00:00Z', hash: 'sha256:a3f9b2c1d4e5f6a7' },
  { id: 'al-002', actor: 'S. Darji', action: 'Uploaded artefact: hacking_case.E01', timestamp: '2024-03-10T09:05:00Z', hash: 'sha256:b4c5d6e7f8a9b0c1' },
  { id: 'al-003', actor: 'S. Darji', action: 'Uploaded artefact: memory.dmp', timestamp: '2024-03-10T09:10:00Z', hash: 'sha256:c5d6e7f8a9b0c1d2' },
  { id: 'al-004', actor: 'System', action: 'Artefact parsing completed: hacking_case.E01', timestamp: '2024-03-10T10:30:00Z', hash: 'sha256:d6e7f8a9b0c1d2e3' },
  { id: 'al-005', actor: 'System', action: 'Artefact parsing completed: memory.dmp', timestamp: '2024-03-10T11:45:00Z', hash: 'sha256:e7f8a9b0c1d2e3f4' },
  { id: 'al-006', actor: 'S. Darji', action: 'Generated PDF report: Initial Findings', timestamp: '2024-03-10T14:00:00Z', hash: 'sha256:f8a9b0c1d2e3f4a5' },
]

export interface ReportEntry {
  id: string
  title: string
  createdAt: string
  format: 'PDF' | 'Word' | 'Markdown'
  size: string
}

export const mockReports: ReportEntry[] = [
  { id: 'rpt-001', title: 'Initial Findings — NIST Hacking Case', createdAt: '2024-03-10T14:00:00Z', format: 'PDF', size: '1.2 MB' },
  { id: 'rpt-002', title: 'Timeline Analysis', createdAt: '2024-03-11T09:30:00Z', format: 'Markdown', size: '48 KB' },
  { id: 'rpt-003', title: 'Full Forensic Report', createdAt: '2024-03-12T16:00:00Z', format: 'Word', size: '3.4 MB' },
]
