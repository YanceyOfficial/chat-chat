import { encodingForModel, TiktokenModel } from 'js-tiktoken'
import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'
import {
  Base64FilePrompt,
  ContentPart,
  ContentPartType,
  Message,
  Roles
} from 'src/types/conversation'
import { RequestError, ThemeMode } from 'src/types/global'
import { v4 } from 'uuid'
import { getFileExtension } from 'yancey-js-util'

export const formatDate = (millis: number) => {
  const now = DateTime.now()
  const date = DateTime.fromMillis(millis)

  if (now.hasSame(date, 'day')) {
    return {
      isSameDay: true,
      display: date.toLocaleString(DateTime.TIME_24_SIMPLE)
    }
  }

  return { isSameDay: false, display: date.toLocaleString(DateTime.DATE_MED) }
}

export const generateHashedFilename = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const filename = `${v4()}_${+new Date()}.${extension}`

  return filename
}

export const themeModeToTheme = (themeMode?: ThemeMode) =>
  themeMode === ThemeMode.system || !themeMode
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.dark
      : ThemeMode.light
    : themeMode

export const getTokensCount = (content: string, model: TiktokenModel) =>
  encodingForModel(model).encode(content).length

export const showRequestErrorToast = (e?: RequestError | unknown) =>
  enqueueSnackbar(
    (e as RequestError)?.message ??
      (e as RequestError)?.name ??
      'Request failed.',
    {
      variant: 'error'
    }
  )

export const convertToBase64 = (file: File): Promise<Base64FilePrompt> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve({
        id: v4(),
        name: file.name,
        data: fileReader.result as string,
        mimeType: file.type,
        type: ContentPartType.Base64FilePromptType
      })
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export const checkUserPromptTokensCountIsValid = (
  systemMessageTokenCount: number,
  tokenLimit: number,
  userMessageTokenCount: number
) => {
  if (userMessageTokenCount > tokenLimit - systemMessageTokenCount) {
    enqueueSnackbar(
      `This model's maximum context length is ${tokenLimit} tokens. However, you requested ${userMessageTokenCount + systemMessageTokenCount} tokens. Please reduce the length of the prompt.`,
      { variant: 'error' }
    )

    return
  }
}

export const computeContext = (tokenLimit: number, messages: Message[]) => {
  let totalTokensCount = 0
  const context: Message[] = []

  for (const message of messages.toReversed()) {
    if (totalTokensCount + message.tokenCount > tokenLimit) {
      break
    } else {
      totalTokensCount += message.tokenCount
      context.unshift(message)
    }
  }

  while (context[0]?.role === Roles.Assistant) {
    context.shift()
  }

  return context
}

export const collectOpenAiPrompt = (userPrompt: ContentPart) => {
  let text = ''

  userPrompt.forEach((item) => {
    if (item.type === ContentPartType.TextPrompt) {
      text += item.text
    }
    if (item.type === ContentPartType.Base64FilePromptType) {
      text += item.data
    }
    if (item.type === ContentPartType.UrlFileUrlPromptType) {
      text += item.url
    }
  })

  return text
}

export const countTokensV2 = () => {}
