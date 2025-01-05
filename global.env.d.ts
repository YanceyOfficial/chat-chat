import { IElectronAPI } from 'src/ipc'

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
