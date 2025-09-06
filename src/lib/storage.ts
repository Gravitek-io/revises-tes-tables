import { GameSettings, GameSession, SessionStats } from '@/types'

const STORAGE_KEYS = {
  SETTINGS: 'multiplication-game-settings',
  SESSIONS: 'multiplication-game-sessions',
  STATS: 'multiplication-game-stats',
} as const

const DEFAULT_SETTINGS: GameSettings = {
  numberOfQuestions: 10,
  selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

export class GameStorage {
  static getSettings(): GameSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
    } catch (error) {
      console.error('Error loading settings:', error)
      return DEFAULT_SETTINGS
    }
  }

  static saveSettings(settings: GameSettings): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  static getSessions(): GameSession[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading sessions:', error)
      return []
    }
  }

  static saveSession(session: GameSession): void {
    if (typeof window === 'undefined') return
    
    try {
      const sessions = this.getSessions()
      const updatedSessions = [session, ...sessions].slice(0, 50) // Keep only last 50 sessions
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions))
      this.updateStats(updatedSessions)
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  static getStats(): SessionStats {
    if (typeof window === 'undefined') {
      return {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        averageScore: 0,
        recentSessions: [],
      }
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS)
      if (stored) {
        return JSON.parse(stored)
      }
      return this.calculateStats(this.getSessions())
    } catch (error) {
      console.error('Error loading stats:', error)
      return {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        averageScore: 0,
        recentSessions: [],
      }
    }
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      localStorage.removeItem(STORAGE_KEYS.SESSIONS)
      localStorage.removeItem(STORAGE_KEYS.STATS)
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  private static updateStats(sessions: GameSession[]): void {
    const stats = this.calculateStats(sessions)
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  }

  private static calculateStats(sessions: GameSession[]): SessionStats {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        averageScore: 0,
        recentSessions: [],
      }
    }

    const totalSessions = sessions.length
    const totalQuestions = sessions.reduce((sum, session) => sum + session.questions.length, 0)
    const totalCorrectAnswers = sessions.reduce((sum, session) => sum + session.correctAnswers, 0)
    const totalIncorrectAnswers = sessions.reduce((sum, session) => sum + session.incorrectAnswers, 0)
    const averageScore = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0

    // Calculate weakest and strongest tables
    const tableStats: Record<number, { correct: number; total: number }> = {}
    
    sessions.forEach(session => {
      session.questions.forEach(question => {
        const table = question.multiplicand
        if (!tableStats[table]) {
          tableStats[table] = { correct: 0, total: 0 }
        }
        tableStats[table].total++
        if (question.isCorrect) {
          tableStats[table].correct++
        }
      })
    })

    let weakestTable: number | undefined
    let strongestTable: number | undefined
    let lowestRate = 1
    let highestRate = 0

    Object.entries(tableStats).forEach(([table, stats]) => {
      const rate = stats.correct / stats.total
      if (rate < lowestRate) {
        lowestRate = rate
        weakestTable = parseInt(table)
      }
      if (rate > highestRate) {
        highestRate = rate
        strongestTable = parseInt(table)
      }
    })

    return {
      totalSessions,
      totalQuestions,
      totalCorrectAnswers,
      totalIncorrectAnswers,
      averageScore,
      weakestTable,
      strongestTable,
      recentSessions: sessions.slice(0, 10),
    }
  }
}