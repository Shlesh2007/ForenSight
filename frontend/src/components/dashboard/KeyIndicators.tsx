import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { FileText, Cpu, Globe, ShieldAlert, Lock } from 'lucide-react'
import { mockIndicators } from '../../services/mockData'

interface Props {
  caseId: string
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  highlight?: boolean
}

function StatCard({ icon, label, value, color, highlight }: StatCardProps) {
  return (
    <div className={`bg-gray-900 border rounded-xl p-5 flex items-start gap-4 ${
      highlight ? 'border-amber-500/40 bg-amber-950/20' : 'border-gray-800'
    }`}>
      <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

export default function KeyIndicators({ caseId }: Props) {
  const indicators = mockIndicators

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5 text-blue-400" />}
          label="Files Parsed"
          value={indicators.total_files}
          color="bg-blue-900/40"
        />
        <StatCard
          icon={<Cpu className="w-5 h-5 text-purple-400" />}
          label="Processes"
          value={indicators.total_processes}
          color="bg-purple-900/40"
        />
        <StatCard
          icon={<Globe className="w-5 h-5 text-green-400" />}
          label="Network Endpoints"
          value={indicators.total_network_endpoints}
          color="bg-green-900/40"
        />
        <StatCard
          icon={<ShieldAlert className="w-5 h-5 text-amber-400" />}
          label="Suspicious Processes"
          value={indicators.suspicious_processes}
          color="bg-amber-900/40"
          highlight={indicators.suspicious_processes > 0}
        />
        <StatCard
          icon={<Lock className="w-5 h-5 text-red-400" />}
          label="Persistence Mechanisms"
          value={indicators.persistence_mechanisms}
          color="bg-red-900/40"
          highlight={indicators.persistence_mechanisms > 0}
        />
      </div>

      {/* Timeline chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Events per Hour</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={indicators.events_per_hour} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#d1d5db' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Bar dataKey="count" fill="#1f3a5f" radius={[4, 4, 0, 0]} activeBar={{ fill: '#2f5499' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
