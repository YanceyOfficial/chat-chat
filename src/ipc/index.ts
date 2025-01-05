import saveFileToAppDataDir, {
  Request as SaveFileToAppDataDirRequest,
  Response as SaveFileToAppDataDirResponse
} from './saveFileToAppDataDir'
import saveFileWithDialog, {
  Request as SaveFileWithDialogRequest,
  Response as SaveFileWithDialogResponse
} from './saveFileWithDialog'
import transformFilenameToSrc, {
  Request as TransformFilenameToSrcRequest,
  Response as TransformFilenameToSrcResponse
} from './transformFilenameToSrc'

export {
  saveFileWithDialog,
  transformFilenameToSrc,
  saveFileToAppDataDir,
  SaveFileWithDialogRequest,
  SaveFileWithDialogResponse,
  TransformFilenameToSrcRequest,
  TransformFilenameToSrcResponse,
  SaveFileToAppDataDirRequest,
  SaveFileToAppDataDirResponse
}

export interface IElectronAPI {
  saveFileWithDialog: (
    params: SaveFileWithDialogRequest
  ) => Promise<SaveFileWithDialogResponse>
  transformFilenameToSrc: (
    params: TransformFilenameToSrcRequest
  ) => Promise<TransformFilenameToSrcResponse>
  saveFileToAppDataDir: (
    params: SaveFileToAppDataDirRequest
  ) => Promise<SaveFileToAppDataDirResponse>
}
