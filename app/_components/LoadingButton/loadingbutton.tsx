import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

interface Props extends ButtonProps {
  loading?: boolean
  type?: 'submit'
  label: string
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

const LoadingButton = ({
  loading = false,
  type,
  label,
  onClick = undefined,
  disabled,
  ...rest
}: Props) => {
  return (
    <Button
      variant="contained"
      size="large"
      color="secondary"
      disabled={disabled}
      {...(loading && { disabled: true })}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {label}
      {loading && <CircularProgress size={20} className="ml-4" />}
    </Button>
  )
}

export default LoadingButton
