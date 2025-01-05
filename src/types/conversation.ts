import { Companies } from './global'

export enum Roles {
  System = 'system',
  Assistant = 'assistant',
  User = 'user'
}

export enum ContentPartType {
  Base64FilePromptType,
  UrlFileUrlPromptType,
  TextPrompt
}

export interface Base64FilePrompt {
  id: string
  name: string
  type: ContentPartType.Base64FilePromptType
  data: string
  mimeType: string
}

export interface UrlFileUrlPrompt {
  id: string
  name: string
  type: ContentPartType.UrlFileUrlPromptType
  url: string
  mimeType: string
}

export interface TextPrompt {
  type: ContentPartType.TextPrompt
  text: string
}

export type ContentPart = (Base64FilePrompt | UrlFileUrlPrompt | TextPrompt)[]

export interface Message {
  id: string
  role: Roles
  content: ContentPart
  tokenCount: number
  createdAt: number
}

export interface Configuration {
  company: Companies
  model: string
  systemMessage: string
  maxResponse: number
  temperature: number
  topP: number
  stop: string[]
  frequencyPenalty: number
  presencePenalty: number
  systemMessageTokensCount: number
}

export interface Conversation {
  id: string
  summary: string
  avatar: string
  createdAt: number
  updatedAt: number
  messages: Message[]
  company: Companies
}

export enum SpeechService {
  TTS = 'tts', // Text to Speech
  STT = 'stt' // Speech to Text
}
