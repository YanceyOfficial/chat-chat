import { createTheme } from '@mui/material/styles'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { themeModeToTheme } from 'src/shared/utils'
import { settingsAtom, themeAtom } from 'src/stores/global'
import { ThemeMode } from 'src/types/global'
import useSettings from './useSettings'

const useTheme = () => {
  const settings = useAtomValue(settingsAtom)
  const { updateSettings } = useSettings()
  const [theme, setTheme] = useAtom(themeAtom)

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: '#615ef0'
          }
        },
        typography: {
          button: {
            textTransform: 'none'
          }
        },
        shape: {
          borderRadius: 8
        }
      }),
    [theme, settings]
  )

  const setThemeClass = (currTheme: ThemeMode.light | ThemeMode.dark) => {
    if (currTheme === ThemeMode.dark) {
      document.documentElement.classList.add(ThemeMode.dark)
    } else {
      document.documentElement.classList.remove(ThemeMode.dark)
    }
  }

  const setThemeStateAndClass = (newTheme?: ThemeMode) => {
    const currTheme = themeModeToTheme(newTheme || settings?.themeMode)
    setTheme(currTheme)
    setThemeClass(currTheme)
  }

  const toggleTheme = (newTheme: ThemeMode) => {
    setThemeStateAndClass(newTheme)

    if (settings) {
      updateSettings({ ...settings, themeMode: newTheme })
    }
  }

  const onSystemThemeChange = (e: MediaQueryListEvent) => {
    if (settings?.themeMode !== ThemeMode.system) return
    setThemeStateAndClass()
  }

  useEffect(() => {
    setThemeStateAndClass()
  }, [settings])

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme:dark)')
      .addEventListener('change', onSystemThemeChange)

    return () =>
      window
        .matchMedia('(prefers-color-scheme:dark)')
        .removeEventListener('change', onSystemThemeChange)
  }, [settings])

  return { theme, muiTheme, toggleTheme }
}

export default useTheme
