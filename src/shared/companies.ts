import {
  AnthropicLogoIcon,
  GoogleLogoIcon,
  OpenAiLogoIcon
} from 'src/components/Icons'
import { SpeechService } from 'src/types/conversation'
import { Companies } from 'src/types/global'

export default [
  {
    name: Companies.OpenAI,
    logo: OpenAiLogoIcon,
    capabilities: {
      attachment: {
        mimetype: 'image/*',
        multiple: true
      },
      speeches: [SpeechService.STT, SpeechService.TTS]
    }
  },
  {
    name: Companies.Google,
    logo: GoogleLogoIcon,
    capabilities: {
      attachment: {
        mimetype: 'image/*',
        multiple: true
      },
      speeches: []
    }
  },
  {
    name: Companies.Anthropic,
    logo: AnthropicLogoIcon,
    capabilities: {
      attachment: {
        mimetype: 'image/*',
        multiple: true
      },
      speeches: []
    }
  }
]
