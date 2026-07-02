import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, Download, Plus, Check } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import { mockReports, type ReportEntry } from '../services/mockData'

const SECTIONS = [
  { id: 'executive', label: 'Executive Summary' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'entities', label: 'Entity List' },
  { id: 'processes', label: 'Suspicious Processes' },
  { id: 'network', label: 'Network Analysis' },
  { id: 'recommendations', label: 'Recommendations' },
]

type Format = 'PDF' | 'Word' | 'Markdown'
type GenerateState = 'idle' | 'generating' | 'done'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const FORMAT_BADGE: Record<Format, 'danger' | 'info' | 'default'> = {
  PDF:      'danger',
  Word:     'info',
  Markdown: 'default',
}

export default function ReportsPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [title, setTitle] = useState('')
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(SECTIONS.map((s) => s.id)))
  const [format, setFormat] = useState<Format>('PDF')
  const [genState, setGenState] = useState<GenerateState>('idle')
  const [genProgress, setGenProgress] = useState(0)
  const [reports, setReports] = useState<ReportEntry[]>(mockReports)

  function toggleSection(id: string) {
    setSelectedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleGenerate() {
    if (!title.trim()) return
    setGenState('generating')
    setGenProgress(0)
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 150))
      setGenProgress(p)
    }
    const newReport: ReportEntry = {
      id: `rpt-${Date.now()}`,
      title: title.trim(),
      createdAt: new Date().toISOString(),
      format,
      size: format === 'Markdown' ? '42 KB' : format === 'Word' ? '2.1 MB' : '1.8 MB',
    }
    setReports((prev) => [newReport, ...prev])
    setGenState('done')
  }

  function reset() {
    setGenState('idle')
    setTitle('')
    setGenProgress(0)
    setSelectedSections(new Set(SECTIONS.map((s) => s.id)))
  }

  return (
    <AppShell caseId={caseId!} activePage="reports">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-navy-400" />
          Reports
        </h1>

        {/* Generate section */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-navy-400" />
            Generate New Report
          </h2>

          {genState !== 'done' ? (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Report Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Incident Report — March 2024"
                  disabled={genState === 'generating'}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              {/* Sections */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Include Sections</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SECTIONS.map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-400 hover:text-white bg-gray-800/40 rounded-lg px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedSections.has(s.id)}
                        onChange={() => toggleSection(s.id)}
                        disabled={genState === 'generating'}
                        className="accent-navy-500"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Format</label>
                <div className="flex gap-2">
                  {(['PDF', 'Word', 'Markdown'] as Format[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      disabled={genState === 'generating'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        format === f
                          ? 'bg-navy-700 text-white border border-navy-600'
                          : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {genState === 'generating' && (
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Generating report…</span>
                    <span>{genProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-navy-600 h-2 rounded-full transition-all"
                      style={{ width: `${genProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!title.trim() || genState === 'generating'}
                className="bg-navy-700 hover:bg-navy-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {genState === 'generating' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate {format} Report
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 bg-green-950/30 border border-green-800/40 rounded-xl p-4">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Report generated: {title}</p>
                <p className="text-xs text-gray-400 mt-0.5">Ready to download</p>
              </div>
              <button
                onClick={() => alert('Download would start here in production.')}
                className="flex items-center gap-1.5 bg-green-800/40 hover:bg-green-700/40 text-green-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={reset}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                New report
              </button>
            </div>
          )}
        </section>

        {/* Previous reports */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4">Previous Reports</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="px-4 py-3 font-medium text-left">Title</th>
                    <th className="px-4 py-3 font-medium text-left hidden sm:table-cell">Created</th>
                    <th className="px-4 py-3 font-medium text-left">Format</th>
                    <th className="px-4 py-3 font-medium text-right">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={r.id} className={`border-b border-gray-800/60 hover:bg-gray-800/20 transition-colors ${i % 2 ? 'bg-gray-900/40' : ''}`}>
                      <td className="px-4 py-3 text-white font-medium">{r.title}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3"><Badge variant={FORMAT_BADGE[r.format as Format]}>{r.format}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => alert(`Downloading ${r.title}…`)}
                          className="inline-flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-300 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
