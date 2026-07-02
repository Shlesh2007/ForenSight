import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Cpu, Key, Palette, Database, Save, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../components/ui/Toast'

export default function AppSettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'llm' | 'api' | 'appearance' | 'storage'>('llm')

  // LLM config
  const [llm, setLlm] = useState({
    provider: 'gemini',
    geminiKey: 'AIza••••••••••••••••••••••••••••',
    claudeKey: '',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.1:8b',
    maxTokens: 8192,
    temperature: 0.2,
  })
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showClaudeKey, setShowClaudeKey] = useState(false)

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: 'navy',
    sidebarWidth: 'normal',
    fontSize: 'medium',
  })

  // Storage
  const [storage, setStorage] = useState({
    evidenceStorePath: 'D:\\ForenSight\\evidence',
    maxUploadSizeMb: 4096,
    autoHashAlgorithm: 'sha256',
    retentionDays: 365,
  })

  function handleSave() {
    showToast('Settings saved successfully.', 'success')
  }

  const tabs = [
    { id: 'llm' as const,        label: 'LLM / AI',    icon: <Cpu className="w-4 h-4" /> },
    { id: 'api' as const,        label: 'API Keys',     icon: <Key className="w-4 h-4" /> },
    { id: 'appearance' as const, label: 'Appearance',   icon: <Palette className="w-4 h-4" /> },
    { id: 'storage' as const,    label: 'Storage',      icon: <Database className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShieldCheck className="text-navy-400 w-5 h-5" />
          <span className="font-bold text-white text-sm">ForenSight AI</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm">App Settings</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Application Settings</h1>
        <p className="text-gray-400 text-sm mb-6 md:mb-8">Global configuration — applies to all cases.</p>

        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-1 border-b border-gray-800 mb-6 md:mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'border-navy-400 text-navy-300' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── LLM / AI ── */}
        {activeTab === 'llm' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">LLM Provider</h2>

              {/* Provider selector */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Active Provider</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'gemini', label: 'Gemini Flash', badge: 'Recommended' },
                    { id: 'claude', label: 'Claude Haiku', badge: '' },
                    { id: 'ollama', label: 'Ollama (Local)', badge: 'No API cost' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setLlm({ ...llm, provider: p.id })}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                        llm.provider === p.id
                          ? 'bg-navy-700/60 border-navy-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                      {p.badge && (
                        <span className="ml-2 text-[10px] bg-navy-900/60 text-navy-300 border border-navy-700/40 px-1.5 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini config */}
              {llm.provider === 'gemini' && (
                <div className="space-y-3 pl-1 border-l-2 border-navy-700/40">
                  <p className="text-xs text-gray-500 pl-3">Gemini 1.5 Flash via Google AI Studio</p>
                  <div className="pl-3">
                    <label className="block text-sm text-gray-400 mb-1.5">API Key</label>
                    <div className="relative">
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        value={llm.geminiKey}
                        onChange={(e) => setLlm({ ...llm, geminiKey: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 pr-10 text-white text-sm font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => setShowGeminiKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Claude config */}
              {llm.provider === 'claude' && (
                <div className="space-y-3 pl-1 border-l-2 border-navy-700/40">
                  <p className="text-xs text-gray-500 pl-3">Claude Haiku via Anthropic API</p>
                  <div className="pl-3">
                    <label className="block text-sm text-gray-400 mb-1.5">API Key</label>
                    <div className="relative">
                      <input
                        type={showClaudeKey ? 'text' : 'password'}
                        value={llm.claudeKey}
                        onChange={(e) => setLlm({ ...llm, claudeKey: e.target.value })}
                        placeholder="sk-ant-••••••••••••••••••••••••••••••••••"
                        className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 pr-10 text-white text-sm font-mono placeholder-gray-600 focus:outline-none"
                      />
                      <button
                        onClick={() => setShowClaudeKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ollama config */}
              {llm.provider === 'ollama' && (
                <div className="space-y-3 pl-1 border-l-2 border-navy-700/40">
                  <p className="text-xs text-gray-500 pl-3">Local LLM via Ollama — no API cost, requires GPU or fast CPU</p>
                  <div className="pl-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Ollama URL</label>
                      <input
                        type="text"
                        value={llm.ollamaUrl}
                        onChange={(e) => setLlm({ ...llm, ollamaUrl: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Model</label>
                      <select
                        value={llm.ollamaModel}
                        onChange={(e) => setLlm({ ...llm, ollamaModel: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                      >
                        <option value="llama3.1:8b">llama3.1:8b</option>
                        <option value="llama3.1:70b">llama3.1:70b</option>
                        <option value="mistral:7b">mistral:7b</option>
                        <option value="gemma2:9b">gemma2:9b</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Common params */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Max Tokens</label>
                  <input
                    type="number"
                    value={llm.maxTokens}
                    onChange={(e) => setLlm({ ...llm, maxTokens: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Temperature <span className="text-gray-600">({llm.temperature})</span>
                  </label>
                  <input
                    type="range"
                    min={0} max={1} step={0.05}
                    value={llm.temperature}
                    onChange={(e) => setLlm({ ...llm, temperature: parseFloat(e.target.value) })}
                    className="w-full mt-2 accent-navy-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>Precise</span><span>Creative</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Save LLM Settings
            </button>
          </div>
        )}

        {/* ── API Keys ── */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">External API Keys</h2>
              <p className="text-sm text-gray-500">Keys are stored locally and never sent to any server other than their respective providers.</p>

              {[
                { label: 'VirusTotal API Key', placeholder: 'vtotal-••••••••••••••••••••••••••••••', hint: 'Used for file hash lookups against malware databases' },
                { label: 'Shodan API Key', placeholder: 'shodan-••••••••••••••••••••••••••••••', hint: 'Used for IP reputation and open port lookups' },
                { label: 'AbuseIPDB API Key', placeholder: 'abuseipdb-••••••••••••••••••••••••••', hint: 'Used for IP abuse confidence scoring' },
              ].map((k) => (
                <div key={k.label}>
                  <label className="block text-sm text-gray-400 mb-1">{k.label}</label>
                  <input
                    type="password"
                    placeholder={k.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder-gray-600 focus:outline-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">{k.hint}</p>
                </div>
              ))}
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Save API Keys
            </button>
          </div>
        )}

        {/* ── Appearance ── */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">Appearance</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Theme</label>
                <div className="flex gap-2">
                  {['dark', 'darker', 'light'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAppearance({ ...appearance, theme: t })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                        appearance.theme === t
                          ? 'bg-navy-700/60 border-navy-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {appearance.theme === 'light' && (
                  <p className="text-xs text-amber-400 mt-2">⚠ Light theme is not yet implemented — coming in v0.2.</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
                <div className="flex gap-2">
                  {[
                    { id: 'navy', color: 'bg-blue-800', label: 'Navy' },
                    { id: 'teal', color: 'bg-teal-600', label: 'Teal' },
                    { id: 'violet', color: 'bg-violet-600', label: 'Violet' },
                    { id: 'emerald', color: 'bg-emerald-600', label: 'Emerald' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAppearance({ ...appearance, accentColor: c.id })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                        appearance.accentColor === c.id
                          ? 'border-white/40 text-white bg-gray-800'
                          : 'border-gray-700 text-gray-400 bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${c.color}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Font Size</label>
                  <select
                    value={appearance.fontSize}
                    onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium (default)</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Sidebar Width</label>
                  <select
                    value={appearance.sidebarWidth}
                    onChange={(e) => setAppearance({ ...appearance, sidebarWidth: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal (default)</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Save Appearance
            </button>
          </div>
        )}

        {/* ── Storage ── */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">Evidence Storage</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Evidence Store Path</label>
                <input
                  type="text"
                  value={storage.evidenceStorePath}
                  onChange={(e) => setStorage({ ...storage, evidenceStorePath: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Local filesystem path where raw evidence files are stored (write-once).</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Max Upload Size (MB)</label>
                  <input
                    type="number"
                    value={storage.maxUploadSizeMb}
                    onChange={(e) => setStorage({ ...storage, maxUploadSizeMb: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Retention Period (days)</label>
                  <input
                    type="number"
                    value={storage.retentionDays}
                    onChange={(e) => setStorage({ ...storage, retentionDays: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Hash Algorithm</label>
                <div className="flex gap-2">
                  {['sha256', 'sha512', 'md5'].map((h) => (
                    <button
                      key={h}
                      onClick={() => setStorage({ ...storage, autoHashAlgorithm: h })}
                      className={`px-4 py-2 rounded-lg text-sm font-mono border transition-colors ${
                        storage.autoHashAlgorithm === h
                          ? 'bg-navy-700/60 border-navy-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {h.toUpperCase()}
                    </button>
                  ))}
                </div>
                {storage.autoHashAlgorithm === 'md5' && (
                  <p className="text-xs text-amber-400 mt-2">⚠ MD5 is not recommended for forensic use — collision vulnerabilities.</p>
                )}
              </div>

              {/* Disk usage mock */}
              <div className="bg-gray-800/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Evidence Store Usage</span>
                  <span className="text-sm text-white font-medium">1.6 GB / 500 GB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-navy-600 h-2 rounded-full" style={{ width: '0.32%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">3 artefacts stored across 2 cases</p>
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Save Storage Settings
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
