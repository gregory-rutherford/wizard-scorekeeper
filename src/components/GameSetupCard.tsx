import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { GameStatus } from '../types/game'
import { getStandardRoundCount } from '../state/game'
import { PlayerNumberInput } from './PlayerNumberInput'
import { PlayerNameInput } from './PlayerNameInput'
import { RoundCountInput } from './RoundCountInput'

type GameSetupCardProps = {
  status: GameStatus
  playerCount: number
  roundCount: number
  playerNames: string[]
  onPlayerCountChange: (value: number) => void
  onRoundCountChange: (value: number) => void
  onPlayerNameChange: (playerIndex: number, value: string) => void
  onStartGame: () => void
  onResetGame: () => void
}

const statusLabelByGameState: Record<GameStatus, string> = {
  setup: 'Setup',
  active: 'In progress',
  complete: 'Complete',
}

export function GameSetupCard({
  status,
  playerCount,
  roundCount,
  playerNames,
  onPlayerCountChange,
  onRoundCountChange,
  onPlayerNameChange,
  onStartGame,
  onResetGame,
}: GameSetupCardProps) {
  const isSetup = status === 'setup'
  const standardRoundCount = getStandardRoundCount(playerCount)
  const roundCountHelperText =
    standardRoundCount !== undefined
      ? `Wizard standard: ${playerCount} players = ${standardRoundCount} rounds. This is locked to the player count.`
      : 'Set a custom round count. Wizard standard round lengths are only defined for 3 to 6 players.'

  return (
    <Card className="retro-card setup-card">
      <CardContent>
        <Box className="card-header-row">
          <div>
            <Typography className="section-label" variant="overline" component="p">
              Match setup
            </Typography>
            <Typography className="card-title" component="h2">
              Start the table
            </Typography>
          </div>
          <Chip className="status-chip" label={statusLabelByGameState[status]} />
        </Box>

        <Typography className="card-copy" component="p">
          Set the player count and round count before starting. Once the game is active, the values lock until you reset.
        </Typography>

        <Stack spacing={2}>
          <PlayerNumberInput value={playerCount} onChange={onPlayerCountChange} disabled={!isSetup} />
          <RoundCountInput
            value={roundCount}
            onChange={onRoundCountChange}
            helperText={roundCountHelperText}
            disabled={!isSetup || standardRoundCount !== undefined}
          />
        </Stack>

        <Stack spacing={1.5} className="player-name-section">
          <Typography className="card-copy" component="p">
            Edit the player names before starting the game.
          </Typography>
          <div className="player-name-grid">
            {playerNames.map((playerName, index) => (
              <PlayerNameInput
                key={`setup-name-${index}`}
                label={`Player ${index + 1}`}
                value={playerName}
                onChange={(value) => onPlayerNameChange(index, value)}
                disabled={!isSetup}
              />
            ))}
          </div>
        </Stack>

        <Stack direction="row" spacing={1.5} className="action-row">
          <Button className="primary-button" variant="contained" fullWidth onClick={onStartGame} disabled={!isSetup}>
            Start game
          </Button>
          <Button className="secondary-button" variant="outlined" fullWidth onClick={onResetGame}>
            Reset
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}