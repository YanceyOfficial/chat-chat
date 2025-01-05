import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export interface Request {
  filename: string
}

export interface Response {
  success: boolean
  arrayBuffer?: ArrayBuffer
  error?: string
}

const transformFilenameToSrc = async (
  event: Electron.IpcMainInvokeEvent,
  { filename }: Request
): Promise<Response> => {
  try {
    const appDataPath = path.join(app.getPath('home'), '.hyperchat', 'data')
    const filePath = path.join(appDataPath, filename)
    const isExist = fs.existsSync(filePath)

    if (isExist) {
      const buffer = fs.readFileSync(filePath)
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.length
      )

      return { success: true, arrayBuffer }
    } else {
      throw new Error('')
    }
  } catch {
    throw new Error('')
  }
}

export default transformFilenameToSrc
