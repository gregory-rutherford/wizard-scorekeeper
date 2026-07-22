import { NumberStepper } from './NumberStepper'

type PlayerNumberInputProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function PlayerNumberInput({ value, onChange, disabled = false }: PlayerNumberInputProps) {
  return (
    <NumberStepper
      label="Players"
      value={value}
      min={2}
      max={8}
      helperText="Wizard works best with 2 to 8 players on the table."
      onChange={onChange}
      disabled={disabled}
    />
  )
}