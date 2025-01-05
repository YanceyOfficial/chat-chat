import { Companies } from 'src/types/global'
import * as anthropic from './anthropic'
import * as google from './google'
import * as openAI from './openAI'

const configurations = {
  [Companies.Anthropic]: anthropic,
  [Companies.Google]: google,
  [Companies.OpenAI]: openAI
}

export default configurations
