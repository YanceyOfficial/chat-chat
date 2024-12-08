import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { marked, Tokens } from 'marked'
import { FC, memo, useCallback } from 'react'

interface Props {
  raw: string
}

const Markdown: FC<Props> = ({ raw }) => {
  const parseMarkdown = useCallback(() => {
    const renderer = new marked.Renderer()

    renderer.code = ({ text, lang }: Tokens.Code) => {
      const language = lang && lang.split(/\s/)[0]

      if (language) {
        const highlighted =
          language && hljs.getLanguage(language)
            ? hljs.highlight(text, { language: language }).value
            : hljs.highlightAuto(text).value

        return `<pre class="-mx-4 my-3 overflow-x-scroll text-xs last:my-0"><code class="hljs ${language}">${highlighted}</code></pre>`
      } else {
        return `<code class="font-semibold">${text}</code>`
      }
    }

    renderer.image = ({ text, href }: Tokens.Image) => {
      return `<img src="${href}" alt="${text}" class="mb-3" loading="lazy" />`
    }

    renderer.link = ({ href, title, text }: Tokens.Link) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="font-bold underline">${text}</a>`
    }

    return marked(raw, {
      renderer
    })
  }, [raw])

  return (
    <section
      className="markdown"
      dangerouslySetInnerHTML={{ __html: parseMarkdown() }}
    />
  )
}

export default memo(
  Markdown,
  (prevProps, nextProps) => prevProps.raw === nextProps.raw
)
