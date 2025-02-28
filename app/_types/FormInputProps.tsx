import { Control, RegisterOptions } from 'react-hook-form'

export interface Option {
  label: string
  value: string
}

export interface FormInputProps {
  name: string
  defaultValue?: string
  defaultValues?: string[]
  defaultChecked?: boolean
  control?: Control
  label?: string
  rules?: RegisterOptions
  options?: Array<Option>
  option?: Option
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (val: any) => void
}
