import OpenAI from 'openai'
import { FC26_EXTRACTION_PROMPT } from '../prompts'

let client = null
function getClient() {
  if (client) return client
  client = new OpenAI({
    apiKey: process.env.EMERGENT_LLM_KEY,
    baseURL: 'https://integrations.emergentagent.com/llm',
  })
  return client
}

export async function extractWithOpenAI(imageBase64, mimeType = 'image/png') {
  const c = getClient()
  const resp = await c.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: FC26_EXTRACTION_PROMPT },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
      ],
    }],
    response_format: { type: 'json_object' },
    max_tokens: 2048,
    temperature: 0,
  })
  const content = resp.choices?.[0]?.message?.content || '{}'
  return JSON.parse(content)
}
