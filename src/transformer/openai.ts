import {
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartInputAudio,
  ChatCompletionContentPartText,
  ChatCompletionMessageParam
} from 'openai/resources'
import { ContentPart, ContentPartType, Message } from 'src/types/conversation'

export const transformToOpenAI = (
  prompt: ContentPart
): ChatCompletionContentPart[] => {
  const content = prompt.map((item) => {
    if (item.type === ContentPartType.TextPrompt) {
      const part: ChatCompletionContentPartText = {
        type: 'text',
        text: item.text
      }

      return part
    }

    if (item.type === ContentPartType.Base64FilePromptType) {
      if (item.mimeType.includes('image')) {
        const part: ChatCompletionContentPartImage = {
          type: 'image_url',
          image_url: { url: item.data }
        }

        return part
      }
      if (item.mimeType.includes('audio')) {
        const part: ChatCompletionContentPartInputAudio = {
          type: 'input_audio',
          input_audio: {
            data: item.data,
            format: 'mp3'
          }
        }
        return part
      }
    }

    if (item.type === ContentPartType.UrlFileUrlPromptType) {
      if (item.mimeType.includes('image')) {
        const part: ChatCompletionContentPartImage = {
          type: 'image_url',
          image_url: { url: item.url }
        }

        return part
      }
    }
  })

  return content
}

export const transformContextToOpenAI = (
  messages: Message[]
): ChatCompletionMessageParam[] =>
  messages.map((message) => ({
    role: message.role,
    content: transformToOpenAI(message.content)
    // FIXME:
  })) as ChatCompletionMessageParam[]
