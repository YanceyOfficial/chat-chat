import {
  DocumentDuplicateIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { DateTime } from 'luxon'
import { FC, useState } from 'react'
import { useTTS } from 'src/hooks'
import { ContentPartType, Message, Roles } from 'src/types/conversation'

interface Props {
  message: Message
}

const ToolsBox: FC<Props> = ({ message: { createdAt, content, role } }) => {
  const [audioUrl, setAudioUrl] = useState('')
  const createSpeech = useTTS()

  const createTTSUrl = async () => {
    if (typeof createSpeech === 'function') {
      const textPrompt = content.find(
        (item) => item.type === ContentPartType.TextPrompt
      )

      if (textPrompt) {
        const url = await createSpeech(textPrompt.text)
        if (url) {
          setAudioUrl(url)
        }
      }
    }
  }

  return (
    <section
      className={
        'mt-2 flex items-center gap-2 text-xs text-black text-opacity-30 dark:text-dark-bubble-assistant-text dark:text-opacity-30'
      }
    >
      {role === Roles.Assistant && (
        <>
          <SpeakerWaveIcon
            className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white"
            onClick={createTTSUrl}
          />
          <DocumentDuplicateIcon className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white" />
        </>
      )}

      {DateTime.fromMillis(createdAt).toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}

      {audioUrl && <audio src={audioUrl} className="hidden" autoPlay />}
    </section>
  )
}

export default ToolsBox
