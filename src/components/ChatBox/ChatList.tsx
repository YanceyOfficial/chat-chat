import classNames from 'classnames'
import { FC, Fragment, RefObject } from 'react'
import { useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { useSettings } from 'src/hooks'
import { isAudioProduct } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import Waveform from '../Waveform'
import ChatBubble from './ChatBubble'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'

interface Props {
  currConversation?: Conversation
  chatBoxRef: RefObject<HTMLDivElement>
}

const ChatList: FC<Props> = ({ currConversation, chatBoxRef }) => {
  const loading = useRecoilValue(loadingState)
  const { settings } = useSettings()
  const currProduct = useRecoilValue(currProductState)
  const hasMessages = currConversation && currConversation.messages.length > 0

  return (
    <section
      className={classNames(
        'no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6',
        { 'flex items-center justify-center': !hasMessages }
      )}
      ref={chatBoxRef}
    >
      {hasMessages ? (
        <>
          {currConversation?.messages.map((message) => (
            <Fragment key={message.message_id}>
              <ChatBubble
                role="user"
                avatar=""
                date={message.question_created_at}
              >
                {isAudioProduct(currProduct) && message.file_name && (
                  <Waveform filename={message.file_name} />
                )}
                {message.question}
              </ChatBubble>
              <ChatBubble
                role="assistant"
                avatar={
                  settings?.assistant_avatar_filename
                    ? settings.assistant_avatar_filename
                    : ChatGPTLogoImg
                }
                date={message.answer_created_at}
              >
                {loading && !message.answer ? (
                  <MessageSpinner />
                ) : (
                  <Markdown raw={message.answer} />
                )}
              </ChatBubble>
            </Fragment>
          ))}
        </>
      ) : (
        <img
          src={NoDataIllustration}
          alt="NoDataIllustration"
          className="h-96 w-96 dark:opacity-80"
        />
      )}
    </section>
  )
}

export default ChatList
