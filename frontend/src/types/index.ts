export type Severity = 'error' | 'warning' | 'info'
export type StyleType = 'standard' | 'impact' | 'visual'

export interface Issue {
  rule_id: string
  severity: Severity
  auto_fixable: boolean
  message: string
  suggestion: string
  details: Record<string, unknown>
}

export interface SlideResult {
  slide_number: number
  score: number
  issues: Issue[]
}

export interface AnalysisResult {
  total_slides: number
  overall_score: number
  style: StyleType
  has_autofixable: boolean
  slides: SlideResult[]
}
