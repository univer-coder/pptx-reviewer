import type { AnalysisResult } from '../types'

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        fontSize="20" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  )
}

export function ScoreSummary({ result }: { result: AnalysisResult }) {
  const errorCount = result.slides.flatMap(s => s.issues).filter(i => i.severity === 'error').length
  const warnCount = result.slides.flatMap(s => s.issues).filter(i => i.severity === 'warning').length
  const infoCount = result.slides.flatMap(s => s.issues).filter(i => i.severity === 'info').length

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6">
      <ScoreRing score={result.overall_score} />
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">総合スコア</p>
        <div className="flex flex-wrap gap-4 mt-3">
          <Stat label="スライド数" value={result.total_slides} color="text-gray-700" />
          <Stat label="エラー" value={errorCount} color="text-red-600" />
          <Stat label="警告" value={warnCount} color="text-yellow-600" />
          <Stat label="情報" value={infoCount} color="text-blue-600" />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
