import KeyIndicators from './KeyIndicators'
import { mockCaseDetail } from '../../services/mockData'
import { HardDrive, Cpu, Wifi, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Artefact } from '../../types/case'

interface Props {
  caseId: string
}

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Key indicators */}
      <KeyIndicators caseId={caseId} />

      {/* Artefacts table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Evidence Artefacts</h2>
          <label className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Upload
            <input type="file" className="hidden" />
          </label>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
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
                  className={`border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-gray-900/40'
                  }`}
                >
                  <td className="px-5 py-3">{artefactIcon(a.type)}</td>
                  <td className="px-5 py-3 text-white font-medium">{a.name}</td>
                  <td className="px-5 py-3 text-gray-400">{formatBytes(a.size_bytes)}</td>
                  <td className="px-5 py-3 font-mono text-gray-500 text-xs truncate max-w-[200px]">
                    {a.sha256.slice(0, 16)}…
                  </td>
                  <td className="px-5 py-3">{statusBadge(a.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
