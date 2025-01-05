export type Dict = { [index: string]: string }

export interface SvgIconProps {
  width?: number
  height?: number
  className?: string
  pathClassName?: string
  onClick?: () => void
}

export enum Companies {
  OpenAI = 'OpenAI',
  Google = 'Google',
  Anthropic = 'Anthropic'
}

export interface EmojiPickerProps {
  emoticons: string[]
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
}

export enum ThemeMode {
  light = 'light',
  system = 'system',
  dark = 'dark'
}

export interface RequestError {
  status: number
  name: string
  code: string
  message: string
}
