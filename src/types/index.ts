export interface GameSettings {
  numberOfQuestions: number
  selectedTables: number[]
}

export interface Question {
  id: string
  multiplicand: number
  multiplier: number
  answer: number
  userAnswer?: number
  isCorrect?: boolean
  timeToAnswer?: number
}

export interface GameSession {
  id: string
  date: string
  settings: GameSettings
  questions: Question[]
  correctAnswers: number
  incorrectAnswers: number
  completedAt?: string
  duration?: number
}

export interface SessionStats {
  totalSessions: number
  totalQuestions: number
  totalCorrectAnswers: number
  totalIncorrectAnswers: number
  averageScore: number
  weakestTable?: number
  strongestTable?: number
  recentSessions: GameSession[]
}

export interface EncouragementMessage {
  type: 'excellent' | 'good' | 'canDoBetter' | 'keepTrying'
  message: string
  emoji: string
}