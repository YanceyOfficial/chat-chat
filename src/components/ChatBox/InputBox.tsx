import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { useChatCompletion } from 'src/hooks'
import { base64FilePromptAtom, inputTextAtom } from 'src/stores/conversation'
import { loadingAtom, settingsAtom } from 'src/stores/global'
import { ContentPartType, TextPrompt } from 'src/types/conversation'
import { LoadingIcon, SolidSendIcon } from '../Icons'
import AttachmentPreview from './AttachmentPreview'
import AttachmentUploader from './AttachmentUploader'
import AudioRecorder from './Recorder'
import TokenCount from './TokenCount'

const InputBox: FC = () => {
  const settings = useAtomValue(settingsAtom)
  const loading = useAtomValue(loadingAtom)
  const [inputText, setInputText] = useAtom(inputTextAtom)
  const createChatCompletion = useChatCompletion()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [base64FilePrompt, setBase64FilePrompt] = useAtom(base64FilePromptAtom)

  const resetInput = () => {
    setInputText('')
    setBase64FilePrompt([])
  }

  const validate = () => {
    if (loading) return false
    return inputText.trim().length !== 0
  }

  // FIXME: I cannot declare the type of `event` correctly.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()

      const start = event.target.selectionStart
      const end = event.target.selectionEnd
      const value = event.target.value

      setInputText(value.substring(0, start) + '\n' + value.substring(end))
      event.target.selectionStart = event.target.selectionEnd = start + 1
    }

    if (event.key === 'Enter' && !event.shiftKey && !isTyping) {
      event.preventDefault()
      handleRequest()
    }
  }

  const handleRequest = () => {
    if (!settings || !validate()) return

    const textPrompt: TextPrompt[] = [
      {
        type: ContentPartType.TextPrompt,
        text: inputText
      }
    ]

    createChatCompletion([...textPrompt, ...base64FilePrompt])
    resetInput()
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`
    }
  }, [inputText])

  return (
    <section className="absolute bottom-6 left-6 w-[calc(100%_-_3rem)] rounded-md border border-black/10 bg-white dark:bg-gray-700">
      <AttachmentUploader className="absolute bottom-3 left-4" />
      <AttachmentPreview />

      <textarea
        ref={textareaRef}
        className={classNames(
          'block w-full resize-none rounded-md bg-white px-4 py-3 pl-12 pr-20 text-sm text-black outline-none dark:border-gray-900/50 dark:bg-gray-700 dark:text-white'
        )}
        style={{
          resize: 'none',
          bottom: `${textareaRef?.current?.scrollHeight}px`,
          maxHeight: '400px',
          overflow: `${
            textareaRef.current && textareaRef.current.scrollHeight > 400
              ? 'auto'
              : 'hidden'
          }`
        }}
        placeholder="Type a message..."
        value={inputText}
        rows={1}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <section className="absolute bottom-[2px] right-4 flex items-center">
        <AudioRecorder />

        {loading ? (
          <LoadingIcon className="h-5 w-5 animate-spin text-main-purple" />
        ) : (
          <SolidSendIcon
            onClick={handleRequest}
            pathClassName={classNames(
              'fill-current',
              {
                'text-black dark:text-white text-opacity-30': !validate()
              },
              {
                'text-main-purple dark:text-main-purple text-opacity-100':
                  validate()
              }
            )}
          />
        )}
      </section>
      <TokenCount />
    </section>
  )
}

export default memo(InputBox)
