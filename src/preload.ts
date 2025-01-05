// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import {
  SaveFileToAppDataDirRequest,
  SaveFileToAppDataDirResponse,
  SaveFileWithDialogRequest,
  SaveFileWithDialogResponse,
  TransformFilenameToSrcRequest,
  TransformFilenameToSrcResponse
} from 'src/ipc'
import { init } from './db'
import { BRIDGE_NAME, IPC_NAMES } from './shared/constants'

init()

contextBridge.exposeInMainWorld(BRIDGE_NAME, {
  saveFileWithDialog: (
    request: SaveFileWithDialogRequest
  ): Promise<SaveFileWithDialogResponse> =>
    ipcRenderer.invoke(IPC_NAMES.saveFileWithDialog, request),
  saveFileToAppDataDir: (
    request: SaveFileToAppDataDirRequest
  ): Promise<SaveFileToAppDataDirResponse> =>
    ipcRenderer.invoke(IPC_NAMES.saveFileToAppDataDir, request),
  transformFilenameToSrc: (
    request: TransformFilenameToSrcRequest
  ): Promise<TransformFilenameToSrcResponse> =>
    ipcRenderer.invoke(IPC_NAMES.transformFilenameToSrc, request)
})
