import { useState } from 'react'
import type { AnalysisResult, StyleType } from '../types'

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const analyze = async (f: File, style: StyleType) => {
    setLoading(true)
    setError(null)
    setFile(f)
    const form = new FormData()
    form.append('file', f)
    form.append('style', style)
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: form })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail ?? 'エラーが発生しました')
      }
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラー')
    } finally {
      setLoading(false)
    }
  }

  const downloadFixed = async (style: StyleType) => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    form.append('style', style)
    const res = await fetch('/api/fix', { method: 'POST', body: form })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.detail ?? '修正に失敗しました')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name.replace('.pptx', '_fixed.pptx')
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setFile(null)
  }

  return { result, loading, error, analyze, downloadFixed, reset }
}
