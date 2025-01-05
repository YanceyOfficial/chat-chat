import { produce, WritableDraft } from 'immer'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useDB } from 'src/hooks'
import { conversationAtom } from 'src/stores/conversation'
import {
  ContentPart,
  ContentPartType,
  Message,
  Roles,
  TextPrompt
} from 'src/types/conversation'
import { v4 } from 'uuid'

const useStoreMessages = () => {
  const { updateOneById } = useDB('conversations')
  const [conversation, setConversation] = useAtom(conversationAtom)

  // If a stream chat completion request fails, delete it in the user interface.
  const rollbackMessage = () => {
    if (!conversation) return

    setConversation((prevState) =>
      produce(prevState, (draft) => {
        if (!draft) return
        draft.messages.pop()
      })
    )
  }

  const updateChatCompletionStream = (token?: string) => {
    if (!conversation) return

    setConversation((prevState) =>
      produce(prevState, (draft) => {
        if (!draft) return

        const { role, content } = draft.messages[draft.messages.length - 1]

        if (role !== Roles.Assistant) {
          if (token) {
            const message: Message = {
              id: v4(),
              role: Roles.Assistant,
              content: [{ type: ContentPartType.TextPrompt, text: token }],
              tokenCount: 0,
              createdAt: +new Date()
            }
            draft.messages.push(message)
          }
        } else {
          // Assume assistant always returns text
          const textContent = content[0] as WritableDraft<TextPrompt>
          textContent.text += token
        }
      })
    )
  }

  const saveCommonAssistantMessage = useCallback(
    (content: TextPrompt[]) => {
      if (!conversation) return

      setConversation((prevState) => {
        const newConversation = produce(prevState, (draft) => {
          if (!draft) return
          const message: Message = {
            id: v4(),
            role: Roles.Assistant,
            content,
            tokenCount: 0,
            createdAt: +new Date()
          }
          draft.messages.push(message)
          draft.updatedAt = +new Date()
        })

        if (newConversation) {
          updateOneById(conversation.id, {
            messages: newConversation.messages,
            updatedAt: newConversation.updatedAt
          })
        }

        return newConversation
      })
    },
    [conversation]
  )

  const saveAssistantMessage = (assistantMessageTokenCount: number) => {
    if (!conversation) return

    setConversation((prevState) => {
      const newConversation = produce(prevState, (draft) => {
        if (!draft) return
        const lastMessage = draft.messages[draft.messages.length - 1]

        if (lastMessage.role === Roles.Assistant) {
          lastMessage.tokenCount = assistantMessageTokenCount
        }
        draft.updatedAt = +new Date()
      })

      if (newConversation) {
        updateOneById(conversation.id, {
          messages: newConversation.messages,
          updatedAt: newConversation.updatedAt
        })
      }

      return newConversation
    })
  }

  const saveUserMessage = async (content: ContentPart, tokenCount: number) => {
    if (!conversation) return

    const message: Message = {
      id: v4(),
      role: Roles.User,
      content,
      tokenCount,
      createdAt: +new Date()
    }

    const newConversations = produce(conversation, (draft) => {
      draft.messages.push(message)
      draft.updatedAt = +new Date()
    })

    setConversation(newConversations)

    await updateOneById(conversation.id, {
      messages: newConversations.messages,
      updatedAt: newConversations.updatedAt
    })
  }

  return {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    saveCommonAssistantMessage,
    updateChatCompletionStream
  }
}

export default useStoreMessages
