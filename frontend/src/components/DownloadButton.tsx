import { useState } from 'react'
import type { StyleType } from '../types'

interface Props {
  onDownload: (style: StyleType) => Promise<void>
  style: StyleType
}

export function DownloadButton({ onDownload, style }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle = async () => {
    setLoading(true)
    setError(null)
    try {
      await onDownload(style)
    } catch (e) {
      setError(e instanceof Error ? e.message : '修正に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handle}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white
          text-sm font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span>⬇</span>
        {loading ? '修正中...' : '自動修正してダウンロード'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
