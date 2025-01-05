import { Configuration } from 'src/types/conversation'
import { Companies } from 'src/types/global'

export const models = [
  {
    modelName: 'claude-3-5-sonnet-latest',
    maxInput: 2000000,
    maxOutput: 8192
  },
  {
    modelName: 'claude-3-5-haiku-latest',
    maxInput: 2000000,
    maxOutput: 8192
  },
  { modelName: 'claude-3-opus-latest', maxInput: 2000000, maxOutput: 4096 },
  {
    modelName: 'claude-3-sonnet-20240229',
    maxInput: 2000000,
    maxOutput: 4096
  },
  { modelName: 'claude-3-haiku-20240307', maxInput: 2000000, maxOutput: 4096 }
]

export const configuration: Configuration = {
  company: Companies.Anthropic,
  model: 'claude-3-5-sonnet-latest',
  systemMessage: 'You are an AI assistant that helps people find information.',
  maxResponse: 8192,
  temperature: 1,
  topP: 0.95,
  stop: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemMessageTokensCount: 11
}
