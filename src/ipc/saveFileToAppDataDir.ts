import { app } from 'electron'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { generateHashedFilename } from 'src/shared/utils'

export interface Request {
  arrayBuffer: ArrayBuffer
  filename: string
}

export interface Response {
  success: boolean
  filename: string
  error?: string
}

const saveFileToAppDataDir = async (
  event: Electron.IpcMainInvokeEvent,
  { arrayBuffer, filename: originFilename }: Request
): Promise<Response> => {
  const filename = generateHashedFilename(originFilename)
  const appDataPath = path.join(app.getPath('home'), '.hyperchat', 'data')
  const filePath = path.join(appDataPath, filename)

  if (!existsSync(appDataPath)) {
    mkdirSync(appDataPath, { recursive: true })
  }

  writeFileSync(filePath, Buffer.from(arrayBuffer), 'utf8')

  return { success: true, filename }
}

export default saveFileToAppDataDir
