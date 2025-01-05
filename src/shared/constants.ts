import { SnackbarOrigin } from '@mui/material'

export const EMPTY_CHAT_HINT = 'Create your first conversation!'

export const BAN_ACTIVE_HINT = 'Please wait your request is being processed!'

export const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left'
}

export const SNACKBAR_MAX_NUM = 1

export const SNACKBAR_AUTO_HIDE_DURATION = 3000

export const BRIDGE_NAME = 'electronAPI'

export const IPC_NAMES = {
  saveFileWithDialog: 'save-file-with-dialog',
  saveFileToAppDataDir: 'save-file-to-app-data-dir',
  transformFilenameToSrc: 'transform-filename-to-src'
}
