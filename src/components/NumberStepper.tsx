import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

type NumberStepperProps = {
  label: string
  value: number
  min: number
  max: number
  helperText: string
  onChange: (value: number) => void
  disabled?: boolean
  hideIncrement?: boolean
  hideDecrement?: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function NumberStepper({
  label,
  value,
  min,
  max,
  helperText,
  onChange,
  disabled = false,
  hideIncrement = false,
  hideDecrement = false,
}: NumberStepperProps) {
  const [displayValue, setDisplayValue] = useState(String(value))

  useEffect(() => {
    setDisplayValue(String(value))
  }, [value])

  const updateValue = (nextValue: number) => {
    onChange(clamp(nextValue, min, max))
  }

  const handleTextChange = (nextValue: string) => {
    if (nextValue === '') {
      setDisplayValue('')
      return
    }

    if (!/^\d+$/.test(nextValue)) {
      return
    }

    setDisplayValue(nextValue)
    updateValue(Number(nextValue))
  }

  const handleBlur = () => {
    if (displayValue === '') {
      setDisplayValue(String(value))
    }
  }

  return (
    <Box className="number-control">
      <Typography className="control-label" component="label">
        {label}
      </Typography>

      <Box className="number-stepper">
        {!hideDecrement && (
        <Button
          className="stepper-button"
          variant="outlined"
          onClick={() => updateValue(value - 1)}
          disabled={disabled || value <= min}
        >
          -
        </Button>
        )}
        <TextField
          className="stepper-input"
          type="text"
          value={displayValue}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={handleBlur}
          slotProps={{ htmlInput: { min, max, inputMode: 'numeric', pattern: '[0-9]*' } }}
          disabled={disabled}
          fullWidth
        />
        {!hideIncrement && (
        <Button
          className="stepper-button"
          variant="outlined"
          onClick={() => updateValue(value + 1)}
          disabled={disabled || value >= max}
        >
          +
        </Button>
        )}
      </Box>

      <Typography className="field-helper" component="p">
        {helperText}
      </Typography>
    </Box>
  )
}