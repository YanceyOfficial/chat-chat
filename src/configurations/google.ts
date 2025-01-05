import { Configuration } from 'src/types/conversation'
import { Companies } from 'src/types/global'

export const models = [
  { modelName: 'gemini-2.0-flash-exp', maxInput: 1048576, maxOutput: 8192 },
  { modelName: 'gemini-1.5-flash', maxInput: 1048576, maxOutput: 8192 },
  { modelName: 'gemini-1.5-flash-8b', maxInput: 128000, maxOutput: 4096 },
  { modelName: 'gemini-1.5-pro', maxInput: 2097152, maxOutput: 8192 }
]

export const configuration: Configuration = {
  company: Companies.Google,
  model: 'gemini-2.0-flash-exp',
  systemMessage: 'You are an AI assistant that helps people find information.',
  maxResponse: 8192,
  temperature: 1,
  topP: 0.95,
  stop: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemMessageTokensCount: 11
}
