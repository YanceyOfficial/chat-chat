import { atom } from 'jotai'
import { themeModeToTheme } from 'src/shared/utils'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'

export const settingsAtom = atom<Settings | undefined>(undefined)

export const onlineAtom = atom(window.navigator.onLine)

export const themeAtom = atom<ThemeMode.dark | ThemeMode.light>(
  themeModeToTheme()
)

export const companyAtom = atom<Companies>(
  (window.localStorage.getItem('$$hyperchat-company') as
    | Companies
    | undefined) ?? Companies.OpenAI
)

export const loadingAtom = atom(false)

export const settingsDialogVisibleAtom = atom(false)

export const customBotAvatarUrlAtom = atom('')
