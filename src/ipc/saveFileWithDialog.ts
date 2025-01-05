import { dialog } from 'electron'
import { writeFileSync } from 'fs'

export interface Request {
  title: string
  filename: string
  extension: string
  text: string
}

export interface Response {
  success: boolean
  filePath?: string
  error?: string
}

const saveFileWithDialog = async (
  event: Electron.IpcMainInvokeEvent,
  { title, filename, extension, text }: Request
): Promise<Response> => {
  const { filePath } = await dialog.showSaveDialog({
    title,
    filters: [{ name: `${filename}.${extension}`, extensions: [extension] }],
    defaultPath: `${filename}.${extension}`
  })

  if (filePath) {
    try {
      writeFileSync(filePath, text, 'utf8')
      return { success: true, filePath }
    } catch (error) {
      return { success: false, error: error.message }
    }
  } else {
    return { success: false, error: 'Save operation cancelled' }
  }
}

export default saveFileWithDialog
