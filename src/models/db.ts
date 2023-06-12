import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  [Products.OpenAIChat]!: Table<Conversation>;
  [Products.OpenAITextCompletion]!: Table<Conversation>;
  [Products.OpenAIAudioTranscription]!: Table<Conversation>;
  [Products.OpenAIAudioTranslation]!: Table<Conversation>;
  [Products.OpenAIImageGeneration]!: Table<Conversation>;
  [Products.AzureChat]!: Table<Conversation>;
  [Products.AzureTextCompletion]!: Table<Conversation>;
  [Products.AzureImageGeneration]!: Table<Conversation>;
  [Products.AnthropicChat]!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      [Products.OpenAIChat]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.OpenAITextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.OpenAIAudioTranscription]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages',
      [Products.OpenAIAudioTranslation]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages',
      [Products.OpenAIImageGeneration]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.AzureChat]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.AzureTextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.AzureImageGeneration]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.AnthropicChat]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      settings:
        '&&settings_id, openai_secret_key, openai_organization_id, openai_author_name, azure_endpoint, azure_secret_key, azure_deployment_name, anthropic_secret_key, theme_mode, assistant_avatar_filename, chat_model, text_completion_model, audio_transcription_model, audio_translation_model, audio_response_type, image_generation_type, chat_stream, text_completion_stream'
    })
  }
}

export const db = new HyperChatDB()
