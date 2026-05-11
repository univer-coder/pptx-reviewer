import { useState } from 'react'
import type { SlideResult } from '../types'
import { IssueTag } from './IssueTag'

export function SlideCard({ slide }: { slide: SlideResult }) {
  const [open, setOpen] = useState(true)
  const hasIssues = slide.issues.length > 0
  const scoreColor = slide.score >= 80 ? 'text-green-600' : slide.score >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">スライド {slide.slide_number}</span>
          {!hasIssues && (
            <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-0.5">
              問題なし
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${scoreColor}`}>{slide.score}点</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && hasIssues && (
        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {slide.issues.map((issue, i) => (
            <li key={i} className="px-5 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <IssueTag severity={issue.severity} />
                {issue.auto_fixable && (
                  <span className="text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded px-2 py-0.5">
                    自動修正可
                  </span>
                )}
                <span className="text-sm text-gray-800">{issue.message}</span>
              </div>
              <p className="text-xs text-gray-500 pl-1">💡 {issue.suggestion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
