import { Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { GameState, TrumpSuit } from '../types/game'

type RoundEntryCardProps = {
  gameState: GameState
  onTrumpChange: (trump: TrumpSuit) => void
  onBidChange: (playerIndex: number, value: number) => void
  onTrickChange: (playerIndex: number, value: number) => void
  onSaveRound: () => void
  onResetGame: () => void
}

const trumpOptions: TrumpSuit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs', 'No Trump']

type NumericRoundFieldProps = {
  label: string
  value: number
  maxValue: number
  onChange: (value: number) => void
  disabled: boolean
}

function NumericRoundField({ label, value, maxValue, onChange, disabled }: NumericRoundFieldProps) {
  const [displayValue, setDisplayValue] = useState(String(value))

  useEffect(() => {
    setDisplayValue(String(value))
  }, [value])

  const handleTextChange = (nextValue: string) => {
    if (nextValue === '') {
      setDisplayValue('')
      return
    }

    if (!/^\d+$/.test(nextValue)) {
      return
    }

    const parsedValue = Math.min(Number(nextValue), maxValue)
    setDisplayValue(String(parsedValue))
    onChange(parsedValue)
  }

  const handleBlur = () => {
    if (displayValue === '') {
      setDisplayValue(String(value))
    }
  }

  return (
    <TextField
      className="round-field"
      label={label}
      type="text"
      value={displayValue}
      onChange={(event) => handleTextChange(event.target.value)}
      onBlur={handleBlur}
      slotProps={{ htmlInput: { min: 0, max: maxValue, inputMode: 'numeric', pattern: '[0-9]*' } }}
      disabled={disabled}
      fullWidth
    />
  )
}

export function RoundEntryCard({
  gameState,
  onTrumpChange,
  onBidChange,
  onTrickChange,
  onSaveRound,
  onResetGame,
}: RoundEntryCardProps) {
  const isActive = gameState.status === 'active'
  const isComplete = gameState.status === 'complete'
  const maxRoundValue = gameState.currentRound

  return (
    <Card className="retro-card round-card">
      <CardContent>
        <Box className="card-header-row">
          <div>
            <Typography className="section-label" variant="overline" component="p">
              Round entry
            </Typography>
            <Typography className="card-title" component="h2">
              Round {gameState.currentRound} of {gameState.roundCount}
            </Typography>
          </div>
          <Chip
            className="status-chip"
            label={isComplete ? 'Finished' : isActive ? 'Recording' : 'Waiting'}
          />
        </Box>

        <Typography className="card-copy" component="p">
          Record bids, tricks, and the trump suit for the current round. Scores update when you save the round.
        </Typography>

        <TextField
          className="trump-select"
          select
          label="Trump"
          value={gameState.draft.trump}
          onChange={(event) => onTrumpChange(event.target.value as TrumpSuit)}
          fullWidth
          disabled={!isActive}
        >
          {trumpOptions.map((trump) => (
            <MenuItem key={trump} value={trump}>
              {trump}
            </MenuItem>
          ))}
        </TextField>

        <Stack spacing={1.5}>
          {gameState.players.length > 0 ? (
            gameState.players.map((player, index) => (
              <Stack key={player.id} className="round-row" spacing={1.25}>
                <Typography className="round-player-name" component="p">
                  {player.name}
                </Typography>
                <Stack direction="row" spacing={1.25} className="round-input-grid">
                  <NumericRoundField
                    label="Bid"
                    value={gameState.draft.bids[index] ?? 0}
                    maxValue={maxRoundValue}
                    onChange={(nextValue) => onBidChange(index, nextValue)}
                    disabled={!isActive}
                  />
                  <NumericRoundField
                    label="Tricks"
                    value={gameState.draft.tricks[index] ?? 0}
                    maxValue={maxRoundValue}
                    onChange={(nextValue) => onTrickChange(index, nextValue)}
                    disabled={!isActive}
                  />
                </Stack>
              </Stack>
            ))
          ) : (
            <Typography className="empty-state" component="p">
              Start a game to unlock the round entry form.
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1.5} className="action-row">
          <Button className="primary-button" variant="contained" fullWidth onClick={onSaveRound} disabled={!isActive}>
            Save round
          </Button>
          <Button className="secondary-button" variant="outlined" fullWidth onClick={onResetGame}>
            Reset
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}