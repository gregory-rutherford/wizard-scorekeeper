import { TextField } from '@mui/material'

type PlayerNameInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PlayerNameInput({ label, value, onChange, disabled = false }: PlayerNameInputProps) {
  return (
    <TextField
      className="player-name-input"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      fullWidth
    />
  )
}