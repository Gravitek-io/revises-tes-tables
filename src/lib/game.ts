import { Question, GameSettings, EncouragementMessage } from '@/types'

export class GameEngine {
  static generateQuestions(settings: GameSettings): Question[] {
    const questions: Question[] = []
    const { numberOfQuestions, selectedTables } = settings

    for (let i = 0; i < numberOfQuestions; i++) {
      const tableIndex = Math.floor(Math.random() * selectedTables.length)
      const multiplicand = selectedTables[tableIndex]
      const multiplier = Math.floor(Math.random() * 10) + 1 // 1 to 10
      
      questions.push({
        id: `q-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        multiplicand,
        multiplier,
        answer: multiplicand * multiplier,
      })
    }

    return this.shuffleArray(questions)
  }

  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  static calculateScore(questions: Question[]): {
    correct: number
    incorrect: number
    percentage: number
    weakestTable?: number
  } {
    const correct = questions.filter(q => q.isCorrect).length
    const incorrect = questions.length - correct
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

    // Find weakest table
    const tableStats: Record<number, { correct: number; total: number }> = {}
    questions.forEach(q => {
      if (!tableStats[q.multiplicand]) {
        tableStats[q.multiplicand] = { correct: 0, total: 0 }
      }
      tableStats[q.multiplicand].total++
      if (q.isCorrect) {
        tableStats[q.multiplicand].correct++
      }
    })

    let weakestTable: number | undefined
    let lowestRate = 1
    Object.entries(tableStats).forEach(([table, stats]) => {
      const rate = stats.total > 0 ? stats.correct / stats.total : 1
      if (rate < lowestRate && stats.total > 0) {
        lowestRate = rate
        weakestTable = parseInt(table)
      }
    })

    return { correct, incorrect, percentage, weakestTable }
  }

  static getEncouragementMessage(percentage: number, weakestTable?: number): EncouragementMessage {
    const messages = {
      excellent: [
        { message: "Fantastique ! Tu es un champion des mathématiques !", emoji: "🏆" },
        { message: "Extraordinaire ! Tu maîtrises parfaitement tes tables !", emoji: "⭐" },
        { message: "Bravo ! Quel talent pour les multiplications !", emoji: "🎉" },
        { message: "Superbe ! Tu es vraiment doué !", emoji: "🌟" },
      ],
      good: [
        { message: "Très bien joué ! Continue comme ça !", emoji: "👍" },
        { message: "Bon travail ! Tu progresses bien !", emoji: "😊" },
        { message: "C'est du bon boulot ! Bravo !", emoji: "🎯" },
        { message: "Super ! Tu es sur la bonne voie !", emoji: "🚀" },
      ],
      canDoBetter: [
        { message: "Pas mal ! Avec un peu plus d'entraînement, tu vas y arriver !", emoji: "💪" },
        { message: "C'est déjà bien ! Continue de t'entraîner !", emoji: "📚" },
        { message: "Tu y arrives ! Un petit effort en plus et ce sera parfait !", emoji: "🎯" },
        { message: "Courage ! Tu progresses à chaque fois !", emoji: "⬆️" },
      ],
      keepTrying: [
        { message: "Ce n'est pas grave ! Rome ne s'est pas faite en un jour !", emoji: "🏗️" },
        { message: "Continue ! Chaque erreur nous rend plus fort !", emoji: "💪" },
        { message: "N'abandonne pas ! Tu vas y arriver !", emoji: "🌱" },
        { message: "Patience ! Les champions s'entraînent beaucoup !", emoji: "🥇" },
      ]
    }

    let type: keyof typeof messages
    if (percentage >= 90) type = 'excellent'
    else if (percentage >= 70) type = 'good'
    else if (percentage >= 50) type = 'canDoBetter'
    else type = 'keepTrying'

    const selectedMessages = messages[type]
    const randomMessage = selectedMessages[Math.floor(Math.random() * selectedMessages.length)]

    let finalMessage = randomMessage.message
    if (weakestTable && type !== 'excellent') {
      finalMessage += ` Pense à réviser un peu plus la table de ${weakestTable} !`
    }

    return {
      type,
      message: finalMessage,
      emoji: randomMessage.emoji
    }
  }

  static formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} seconde${seconds > 1 ? 's' : ''}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds > 0 ? `et ${remainingSeconds} seconde${remainingSeconds > 1 ? 's' : ''}` : ''}`
  }
}