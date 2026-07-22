import { NumberStepper } from './NumberStepper'

type RoundCountInputProps = {
  value: number
  onChange: (value: number) => void
  helperText: string
  disabled?: boolean
}

export function RoundCountInput({ value, onChange, helperText, disabled = false }: RoundCountInputProps) {
  return (
    <NumberStepper
      label="Rounds"
      value={value}
      min={1}
      max={20}
      helperText={helperText}
      onChange={onChange}
      disabled={disabled}
      hideIncrement={true}
      hideDecrement={true}
    />
  )
}