import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShieldCheck, User, Mail, Phone, Building,
  Lock, Eye, EyeOff, Save, Camera,
} from 'lucide-react'
import { useToast } from '../components/ui/Toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Profile info state
  const [profile, setProfile] = useState({
    fullName: 'Shlesh Darji',
    username: 'shlesh2007',
    email: 's.darji@forensight.ai',
    phone: '+91 98765 43210',
    organisation: 'ForenSight Lab',
    role: 'Investigator',
    bio: 'Digital forensics investigator specialising in memory analysis and network forensics.',
  })

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences'>('info')

  // Preferences state
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    autoSaveReports: true,
    defaultGraphLayout: 'cose',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
  })

  function handleSaveProfile() {
    showToast('Profile updated successfully.', 'success')
  }

  function handleChangePassword() {
    if (!passwords.current) {
      showToast('Please enter your current password.', 'error')
      return
    }
    if (passwords.newPass.length < 8) {
      showToast('New password must be at least 8 characters.', 'error')
      return
    }
    if (passwords.newPass !== passwords.confirm) {
      showToast('New passwords do not match.', 'error')
      return
    }
    setPasswords({ current: '', newPass: '', confirm: '' })
    showToast('Password changed successfully.', 'success')
  }

  function handleSavePreferences() {
    showToast('Preferences saved.', 'success')
  }

  const tabs = [
    { id: 'info' as const,        label: 'Profile Info' },
    { id: 'security' as const,    label: 'Security' },
    { id: 'preferences' as const, label: 'Preferences' },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShieldCheck className="text-navy-400 w-5 h-5" />
          <span className="font-bold text-white text-sm">ForenSight AI</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm">Profile</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Avatar + name header */}
        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="relative group flex-shrink-0">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-navy-700 flex items-center justify-center text-lg md:text-2xl font-bold text-white select-none">
              SD
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">{profile.fullName}</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5 truncate">{profile.role} · {profile.organisation}</p>
            <p className="text-gray-500 text-xs font-mono mt-1 truncate">@{profile.username}</p>
          </div>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-1 border-b border-gray-800 mb-6 md:mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'border-navy-400 text-navy-300' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Profile Info ── */}
        {activeTab === 'info' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-white">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                icon={<User className="w-4 h-4" />}
                value={profile.fullName}
                onChange={(v) => setProfile({ ...profile, fullName: v })}
              />
              <Field
                label="Username"
                icon={<User className="w-4 h-4" />}
                value={profile.username}
                onChange={(v) => setProfile({ ...profile, username: v })}
                prefix="@"
              />
              <Field
                label="Email"
                icon={<Mail className="w-4 h-4" />}
                value={profile.email}
                onChange={(v) => setProfile({ ...profile, email: v })}
                type="email"
              />
              <Field
                label="Phone"
                icon={<Phone className="w-4 h-4" />}
                value={profile.phone}
                onChange={(v) => setProfile({ ...profile, phone: v })}
                type="tel"
              />
              <Field
                label="Organisation"
                icon={<Building className="w-4 h-4" />}
                value={profile.organisation}
                onChange={(v) => setProfile({ ...profile, organisation: v })}
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Role</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                >
                  <option>Investigator</option>
                  <option>Senior Investigator</option>
                  <option>Analyst</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* ── Tab: Security ── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change password */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-navy-400" />
                Change Password
              </h2>

              <PasswordField
                label="Current Password"
                value={passwords.current}
                onChange={(v) => setPasswords({ ...passwords, current: v })}
                show={showCurrent}
                onToggle={() => setShowCurrent((s) => !s)}
              />
              <PasswordField
                label="New Password"
                value={passwords.newPass}
                onChange={(v) => setPasswords({ ...passwords, newPass: v })}
                show={showNew}
                onToggle={() => setShowNew((s) => !s)}
                hint="Minimum 8 characters"
              />
              <PasswordField
                label="Confirm New Password"
                value={passwords.confirm}
                onChange={(v) => setPasswords({ ...passwords, confirm: v })}
                show={showConfirm}
                onToggle={() => setShowConfirm((s) => !s)}
              />

              {/* Password strength indicator */}
              {passwords.newPass.length > 0 && (
                <PasswordStrength password={passwords.newPass} />
              )}

              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>

            {/* Session info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">Active Session</h2>
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Current session</p>
                  <p className="text-xs text-gray-500 mt-0.5">Windows · Chrome · 192.168.1.10</p>
                  <p className="text-xs text-gray-600 mt-0.5">Started today at 09:00 UTC</p>
                </div>
                <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2.5 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Preferences ── */}
        {activeTab === 'preferences' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <h2 className="text-base font-semibold text-white">Preferences</h2>

            {/* Notifications */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Notifications</h3>
              <div className="space-y-3">
                <Toggle
                  label="Email notifications"
                  description="Receive email alerts when parsing completes"
                  checked={prefs.emailNotifications}
                  onChange={(v) => setPrefs({ ...prefs, emailNotifications: v })}
                />
                <Toggle
                  label="Desktop notifications"
                  description="Browser push notifications for case updates"
                  checked={prefs.desktopNotifications}
                  onChange={(v) => setPrefs({ ...prefs, desktopNotifications: v })}
                />
                <Toggle
                  label="Auto-save reports"
                  description="Automatically save report drafts every 5 minutes"
                  checked={prefs.autoSaveReports}
                  onChange={(v) => setPrefs({ ...prefs, autoSaveReports: v })}
                />
              </div>
            </div>

            {/* Display */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Default Graph Layout</label>
                  <select
                    value={prefs.defaultGraphLayout}
                    onChange={(e) => setPrefs({ ...prefs, defaultGraphLayout: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="cose">CoSE (Force-directed)</option>
                    <option value="breadthfirst">Breadth First</option>
                    <option value="circle">Circle</option>
                    <option value="grid">Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Timezone</label>
                  <select
                    value={prefs.timezone}
                    onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="IST">IST (UTC+5:30)</option>
                    <option value="EST">EST (UTC-5)</option>
                    <option value="PST">PST (UTC-8)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Date Format</label>
                  <select
                    value={prefs.dateFormat}
                    onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Field({
  label, icon, value, onChange, type = 'text', prefix, hint,
}: {
  label: string
  icon?: React.ReactNode
  value: string
  onChange: (v: string) => void
  type?: string
  prefix?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        )}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg py-2.5 text-white text-sm focus:outline-none transition-colors ${
            icon ? 'pl-9 pr-4' : prefix ? 'pl-6 pr-4' : 'px-4'
          }`}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

function PasswordField({
  label, value, onChange, show, onToggle, hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-gray-800 border border-gray-700 focus:border-navy-500 rounded-lg pl-9 pr-10 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /\d/.test(password) },
    { label: 'Contains special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score]
  const strengthColor = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-400'][score]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < score ? strengthColor : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{strengthLabel}</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs flex items-center gap-1.5 ${c.pass ? 'text-green-400' : 'text-gray-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.pass ? 'bg-green-400' : 'bg-gray-600'}`} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Toggle({
  label, description, checked, onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-navy-600' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
