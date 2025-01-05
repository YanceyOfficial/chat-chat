import { PaperClipIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useRef } from 'react'
import { convertToBase64 } from 'src/shared/utils'
import { base64FilePromptAtom } from 'src/stores/conversation'

interface Props {
  className?: string
}

const AttachmentUploader: FC<Props> = ({ className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [base64FilePrompt, setBase64FilePrompt] = useAtom(base64FilePromptAtom)

  const validate = () => true

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    try {
      const promises = []
      for (const file of files) {
        promises.push(convertToBase64(file))
      }

      const base64Files = await Promise.all(promises)
      setBase64FilePrompt([...base64FilePrompt, ...base64Files])
    } catch {
      enqueueSnackbar('Can not upload images.', { variant: 'error' })
    } finally {
      fileInputRef.current.files = null
    }
  }

  return (
    <section className={className}>
      <label
        htmlFor="$$file-input"
        className="relative flex cursor-pointer items-center"
      >
        <input
          type="file"
          id="$$file-input"
          className="absolute h-6 w-6 opacity-0 file:h-6 file:w-6"
          multiple
          ref={fileInputRef}
          onChange={onFileChange}
        />

        <PaperClipIcon
          className={classNames(
            'relative h-5 w-5',
            {
              'text-black text-opacity-30 dark:text-white': !validate()
            },
            {
              'text-main-purple text-opacity-100 dark:text-main-purple':
                validate()
            }
          )}
        />
      </label>
    </section>
  )
}

export default AttachmentUploader
