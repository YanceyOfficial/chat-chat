import { useAtomValue, useSetAtom } from 'jotai'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { conversationAtom } from 'src/stores/conversation'
import { companyAtom, loadingAtom, settingsAtom } from 'src/stores/global'
import { Companies } from 'src/types/global'

const useTTS = () => {
  const { openAiClient } = useClients()
  const conversation = useAtomValue(conversationAtom)
  const setLoading = useSetAtom(loadingAtom)
  const settings = useAtomValue(settingsAtom)
  const company = useAtomValue(companyAtom)

  if (!settings || !conversation) return

  const createSpeechByOpenAI = async (text: string) => {
    try {
      setLoading(true)

      const speech = await openAiClient.audio.speech.create({
        model: 'tts-1',
        input: text,
        voice: 'nova'
      })
      const audioBlob = await speech.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      return audioUrl
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

export default useTTS
