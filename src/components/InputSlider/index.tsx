import { InformationCircleIcon } from '@heroicons/react/20/solid'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react'

interface Props {
  title: string
  tooltipTitle: string
  min: number
  max: number
  step: number
  defaultValue: number
  setFieldValue: (value: number) => void
}

const InputSlider: FC<Props> = ({
  title,
  tooltipTitle,
  min,
  max,
  step,
  defaultValue,
  setFieldValue
}) => {
  const [value, setValue] = useState<number>(defaultValue)

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue)
    }
  }

  const handleSliderChangeCommitted = (
    _: Event | SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => {
    if (typeof newValue === 'number') {
      setFieldValue(newValue)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(
      event.target.value === '' ? defaultValue : Number(event.target.value)
    )
  }

  const handleBlur = () => {
    let newValue = value

    if (value < min) {
      newValue = min
      setValue(min)
    } else if (value > max) {
      newValue = max
      setValue(max)
    }

    setFieldValue(newValue)
  }

  useEffect(() => {
    setValue((prev) => (prev > defaultValue ? defaultValue : prev))
  }, [defaultValue])

  return (
    <section className="my-8 flex flex-col">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <p className="text-sm font-bold dark:text-dark-text">{title}</p>
          <Tooltip title={tooltipTitle} placement="top">
            <IconButton>
              <InformationCircleIcon className="h-4 w-4 text-black dark:text-white" />
            </IconButton>
          </Tooltip>
        </div>

        <TextField
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              step,
              min,
              max
            }
          }}
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          size="small"
          sx={{
            width: 100
          }}
        />
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={typeof value === 'number' ? value : defaultValue}
        onChangeCommitted={handleSliderChangeCommitted}
        onChange={handleSliderChange}
      />
    </section>
  )
}

export default InputSlider
