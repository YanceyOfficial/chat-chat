import { isAxiosError } from 'axios'
import produce from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { openai } from 'src/openai'
import { generateEmptyMessage } from 'src/shared/utils'
import {
  currConversationIdState,
  currConversationState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { errorAlertState } from 'src/stores/global'
import { OpenAIError } from 'src/types/global'
import useModifyDocument from './useModifyDocument'

const useModeration = (
  question: string,
  setQuestion: Dispatch<SetStateAction<string>>,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const { modifyDocument } = useModifyDocument()

  const createModeration = async () => {
    if (summaryInputVisible) return
    if (loading) return
    if (question.trim().length === 0) return

    setLoading(true)

    // Append an empty message object to show loading spin.
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (draft) {
          draft.messages.push(generateEmptyMessage(question))
        }
      })

      return currState
    })

    setQuestion('')

    try {
      const moderation = await openai.createModeration({
        input: question
      })

      const content = `\`\`\`json \n${JSON.stringify(
        moderation.data,
        null,
        2
      )}\n\`\`\``

      setCurrConversation((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            const messages = draft.messages
            const last = messages[messages.length - 1]
            last.message_id = moderation.data.id
            last.answer = content
            last.answer_created_at = +new Date()
          }
        })

        modifyDocument(
          {
            // @ts-ignore
            conversation_id: currConversationId
          },
          {
            messages: currState?.messages
          }
        )

        return currState
      })

      showScrollToBottomBtn()
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        setErrorAlertState({
          code: error.response?.status || 0,
          message: error.response?.data.error.message || ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, createModeration }
}

export default useModeration
