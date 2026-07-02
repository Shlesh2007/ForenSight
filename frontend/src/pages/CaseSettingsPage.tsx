import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Settings, Save, Trash2, Shield, X, AlertTriangle } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import { mockAuditLog, type AuditLogEntry } from '../services/mockData'
import { useToast } from '../components/ui/Toast'
import { mockCaseDetail } from '../services/mockData'

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ConfirmDeleteModal({
  caseName,
  onConfirm,
  onCancel,
}: {
  caseName: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const [input, setInput] = useState('')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-red-800/50 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Delete Case</h2>
            <p className="text-sm text-gray-400">
              This will permanently delete the case and all associated artefacts, events, and reports.
              This action cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white ml-auto flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-1.5">
            Type <span className="text-white font-mono">{caseName}</span> to confirm
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
            placeholder={caseName}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== caseName}
            className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Delete Case
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CaseSettingsPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const { showToast } = useToast()
  const caseData = mockCaseDetail

  const [name, setName] = useState(caseData.name)
  const [description, setDescription] = useState(caseData.description)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [auditLog] = useState<AuditLogEntry[]>(mockAuditLog)

  function handleSave() {
    showToast('Case information saved successfully.', 'success')
  }

  function handleDelete() {
    setShowDeleteModal(false)
    showToast('Case deleted (mock — no data was actually deleted).', 'info')
  }

  return (
    <AppShell caseId={caseId!} activePage="settings">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-navy-400" />
          Case Settings
        </h1>

        {/* Case Information */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Case Information</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Case Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </section>

        {/* Chain of Custody */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-navy-400" />
            Chain of Custody Log
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Timestamp</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Hash</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry, i) => (
                  <tr key={entry.id} className={`border-b border-gray-800/60 hover:bg-gray-800/20 transition-colors ${i % 2 ? 'bg-gray-900/40' : ''}`}>
                    <td className="px-4 py-3 text-white font-medium">{entry.actor}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{entry.action}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap hidden sm:table-cell">{formatTs(entry.timestamp)}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs truncate max-w-[120px] hidden md:table-cell">{entry.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-950/20 border border-red-800/40 rounded-xl p-6">
          <h2 className="text-base font-semibold text-red-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Permanently delete this case and all its data. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/60 border border-red-800/50 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Case
          </button>
        </section>
      </div>

      {showDeleteModal && (
        <ConfirmDeleteModal
          caseName={name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </AppShell>
  )
}
