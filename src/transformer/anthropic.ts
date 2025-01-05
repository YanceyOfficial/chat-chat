import {
  ImageBlockParam,
  MessageParam,
  TextBlockParam
} from '@anthropic-ai/sdk/resources'
import { ContentPart, ContentPartType, Message } from 'src/types/conversation'

export const transformToAnthropic = (
  prompt: ContentPart
): MessageParam['content'] => {
  const content = prompt.map((item) => {
    if (item.type === ContentPartType.TextPrompt) {
      const part: TextBlockParam = {
        type: 'text',
        text: item.text
      }

      return part
    }

    if (item.type === ContentPartType.Base64FilePromptType) {
      if (
        !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          item.mimeType
        )
      ) {
        return
      }

      const part: ImageBlockParam = {
        type: 'image',
        source: {
          type: 'base64',
          media_type: item.mimeType as ImageBlockParam['source']['media_type'],
          data: item.data
        }
      }

      return part
    }
  })

  return content
}

export const transformContextToAnthropic = (
  messages: Message[]
): MessageParam[] =>
  messages.map((message) => ({
    role: message.role as MessageParam['role'],
    content: transformToAnthropic(message.content)
  }))
