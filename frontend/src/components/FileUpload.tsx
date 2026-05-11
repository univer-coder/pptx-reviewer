import { useRef, useState } from 'react'
import type { StyleType } from '../types'

const STYLES: { value: StyleType; label: string; desc: string }[] = [
  { value: 'standard', label: 'Standard', desc: '定例報告・提案書用（薄灰背景＋白コンテナ）' },
  { value: 'impact', label: 'Impact', desc: '大規模イベント・キーノート用（ダークモード）' },
  { value: 'visual', label: 'Visual', desc: '画像重視・テキスト密度ルールを緩和' },
]

interface Props {
  onAnalyze: (file: File, style: StyleType) => void
  loading: boolean
}

export function FileUpload({ onAnalyze, loading }: Props) {
  const [style, setStyle] = useState<StyleType>('standard')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.pptx')) {
      alert('PPTXファイルを選択してください')
      return
    }
    setSelectedFile(f)
    setFileName(f.name)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = () => {
    if (selectedFile) onAnalyze(selectedFile, style)
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
          ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pptx"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <div className="text-4xl mb-3">📊</div>
        {fileName ? (
          <p className="text-sm font-medium text-indigo-600">{fileName}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">PPTXファイルをドラッグ＆ドロップ</p>
            <p className="text-xs text-gray-400 mt-1">またはクリックして選択</p>
          </>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">スタイルを選択</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`
                text-left p-3 rounded-xl border transition-all
                ${style === s.value
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400'
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <p className="text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm
          hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '解析中...' : '解析する'}
      </button>
    </div>
  )
}
