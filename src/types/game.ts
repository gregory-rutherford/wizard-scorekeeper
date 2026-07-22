export type GameStatus = 'setup' | 'active' | 'complete'

export type TrumpSuit = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs' | 'No Trump'

export type PlayerScore = {
  id: string
  name: string
  totalScore: number
  lastBid: number
  lastTricks: number
  lastScore: number
}

export type RoundRecord = {
  roundNumber: number
  trump: TrumpSuit
  bids: number[]
  tricks: number[]
  scores: number[]
}

export type RoundDraft = {
  trump: TrumpSuit
  bids: number[]
  tricks: number[]
}

export type GameState = {
  status: GameStatus
  playerCount: number
  roundCount: number
  currentRound: number
  playerNames: string[]
  players: PlayerScore[]
  rounds: RoundRecord[]
  draft: RoundDraft
}