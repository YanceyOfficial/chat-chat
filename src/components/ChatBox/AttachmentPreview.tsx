import { useAtom } from 'jotai'
import { FC } from 'react'
import { base64FilePromptAtom } from 'src/stores/conversation'
import { SolidCloseIcon } from '../Icons'

interface Props {
  className?: string
}

const AttachmentPreview: FC<Props> = ({ className }) => {
  const [base64FilePrompt, setBase64FilePrompt] = useAtom(base64FilePromptAtom)

  const deleteBase64FilePrompt = (id: string) => {
    setBase64FilePrompt(base64FilePrompt.filter((prompt) => prompt.id !== id))
  }

  return (
    <section className={className}>
      {base64FilePrompt.map((prompt) => {
        if (prompt.mimeType.includes('image')) {
          return (
            <section
              className="mb-2 ml-4 mt-4 flex w-full flex-row gap-2"
              key={prompt.id}
            >
              <section className="group relative">
                <span className="absolute -right-2 -top-2 hidden rounded-full bg-white group-hover:block">
                  <SolidCloseIcon
                    className="h-6 w-6 text-black"
                    onClick={() => deleteBase64FilePrompt(prompt.id)}
                  />
                </span>
                <img
                  src={prompt.data}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              </section>
            </section>
          )
        }

        if (prompt.mimeType.includes('audio')) {
          return (
            <section
              className="ml-4 mt-4 flex w-1/2 rounded-3xl bg-main-purple"
              key={prompt.id}
            >
              <audio src={prompt.data} controls />
            </section>
          )
        }

        if (prompt.mimeType.includes('video')) {
          return (
            <section
              className="ml-4 mt-4 flex w-1/2 rounded-3xl bg-main-purple"
              key={prompt.id}
            >
              <video src={prompt.data} controls />
            </section>
          )
        }

        return (
          <section
            className="ml-4 mt-4 flex w-1/2 rounded-3xl bg-main-purple"
            key={prompt.id}
          >
            {prompt.name}
          </section>
        )
      })}
    </section>
  )
}

export default AttachmentPreview
