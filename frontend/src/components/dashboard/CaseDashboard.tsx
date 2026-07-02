import { useNavigate } from 'react-router-dom'
import KeyIndicators from './KeyIndicators'
import { mockCaseDetail } from '../../services/mockData'
import { HardDrive, Cpu, Wifi, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Artefact } from '../../types/case'
import UploadDropzone from '../upload/UploadDropzone'
import { useToast } from '../ui/Toast'

interface Props { caseId: string }

function artefactIcon(type: Artefact['type']) {
  switch (type) {
    case 'disk':    return <HardDrive className="w-4 h-4 text-blue-400" />
    case 'memory':  return <Cpu className="w-4 h-4 text-purple-400" />
    case 'network': return <Wifi className="w-4 h-4 text-green-400" />
    default:        return <HardDrive className="w-4 h-4 text-gray-400" />
  }
}

function statusBadge(status: Artefact['status']) {
  const map = {
    done:    { icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'text-green-400' },
    parsing: { icon: <Clock className="w-3.5 h-3.5 animate-spin" />, cls: 'text-amber-400' },
    pending: { icon: <Clock className="w-3.5 h-3.5" />, cls: 'text-gray-400' },
    error:   { icon: <AlertCircle className="w-3.5 h-3.5" />, cls: 'text-red-400' },
  }
  const { icon, cls } = map[status]
  return <span className={`flex items-center gap-1 ${cls} text-xs font-medium capitalize`}>{icon}{status}</span>
}

function formatBytes(b: number) {
  if (b >= 1073741824) return `${(b / 1073741824).toFixed(1)} GB`
  if (b >= 1048576) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1024).toFixed(1)} KB`
}

export default function CaseDashboard({ caseId }: Props) {
  const caseData = mockCaseDetail
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
      <KeyIndicators caseId={caseId} />

      <section>
        <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Upload New Artefact</h2>
        <UploadDropzone caseId={caseId} onUploadComplete={() => showToast('Artefact uploaded and queued for parsing.', 'success')} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-semibold text-white">Evidence Artefacts</h2>
          <span className="text-xs text-gray-500">{caseData.artefacts.length} files</span>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {caseData.artefacts.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/cases/${caseId}/artefacts/${a.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-navy-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{artefactIcon(a.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{a.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 font-mono truncate">{a.sha256.slice(0, 20)}…</p>
                </div>
                <div className="flex-shrink-0">{statusBadge(a.status)}</div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span>{formatBytes(a.size_bytes)}</span>
                <span>·</span>
                <span className="capitalize">{a.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Filename</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">SHA-256</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {caseData.artefacts.map((a, i) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/cases/${caseId}/artefacts/${a.id}`)}
                    className={`border-b border-gray-800/60 hover:bg-gray-800/40 cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/40'}`}
                  >
                    <td className="px-5 py-3">{artefactIcon(a.type)}</td>
                    <td className="px-5 py-3 text-white font-medium">{a.name}</td>
                    <td className="px-5 py-3 text-gray-400">{formatBytes(a.size_bytes)}</td>
                    <td className="px-5 py-3 font-mono text-gray-500 text-xs">{a.sha256.slice(0, 16)}…</td>
                    <td className="px-5 py-3">{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
