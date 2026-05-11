import type { Severity } from '../types'

const CONFIG: Record<Severity, { label: string; cls: string }> = {
  error: { label: 'エラー', cls: 'bg-red-100 text-red-700 border-red-200' },
  warning: { label: '警告', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  info: { label: '情報', cls: 'bg-blue-100 text-blue-600 border-blue-200' },
}

export function IssueTag({ severity }: { severity: Severity }) {
  const { label, cls } = CONFIG[severity]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}
