import { atomWithStorage } from 'jotai/utils'
import type { GameState, PlayerScore, RoundDraft, RoundRecord, TrumpSuit } from '../types/game'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
export const MIN_ROUNDS = 1
export const MAX_ROUNDS = 20

export const STANDARD_ROUND_COUNTS: Record<number, number> = {
  3: 20,
  4: 15,
  5: 12,
  6: 10,
}

export const TRUMP_OPTIONS: TrumpSuit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs', 'No Trump']

const storageKey = 'wizard-scorekeeper.game-state'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const getStandardRoundCount = (playerCount: number): number | undefined =>
  STANDARD_ROUND_COUNTS[playerCount]

const normalizePlayerName = (name: string, index: number) => {
  const trimmedName = name.trim()

  return trimmedName.length > 0 ? trimmedName : `Player ${index + 1}`
}

export const createSetupPlayerNames = (playerCount: number): string[] =>
  Array.from({ length: playerCount }, (_, index) => `Player ${index + 1}`)

export const resizePlayerNames = (playerNames: string[], playerCount: number): string[] =>
  Array.from({ length: playerCount }, (_, index) => playerNames[index] ?? `Player ${index + 1}`)

export const createPlayers = (playerCount: number): PlayerScore[] =>
  Array.from({ length: playerCount }, (_, index) => ({
    id: `player-${index + 1}`,
    name: `Player ${index + 1}`,
    totalScore: 0,
    lastBid: 0,
    lastTricks: 0,
    lastScore: 0,
  }))

export const createPlayersFromNames = (playerNames: string[]): PlayerScore[] =>
  playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name: normalizePlayerName(name, index),
    totalScore: 0,
    lastBid: 0,
    lastTricks: 0,
    lastScore: 0,
  }))

export const createEmptyRoundDraft = (playerCount: number): RoundDraft => ({
  trump: 'Spades',
  bids: Array.from({ length: playerCount }, () => 0),
  tricks: Array.from({ length: playerCount }, () => 0),
})

export const createInitialGameState = (): GameState => ({
  status: 'setup',
  playerCount: 4,
  roundCount: 15,
  currentRound: 1,
  playerNames: createSetupPlayerNames(4),
  players: [],
  rounds: [],
  draft: createEmptyRoundDraft(4),
})

export const normalizeGameState = (state: Partial<GameState> | undefined): GameState => {
  const fallback = createInitialGameState()

  if (!state) {
    return fallback
  }

  const playerCount = clamp(state.playerCount ?? fallback.playerCount, MIN_PLAYERS, MAX_PLAYERS)
  const playerNames = resizePlayerNames(state.playerNames ?? createSetupPlayerNames(playerCount), playerCount)
  const standardRoundCount = getStandardRoundCount(playerCount)
  const roundCount = clamp(
    standardRoundCount ?? state.roundCount ?? fallback.roundCount,
    MIN_ROUNDS,
    MAX_ROUNDS,
  )
  const currentRound = clamp(state.currentRound ?? fallback.currentRound, 1, roundCount)

  return {
    status: state.status ?? fallback.status,
    playerCount,
    roundCount,
    currentRound,
    playerNames,
    players: Array.isArray(state.players) ? state.players : [],
    rounds: Array.isArray(state.rounds) ? state.rounds : [],
    draft: {
      trump: state.draft?.trump ?? fallback.draft.trump,
      bids: Array.isArray(state.draft?.bids) ? state.draft!.bids.slice(0, playerCount) : createEmptyRoundDraft(playerCount).bids,
      tricks: Array.isArray(state.draft?.tricks)
        ? state.draft!.tricks.slice(0, playerCount)
        : createEmptyRoundDraft(playerCount).tricks,
    },
  }
}

export const gameStateAtom = atomWithStorage<GameState>(storageKey, createInitialGameState())

export const setPlayerCount = (state: GameState, nextPlayerCount: number): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'setup') {
    return normalizedState
  }

  const playerCount = clamp(nextPlayerCount, MIN_PLAYERS, MAX_PLAYERS)
  const standardRoundCount = getStandardRoundCount(playerCount)

  return {
    ...normalizedState,
    playerCount,
    playerNames: resizePlayerNames(normalizedState.playerNames, playerCount),
    roundCount: standardRoundCount ?? normalizedState.roundCount,
    draft: createEmptyRoundDraft(playerCount),
  }
}

export const setRoundCount = (state: GameState, nextRoundCount: number): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'setup') {
    return normalizedState
  }

  const standardRoundCount = getStandardRoundCount(normalizedState.playerCount)

  if (standardRoundCount !== undefined) {
    return {
      ...normalizedState,
      roundCount: standardRoundCount,
    }
  }

  return {
    ...normalizedState,
    roundCount: clamp(nextRoundCount, MIN_ROUNDS, MAX_ROUNDS),
  }
}

export const setPlayerName = (state: GameState, playerIndex: number, nextName: string): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'setup') {
    return normalizedState
  }

  const playerNames = [...normalizedState.playerNames]
  playerNames[playerIndex] = nextName

  return {
    ...normalizedState,
    playerNames,
  }
}

export const startGame = (state: GameState): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'setup') {
    return normalizedState
  }

  const players = createPlayersFromNames(normalizedState.playerNames)

  return {
    ...normalizedState,
    status: 'active',
    currentRound: 1,
    players,
    rounds: [],
    draft: createEmptyRoundDraft(normalizedState.playerCount),
  }
}

export const resetGame = (): GameState => createInitialGameState()

export const setDraftTrump = (state: GameState, trump: TrumpSuit): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'active' && normalizedState.status !== 'complete') {
    return normalizedState
  }

  return {
    ...normalizedState,
    draft: {
      ...normalizedState.draft,
      trump,
    },
  }
}

export const setDraftValue = (
  state: GameState,
  field: 'bids' | 'tricks',
  playerIndex: number,
  nextValue: number,
): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'active') {
    return normalizedState
  }

  const maxValue = normalizedState.currentRound
  const values = [...normalizedState.draft[field]]
  values[playerIndex] = clamp(nextValue, 0, maxValue)

  return {
    ...normalizedState,
    draft: {
      ...normalizedState.draft,
      [field]: values,
    },
  }
}

export const calculateRoundScore = (bid: number, tricks: number): number => {
  const exactMatchBonus = 20 + bid * 10
  const penalty = Math.abs(bid - tricks) * 10

  return bid === tricks ? exactMatchBonus : -penalty
}

export const submitRound = (state: GameState): GameState => {
  const normalizedState = normalizeGameState(state)

  if (normalizedState.status !== 'active') {
    return normalizedState
  }

  const bids = normalizedState.draft.bids.slice(0, normalizedState.playerCount)
  const tricks = normalizedState.draft.tricks.slice(0, normalizedState.playerCount)
  const scores = bids.map((bid, index) => calculateRoundScore(bid, tricks[index] ?? 0))

  const updatedPlayers = normalizedState.players.map((player, index) => ({
    ...player,
    lastBid: bids[index] ?? 0,
    lastTricks: tricks[index] ?? 0,
    lastScore: scores[index] ?? 0,
    totalScore: player.totalScore + (scores[index] ?? 0),
  }))

  const roundRecord: RoundRecord = {
    roundNumber: normalizedState.currentRound,
    trump: normalizedState.draft.trump,
    bids,
    tricks,
    scores,
  }

  const nextRound = normalizedState.currentRound + 1
  const complete = nextRound > normalizedState.roundCount

  return {
    ...normalizedState,
    status: complete ? 'complete' : 'active',
    currentRound: complete ? normalizedState.roundCount : nextRound,
    players: updatedPlayers,
    rounds: [...normalizedState.rounds, roundRecord],
    draft: createEmptyRoundDraft(normalizedState.playerCount),
  }
}