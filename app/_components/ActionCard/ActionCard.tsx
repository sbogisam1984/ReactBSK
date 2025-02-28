import React from 'react'
import styles from './styles.module.css'
import Button from '@mui/material/Button'

interface Props {
  content: string
  title: string
  action?: {
    title: string | undefined
    click: () => void
  }
}

const ActionCard = ({
  title = '',
  content = '',
  action = undefined,
}: Props) => {
  return (
    <section className={`${styles.actionCard}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className="flex flex-row items-center gap-1 max-md:flex-col">
        <p className={styles.content}>{content}</p>
        {action && (
          <Button
            variant="contained"
            size="large"
            className="ml-8 max-md:mt-8"
            onClick={() => action?.click?.()}
          >
            {action.title}
          </Button>
        )}
      </div>
    </section>
  )
}

export default ActionCard
