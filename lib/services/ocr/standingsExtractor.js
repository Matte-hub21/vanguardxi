import OpenAI from 'openai'
import { STANDINGS_OCR_PROMPT } from './standingsPrompt'

let client = null
function getClient() {
  if (client) return client
  client = new OpenAI({
    apiKey: process.env.EMERGENT_LLM_KEY,
    baseURL: 'https://integrations.emergentagent.com/llm',
  })
  return client
}

export async function extractStandings(imageBase64, mimeType = 'image/png') {
  const c = getClient()
  const resp = await c.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: STANDINGS_OCR_PROMPT },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
      ],
    }],
    response_format: { type: 'json_object' },
    max_tokens: 3000,
    temperature: 0,
  })
  return JSON.parse(resp.choices?.[0]?.message?.content || '{}')
}
