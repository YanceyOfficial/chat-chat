import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import Button from '@mui/material/Button'
import Dexie from 'dexie'
import { exportDB, importDB } from 'dexie-export-import'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useRef } from 'react'

const ImportAndExportDexie: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const exportDatabase = async () => {
    try {
      const database = await new Dexie('hyperchat').open()
      const blob = await exportDB(database)
      const text = await blob.text()
      const filename = `dexie-export-${Date.now()}.json`

      window.electronAPI
        .saveFileWithDialog({
          title: `dexie-export-${Date.now()}`,
          filename: `dexie-export-${Date.now()}`,
          extension: 'json',
          text
        })
        .then((res) => {
          if (res.success) {
            enqueueSnackbar(
              `The ${filename} has been saved in your local Download Directory.`,
              { variant: 'success' }
            )
          }
        })
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      enqueueSnackbar(e?.toString(), { variant: 'error' })
    }
  }

  const importDatabase = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    try {
      await importDB(file)
      window.location.reload()
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      enqueueSnackbar(e?.message, { variant: 'error' })
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <section className="flex gap-4">
      <Button
        variant="contained"
        onClick={exportDatabase}
        startIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
      >
        Export Data
      </Button>
      <Button
        variant="contained"
        startIcon={<DocumentArrowUpIcon className="h-4 w-4" />}
        className="relative"
      >
        <input
          ref={inputRef}
          type="file"
          accept="*.json"
          className="absolute left-0 top-0 h-full w-full opacity-0"
          onChange={(e) => importDatabase(e)}
        />
        Import Data
      </Button>
    </section>
  )
}

export default ImportAndExportDexie
