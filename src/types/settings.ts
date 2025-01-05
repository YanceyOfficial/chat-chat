import { Companies, ThemeMode } from './global'

export interface Settings {
  id: string
  company: Companies
  openaiSecretKey: string
  openaiOrganizationId: string
  openaiAuthorName: string
  googleSecretKey: string
  anthropicSecretKey: string
  themeMode: ThemeMode
  assistantAvatarFilename: string
}
