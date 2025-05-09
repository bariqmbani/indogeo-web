import type { LeafletEvent } from 'leaflet'
import { reactive, ref } from 'vue'

const TOTAL_QUESTION = ref(15)
const MAX_SCORE = ref(100)
const MIN_SCORE = 0
const DECREMENT_VALUE = 5
const MAX_ATTEMPT = 3

export type GameOption = {
  code: string
  name: string
}
export type GameGeoJson = {
  feature: GeoJSON.Feature
  event: LeafletEvent
}
export type GameQuestion = GameOption
export type GameAnswer = GameOption & GameGeoJson

export type GamePlayType = 'province' | 'city'

class Game {
  private _score: number
  private _totalQuestionCount: number
  private _currentQuestionCount = 0
  private _questions: GameQuestion[] = []
  private _currentQuestion: GameQuestion | undefined = undefined
  private _startAt: number | undefined
  private _endAt: number | undefined
  private _maxAttempt = MAX_ATTEMPT

  constructor(maxScore: number, totalQuestions: number, maxAttempt: number) {
    this._score = maxScore
    this._totalQuestionCount = totalQuestions
    this._maxAttempt = maxAttempt
  }

  get score() {
    return this._score
  }

  get totalQuestionCount() {
    return this._totalQuestionCount
  }

  get currentQuestionCount() {
    return this._currentQuestionCount
  }

  get currentQuestion() {
    return this._currentQuestion
  }

  get startAt() {
    return this._startAt
  }

  get endAt() {
    return this._endAt
  }

  initGame(questions: GameQuestion[]) {
    timerStore.resetTimer()
    this._questions = questions
    this._currentQuestionCount = 0
    this._score = MAX_SCORE.value
    this._startAt = Date.now()
    this._endAt = undefined
    this.nextQuestion()
    timerStore.startTimer()
  }

  isOngoing() {
    return (
      this._startAt != null &&
      this._endAt == null &&
      this._currentQuestion != null &&
      this._questions.length > 0
    )
  }

  decrementScore() {
    if (this._score <= MIN_SCORE) {
      return
    }
    this._score -= DECREMENT_VALUE
  }

  nextQuestion() {
    answerStore.resetAnswerAttempt()
    this._currentQuestionCount++
    if (this._currentQuestionCount >= this._totalQuestionCount) {
      this.setGameFinished()
    }
    const randomIndex = Math.floor(Math.random() * this._questions.length)
    this._currentQuestion = this._questions[randomIndex]
  }

  evaluateAnswer(answer: GameAnswer) {
    answerStore.setLastAnswer(answer)
    if (answer.code === this._currentQuestion?.code) {
      this.markCorrect()
    } else {
      console.debug('wrong answer')
      this.markWrong()
    }

    if (answerStore.isCorrect || answerStore.answerAttempt >= this._maxAttempt) {
      this.nextQuestion()
    }
  }

  markCorrect() {
    answerStore.isCorrect = true
    answerStore.resetAnswerAttempt()
  }

  markWrong() {
    answerStore.isCorrect = false
    // if (!answerStore.alreadyAnswered()) {
    this.decrementScore()
    // }
    answerStore.incrementAttempt()
  }

  setGameFinished() {
    this._endAt = Date.now()
    timerStore.stopTimer()
  }
}

export const gameStore = reactive(new Game(MAX_SCORE.value, TOTAL_QUESTION.value, MAX_ATTEMPT))

export const timerStore = reactive({
  currentMinutes: '00',
  currentSeconds: '00',
  _timerIntervalId: null as ReturnType<typeof setInterval> | null,

  get timer() {
    return `${this.currentMinutes}:${this.currentSeconds}`
  },

  startTimer() {
    if (this._timerIntervalId !== null) return

    this._timerIntervalId = setInterval(() => {
      if (!gameStore.startAt) return

      const diff = Date.now() - gameStore.startAt
      const minutes = Math.floor(diff / 1000 / 60)
      const seconds = Math.floor((diff / 1000) % 60)
      this.currentMinutes = minutes.toString().padStart(2, '0')
      this.currentSeconds = seconds.toString().padStart(2, '0')
    }, 1000)
  },

  stopTimer() {
    if (this._timerIntervalId) {
      clearInterval(this._timerIntervalId)
      this._timerIntervalId = null
    }
  },

  resetTimer() {
    this.currentMinutes = '00'
    this.currentSeconds = '00'
    this.stopTimer()
  },
})

export const answerStore = reactive({
  answerAttempt: 0,
  isCorrect: false,
  lastAnswer: undefined as GameAnswer | undefined,
  setLastAnswer(answer: GameAnswer) {
    this.lastAnswer = answer
  },
  resetAnswerAttempt() {
    this.answerAttempt = 0
    if (!this.lastAnswer) {
      return
    }

    // this.lastAnswer.feature!.properties!['dontChangeStyle'] = false
    // this.lastAnswer.event.target.setStyle({
    //   fillColor: 'white',
    //   fillOpacity: 0.4,
    //   weight: 0.3,
    //   opacity: 0.3,
    // })
  },
  alreadyAnswered() {
    return this.answerAttempt > 0
  },
  incrementAttempt() {
    this.answerAttempt++
  },
})
