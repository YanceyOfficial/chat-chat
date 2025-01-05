import {
  Content,
  FileDataPart,
  InlineDataPart,
  Part,
  TextPart
} from '@google/generative-ai'
import {
  ContentPart,
  ContentPartType,
  Message,
  Roles
} from 'src/types/conversation'

export const transformToGoogle = (
  role: Roles,
  prompt: ContentPart
): Content => {
  const parts: Part[] = prompt.map((item) => {
    if (item.type === ContentPartType.TextPrompt) {
      const part: TextPart = {
        text: item.text
      }

      return part
    }

    if (item.type === ContentPartType.Base64FilePromptType) {
      const part: InlineDataPart = {
        inlineData: {
          mimeType: item.mimeType,
          data: item.data.split(',')[1]
        }
      }

      return part
    }

    if (item.type === ContentPartType.UrlFileUrlPromptType) {
      const part: FileDataPart = {
        fileData: {
          mimeType: item.mimeType,
          fileUri: item.url
        }
      }
      return part
    }
  })

  return {
    role: role === Roles.Assistant ? 'model' : 'user',
    parts
  }
}

export const transformContextToGoogle = (messages: Message[]): Content[] =>
  messages.map((message) => {
    return transformToGoogle(message.role, message.content)
  })
