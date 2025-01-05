import { atom } from 'jotai'
import {
  Base64FilePrompt,
  Configuration,
  Conversation
} from 'src/types/conversation'

export const conversationAtom = atom<Conversation | undefined>(undefined)

export const summaryInputVisibleAtom = atom(false)

export const avatarPickerVisibleAtom = atom(false)

export const currPlayingAudioIdAtom = atom<string | undefined>(undefined)

export const inputTextAtom = atom('')

export const base64FilePromptAtom = atom<Base64FilePrompt[]>([])

export const configurationAtom = atom<Configuration | undefined>(undefined)
