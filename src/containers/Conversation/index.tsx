import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom, useAtomValue } from 'jotai'
import { FC, useEffect } from 'react'
import ChatBox from 'src/components/ChatBox'
import Configuration from 'src/components/Configuration'
import ConversationList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import { db } from 'src/db'
import { conversationAtom } from 'src/stores/conversation'
import { companyAtom } from 'src/stores/global'
import { Conversation as IConversation } from 'src/types/conversation'

const Conversation: FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom)
  const company = useAtomValue(companyAtom)
  const conversations = useLiveQuery<IConversation[]>(
    () =>
      db
        .table('conversations')
        .where('company')
        .equals(company)
        .reverse()
        .sortBy('updatedAt'),
    [company]
  )

  useEffect(() => {
    if (
      // Initializing App
      !conversation ||
      // Switching company
      conversation?.company !== company ||
      // Deleting a conversation
      conversations.findIndex((c) => c.id === conversation.id) === -1
    ) {
      setConversation(conversations?.[0])
    }
  }, [conversation, conversations, company, setConversation])

  return (
    <>
      <ConversationList conversations={conversations} />
      <Divider direction="vertical" />
      <ChatBox />
      <Divider direction="vertical" />
      <Configuration />
    </>
  )
}

export default Conversation
