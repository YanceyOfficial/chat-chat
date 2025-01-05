import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/solid'
import Input from '@mui/material/Input'
import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { enqueueSnackbar } from 'notistack'
import { FC, KeyboardEvent, memo, useEffect, useState } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'
import { useDB } from 'src/hooks'
import { BAN_ACTIVE_HINT, EMPTY_CHAT_HINT } from 'src/shared/constants'
import {
  avatarPickerVisibleAtom,
  conversationAtom,
  summaryInputVisibleAtom
} from 'src/stores/conversation'
import { loadingAtom, onlineAtom } from 'src/stores/global'
import { EmojiPickerProps } from 'src/types/global'
import Avatar from '../Avatar'
import EmojiPicker from '../EmojiPicker'

const ContactHeader: FC = () => {
  const loading = useAtomValue(loadingAtom)
  const [conversation, setConversation] = useAtom(conversationAtom)
  const [summaryInputVisible, setSummaryInputVisible] = useAtom(
    summaryInputVisibleAtom
  )
  const [avatarPickerVisible, setAvatarPickerVisible] = useAtom(
    avatarPickerVisibleAtom
  )
  const isOnline = useAtomValue(onlineAtom)
  const [isTyping, setIsTyping] = useState(false)
  const [summaryValue, setSummaryValue] = useState(conversation?.summary || '')
  const { updateOneById, deleteOneById } = useDB('conversations')

  const summary = conversation?.summary || conversation?.id || EMPTY_CHAT_HINT

  const openAvatarPicker = () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    setAvatarPickerVisible(true)
  }

  const openSummaryInput = () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    if (!conversation) return
    setSummaryValue(conversation?.summary || '')
    setSummaryInputVisible(true)
  }

  const saveSummary = async () => {
    if (summaryValue.trim().length === 0) return

    if (conversation) {
      const changes = {
        summary: summaryValue,
        updatedAt: +new Date()
      }
      await updateOneById(conversation.id, changes)
      setConversation({ ...conversation, ...changes })
      setSummaryInputVisible(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      e.preventDefault()
      saveSummary()
    }
  }

  const saveAvatar = async (data: EmojiPickerProps) => {
    if (conversation) {
      const changes = {
        avatar: data.native,
        updatedAt: +new Date()
      }
      await updateOneById(conversation.id, changes)
      setConversation({ ...conversation, ...changes })
      setAvatarPickerVisible(false)
    }
  }

  const deleteCurrConversation = async () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    if (conversation) {
      await deleteOneById(conversation.id)
    }
  }

  useEffect(() => {
    setSummaryInputVisible(false)
    setAvatarPickerVisible(false)
  }, [conversation])

  return (
    <section className="relative flex items-start justify-between pb-5 pl-6 pr-6 pt-5">
      <section className="flex cursor-pointer items-center">
        {conversation?.avatar ? (
          <div
            className="flex items-center justify-center text-5xl"
            onClick={openAvatarPicker}
          >
            {conversation?.avatar}
          </div>
        ) : (
          <Avatar size="xs" src={HyperChatLogo} onClick={openAvatarPicker} />
        )}

        {avatarPickerVisible && <EmojiPicker onEmojiSelect={saveAvatar} />}

        <section className="ml-4 flex flex-col">
          <div className="mb-1 flex items-center font-bold text-black dark:text-dark-text">
            {summaryInputVisible ? (
              <>
                <Input
                  autoFocus
                  value={summaryValue}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSummaryValue(e.target.value)}
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                  className="w-80"
                  sx={{
                    '.MuiInput-input': {
                      padding: 0
                    }
                  }}
                />
                <CheckIcon className="h-4 w-4" onClick={saveSummary} />
              </>
            ) : (
              <div
                onClick={openSummaryInput}
                className="flex cursor-pointer items-center"
              >
                <p className="mr-4 text-base">{summary}</p>
                {!!conversation && <PencilSquareIcon className="h-4 w-4" />}
              </div>
            )}
          </div>

          <p className="flex items-center">
            <span
              className={classNames('mr-2 h-2.5 w-2.5 rounded-full', {
                'bg-red-500': !isOnline,
                'bg-status-green': isOnline
              })}
            />
            <span className="text-xs font-bold text-black text-opacity-60 dark:text-dark-text-sub">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </p>
        </section>
      </section>
      {conversation && (
        <section className="flex flex-row gap-2">
          <section
            className="flex cursor-pointer rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple"
            onClick={deleteCurrConversation}
          >
            <TrashIcon className="h-4 w-4" />
          </section>
        </section>
      )}
    </section>
  )
}

export default memo(ContactHeader)
