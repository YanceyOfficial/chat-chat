import Anthropic, { AnthropicError } from '@anthropic-ai/sdk'
import { useAtomValue, useSetAtom } from 'jotai'
import { TiktokenModel } from 'js-tiktoken'
import { enqueueSnackbar } from 'notistack'
import configurations from 'src/configurations'
import { useClients, useStoreMessages } from 'src/hooks'
import {
  checkUserPromptTokensCountIsValid,
  collectOpenAiPrompt,
  computeContext,
  getTokensCount,
  showRequestErrorToast
} from 'src/shared/utils'
import { configurationAtom, conversationAtom } from 'src/stores/conversation'
import { companyAtom, loadingAtom } from 'src/stores/global'
import {
  transformContextToAnthropic,
  transformContextToGoogle,
  transformContextToOpenAI,
  transformToAnthropic,
  transformToGoogle,
  transformToOpenAI
} from 'src/transformer'
import { ContentPart, Roles } from 'src/types/conversation'
import { Companies } from 'src/types/global'

const useChatCompletion = () => {
  const { openAiClient, googleClient, anthropicClient } = useClients()
  const conversation = useAtomValue(conversationAtom)
  const company = useAtomValue(companyAtom)
  const configuration = useAtomValue(configurationAtom)
  const setLoading = useSetAtom(loadingAtom)
  const {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    updateChatCompletionStream
  } = useStoreMessages()
  const { models } = configurations[company]
  const {
    model,
    systemMessage,
    maxResponse,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    stop,
    systemMessageTokensCount
  } = configuration
  const { maxInput } = models.find((m) => m.modelName === model) ?? {}

  const createChatCompletionByOpenAI = async (userPrompt: ContentPart) => {
    const userPromptTokenCount = getTokensCount(
      collectOpenAiPrompt(userPrompt),
      model as TiktokenModel
    )

    checkUserPromptTokensCountIsValid(
      systemMessageTokensCount,
      maxInput,
      userPromptTokenCount
    )
    await saveUserMessage(userPrompt, userPromptTokenCount)

    const contexts = computeContext(
      maxInput - systemMessageTokensCount - userPromptTokenCount,
      conversation.messages
    )

    try {
      let assistantText = ''
      const events = await openAiClient.chat.completions.create({
        model,
        messages: [
          {
            role: Roles.System,
            content: systemMessage
          },
          ...transformContextToOpenAI(contexts),
          {
            role: Roles.User,
            content: transformToOpenAI(userPrompt)
          }
        ],
        max_completion_tokens: maxResponse,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stop,
        stream: true
      })

      if (events)
        for await (const event of events) {
          for (const choice of event.choices) {
            const { content } = choice.delta

            if (content) {
              assistantText += content
              updateChatCompletionStream(content)
            }

            if (choice.delta.refusal) {
              continue
            }
            if (choice.delta.refusal) {
              enqueueSnackbar(choice.delta.refusal, { variant: 'error' })
            }
          }
        }

      const assistantMessageTokenCount = getTokensCount(
        assistantText,
        model as TiktokenModel
      )
      saveAssistantMessage(assistantMessageTokenCount)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createChatCompletionByGoogle = async (userPrompt: ContentPart) => {
    const generativeModel = googleClient.getGenerativeModel({
      model,
      systemInstruction: systemMessage,
      generationConfig: {
        stopSequences: stop,
        maxOutputTokens: maxResponse,
        temperature,
        topP,
        frequencyPenalty,
        presencePenalty
      }
    })

    const { parts } = transformToGoogle(Roles.User, userPrompt)
    const { totalTokens: userPromptTokenCount } =
      await generativeModel.countTokens(parts)

    checkUserPromptTokensCountIsValid(
      systemMessageTokensCount,
      maxInput,
      userPromptTokenCount
    )
    await saveUserMessage(userPrompt, userPromptTokenCount)

    const contexts = computeContext(
      maxInput - systemMessageTokensCount - userPromptTokenCount,
      conversation.messages
    )

    let assistantMessageTokenCount = 0
    const chat = generativeModel.startChat({
      history: transformContextToGoogle(contexts)
    })
    const { stream } = await chat.sendMessageStream(parts)
    for await (const chunk of stream) {
      const chunkText = chunk.text()
      updateChatCompletionStream(chunkText)

      const { candidatesTokenCount } = chunk.usageMetadata
      if (candidatesTokenCount) {
        assistantMessageTokenCount = candidatesTokenCount
      }
    }

    saveAssistantMessage(assistantMessageTokenCount)
  }

  const createChatCompletionByAnthropic = async (userMessage: ContentPart) => {
    const userPrompt = {
      role: Roles.User as 'user' | 'assistant',
      content: transformToAnthropic(userMessage)
    }

    const { input_tokens: userPromptTokenCount } =
      await anthropicClient.beta.messages.countTokens({
        model,
        messages: [userPrompt]
      })
    await saveUserMessage(userMessage, userPromptTokenCount)

    const contexts = computeContext(
      maxInput - systemMessageTokensCount - userPromptTokenCount,
      conversation.messages
    )

    anthropicClient.messages
      .stream({
        model,
        system: systemMessage,
        max_tokens: maxResponse,
        temperature,
        top_p: topP,
        stop_sequences: stop,
        messages: [...transformContextToAnthropic(contexts), userPrompt]
      })
      .on('text', (textDelta) => {
        updateChatCompletionStream(textDelta || '')
      })
      .on('finalMessage', (message) => {
        const { usage } = message
        saveAssistantMessage(usage.output_tokens)
      })
      .on('error', (error: AnthropicError) => {
        if (error instanceof Anthropic.APIError) {
          enqueueSnackbar(`[${error.status}] ${error.message}`, {
            variant: 'error'
          })
        } else {
          throw error
        }
      })
  }

  const services = {
    [Companies.OpenAI]: createChatCompletionByOpenAI,
    [Companies.Anthropic]: createChatCompletionByAnthropic,
    [Companies.Google]: createChatCompletionByGoogle
  }

  return services[company]
}

export default useChatCompletion
