import { useAtomValue, useSetAtom } from 'jotai'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { conversationAtom } from 'src/stores/conversation'
import { companyAtom, loadingAtom, settingsAtom } from 'src/stores/global'
import { Companies } from 'src/types/global'

const useSTT = () => {
  const { openAiClient } = useClients()
  const conversation = useAtomValue(conversationAtom)
  const setLoading = useSetAtom(loadingAtom)
  const settings = useAtomValue(settingsAtom)
  const company = useAtomValue(companyAtom)

  if (!settings || !conversation) return

  const createSpeechByOpenAI = async (blob: Blob[]) => {
    try {
      setLoading(true)

      const transcription = await openAiClient.audio.transcriptions.create({
        file: new File(blob, 'record.mp3', { lastModified: +new Date() }),
        model: 'whisper-1'
      })

      return transcription.text
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const services = {
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[company]
}

export default useSTT
