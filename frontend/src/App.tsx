import { useAnalysis } from './hooks/useAnalysis'
import { FileUpload } from './components/FileUpload'
import { ScoreSummary } from './components/ScoreSummary'
import { SlideCard } from './components/SlideCard'
import { DownloadButton } from './components/DownloadButton'
import type { StyleType } from './types'
import './index.css'

export default function App() {
  const { result, loading, error, analyze, downloadFixed, reset } = useAnalysis()

  const handleAnalyze = (file: File, style: StyleType) => {
    analyze(file, style)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">PPTX Reviewer</h1>
          <p className="text-xs text-gray-400">スライドのデザイン・レイアウトを自動チェック</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {!result ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <FileUpload onAnalyze={handleAnalyze} loading={loading} />
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">解析結果</h2>
              <div className="flex items-center gap-3">
                {result.has_autofixable && (
                  <DownloadButton
                    onDownload={downloadFixed}
                    style={result.style as StyleType}
                  />
                )}
                <button
                  onClick={reset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  別のファイルを解析
                </button>
              </div>
            </div>

            <ScoreSummary result={result} />

            <div className="space-y-3">
              {result.slides.map(slide => (
                <SlideCard key={slide.slide_number} slide={slide} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
