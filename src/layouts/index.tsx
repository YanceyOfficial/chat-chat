import { ThemeProvider } from '@mui/material/styles'
import { useAtomValue } from 'jotai'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import Loading from 'src/components/Loading'
import Sidebar from 'src/components/Sidebar'
import Conversation from 'src/containers/Conversation'
import Settings from 'src/containers/Settings'
import { useInitial, useOnline, useTheme } from 'src/hooks'
import {
  SNACKBAR_ANCHOR_ORIGIN,
  SNACKBAR_AUTO_HIDE_DURATION,
  SNACKBAR_MAX_NUM
} from 'src/shared/constants'
import { configurationAtom } from 'src/stores/conversation'
import { settingsAtom } from 'src/stores/global'

const Layouts: FC = () => {
  const configuration = useAtomValue(configurationAtom)
  const settings = useAtomValue(settingsAtom)
  const { muiTheme } = useTheme()
  useOnline()
  useInitial()

  if (!configuration || !settings) return <Loading />

  return (
    <ThemeProvider theme={muiTheme}>
      <SnackbarProvider
        maxSnack={SNACKBAR_MAX_NUM}
        anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        preventDuplicate
        hideIconVariant
        style={{
          maxWidth: 500
        }}
      >
        <section className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
          <Sidebar />
          <Conversation />
          <Settings />
        </section>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default Layouts
