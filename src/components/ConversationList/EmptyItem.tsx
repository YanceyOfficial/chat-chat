import { FC } from 'react'
import { OutlinePlusIcon } from 'src/components/Icons'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import ItemWrapper from './ItemWrapper'

interface Props {
  onClick: () => void
}

const EmptyItem: FC<Props> = ({ onClick }) => {
  return (
    <ItemWrapper
      onClick={onClick}
      active
      className="items-center justify-center"
    >
      <p className="mr-4 font-bold dark:text-dark-text">{EMPTY_CHAT_HINT}</p>
      <OutlinePlusIcon />
    </ItemWrapper>
  )
}

export default EmptyItem
