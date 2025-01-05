import { useAtomValue } from 'jotai'
import { FC } from 'react'
import configurations from 'src/configurations'
import { configurationAtom, conversationAtom } from 'src/stores/conversation'
import { companyAtom } from 'src/stores/global'

const TokenCount: FC = () => {
  const conversation = useAtomValue(conversationAtom)
  const company = useAtomValue(companyAtom)
  const configuration = useAtomValue(configurationAtom)
  const { models } = configurations[company]
  const { maxInput } =
    models.find((m) => m.modelName === configuration.model) ?? {}
  const usedTokenCount =
    conversation?.messages.reduce((acc, val) => acc + val.tokenCount, 0) +
    configuration.systemMessageTokensCount

  return (
    <p className="absolute -bottom-5 right-0 text-10 text-black text-opacity-30 dark:text-dark-text-sub">
      Token count: {usedTokenCount} / {maxInput}
    </p>
  )
}

export default TokenCount
