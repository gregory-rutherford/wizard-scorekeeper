import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { GameState } from '../types/game'

type ScoreboardCardProps = {
  gameState: GameState
}

export function ScoreboardCard({ gameState }: ScoreboardCardProps) {
  return (
    <Card className="retro-card scoreboard-card">
      <CardContent>
        <Typography className="section-label" variant="overline" component="p">
          Scoreboard
        </Typography>
        <Typography className="card-title" component="h2">
          Running totals
        </Typography>

        {gameState.players.length > 0 ? (
          <div className="scoreboard-table-wrap">
            <Table className="scoreboard-table" size="small" aria-label="Wizard scoreboard">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Last bid</TableCell>
                  <TableCell align="right">Last tricks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameState.players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell component="th" scope="row">
                      {player.name}
                    </TableCell>
                    <TableCell align="right">{player.totalScore}</TableCell>
                    <TableCell align="right">{player.lastBid}</TableCell>
                    <TableCell align="right">{player.lastTricks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Typography className="empty-state" component="p">
            No scores yet. Start the game to build the table.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}