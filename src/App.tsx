import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { GameSetupCard } from './components/GameSetupCard'
import { RoundEntryCard } from './components/RoundEntryCard'
import { ScoreboardCard } from './components/ScoreboardCard'
import {
  calculateRoundScore,
  gameStateAtom,
  normalizeGameState,
  resetGame,
  setDraftTrump,
  setDraftValue,
  setPlayerName,
  setPlayerCount,
  setRoundCount,
  startGame,
  submitRound,
} from './state/game'
import jokerBig from './assets/jokerbig.png'
import wbig from './assets/wbig.png'
import './App.css'

function App() {
  const [storedGameState, setGameState] = useAtom(gameStateAtom)
  const gameState = normalizeGameState(storedGameState)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  const handlePlayerCountChange = (value: number) => {
    setGameState((state) => setPlayerCount(state, value))
  }

  const handleRoundCountChange = (value: number) => {
    setGameState((state) => setRoundCount(state, value))
  }

  const handlePlayerNameChange = (playerIndex: number, value: string) => {
    setGameState((state) => setPlayerName(state, playerIndex, value))
  }

  const handleStartGame = () => {
    setGameState((state) => startGame(state))
  }

  const handleResetGame = () => {
    setIsResetDialogOpen(true)
  }

  const handleCancelReset = () => {
    setIsResetDialogOpen(false)
  }

  const handleConfirmReset = () => {
    setGameState(resetGame())
    setIsResetDialogOpen(false)
  }

  const handleTrumpChange = (trump: typeof gameState.draft.trump) => {
    setGameState((state) => setDraftTrump(state, trump))
  }

  const handleBidChange = (playerIndex: number, value: number) => {
    setGameState((state) => setDraftValue(state, 'bids', playerIndex, value))
  }

  const handleTrickChange = (playerIndex: number, value: number) => {
    setGameState((state) => setDraftValue(state, 'tricks', playerIndex, value))
  }

  const handleSaveRound = () => {
    setIsSaveDialogOpen(true)
  }

  const handleCancelSave = () => {
    setIsSaveDialogOpen(false)
  }

  const handleConfirmSave = () => {
    setGameState((state) => submitRound(state))
    setIsSaveDialogOpen(false)
  }

  const roundPreviewRows = gameState.status === 'active'
    ? gameState.players.map((player, index) => {
        const bid = gameState.draft.bids[index] ?? 0
        const tricks = gameState.draft.tricks[index] ?? 0
        const roundScore = calculateRoundScore(bid, tricks)

        return {
          id: player.id,
          name: player.name,
          bid,
          tricks,
          roundScore,
          nextTotal: player.totalScore + roundScore,
        }
      })
    : []

  return (
    <>
      <CssBaseline />
      <Box className="app-shell">
        <Box className="app-frame">
          <header className="hero-panel">
            <Box className={gameState.status === 'setup' ? 'hero-setup-row' : 'hero-standard-row'}>
              {gameState.status === 'setup' ? (
                <img
                  className="setup-logo-art pixel-art"
                  src={wbig}
                  alt="Wizard joker W logo artwork"
                />
              ) : null}
              <Box className="hero-copy">
                <Typography className="eyebrow" variant="overline" component="p">
                  Wizard scorekeeper
                </Typography>
                <Typography className="title" component="h1">
                  Track the trump, bids, and totals.
                </Typography>
              </Box>

              {gameState.status === 'setup' ? (
                <img
                  className="setup-joker-art pixel-art"
                  src={jokerBig}
                  alt="Wizard joker card artwork"
                />
              ) : null}
            </Box>

            <Stack direction="row" spacing={1.5} className="hero-actions">
              <Button className="primary-button" variant="contained" onClick={handleResetGame}>
                Reset game
              </Button>
            </Stack>
          </header>

          <main className="content-grid">
            {gameState.status === 'setup' ? (
              <GameSetupCard
                status={gameState.status}
                playerCount={gameState.playerCount}
                roundCount={gameState.roundCount}
                playerNames={gameState.playerNames}
                onPlayerCountChange={handlePlayerCountChange}
                onRoundCountChange={handleRoundCountChange}
                onPlayerNameChange={handlePlayerNameChange}
                onStartGame={handleStartGame}
                onResetGame={handleResetGame}
              />
            ) : (
              <Box className="active-game-grid">
                <ScoreboardCard gameState={gameState} />
                <RoundEntryCard
                  gameState={gameState}
                  onTrumpChange={handleTrumpChange}
                  onBidChange={handleBidChange}
                  onTrickChange={handleTrickChange}
                  onSaveRound={handleSaveRound}
                  onResetGame={handleResetGame}
                />
              </Box>
            )}
          </main>

          <footer className="footer-note">
            <Typography component="p">Built for Steve McKean and Co. But all are welcome to use :)</Typography>
          </footer>
        </Box>

        <Dialog
          open={isResetDialogOpen}
          onClose={handleCancelReset}
          aria-labelledby="reset-game-title"
          aria-describedby="reset-game-description"
        >
          <DialogTitle id="reset-game-title">Reset the game?</DialogTitle>
          <DialogContent>
            <DialogContentText id="reset-game-description">
              This will clear the current game, round history, scores, and any in-progress setup changes.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="secondary-button" onClick={handleCancelReset}>
              Cancel
            </Button>
            <Button className="primary-button" onClick={handleConfirmReset} autoFocus>
              Reset game
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isSaveDialogOpen}
          onClose={handleCancelSave}
          aria-labelledby="save-round-title"
          aria-describedby="save-round-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="save-round-title">Save this round?</DialogTitle>
          <DialogContent>
            <DialogContentText id="save-round-description">
              Review the projected score changes before locking in the round.
            </DialogContentText>

            <Box className="preview-summary">
              <Typography className="preview-meta" component="p">
                Round {gameState.currentRound} of {gameState.roundCount} | Trump: {gameState.draft.trump}
              </Typography>
              <Box className="scoreboard-table-wrap preview-table-wrap">
                <Table className="scoreboard-table preview-table" size="small" aria-label="Round score preview">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell align="right">Bid</TableCell>
                      <TableCell align="right">Tricks</TableCell>
                      <TableCell align="right">Round</TableCell>
                      <TableCell align="right">After</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roundPreviewRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.bid}</TableCell>
                        <TableCell align="right">{row.tricks}</TableCell>
                        <TableCell align="right">{row.roundScore >= 0 ? `+${row.roundScore}` : row.roundScore}</TableCell>
                        <TableCell align="right">{row.nextTotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button className="secondary-button" onClick={handleCancelSave}>
              Cancel
            </Button>
            <Button className="primary-button" onClick={handleConfirmSave} autoFocus>
              Save round
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default App
