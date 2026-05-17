// Provider stub — same interface as openai.js. Swap into ocrService.js when needed.
import OpenAI from 'openai'
import { FC26_EXTRACTION_PROMPT } from '../prompts'

export async function extractWithGemini(imageBase64, mimeType = 'image/png') {
  const c = new OpenAI({ apiKey: process.env.EMERGENT_LLM_KEY, baseURL: 'https://integrations.emergentagent.com/llm' })
  const resp = await c.chat.completions.create({
    model: 'gemini/gemini-2.5-flash',
    messages: [{ role: 'user', content: [
      { type: 'text', text: FC26_EXTRACTION_PROMPT },
      { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
    ]}],
    response_format: { type: 'json_object' }, max_tokens: 2048, temperature: 0,
  })
  return JSON.parse(resp.choices?.[0]?.message?.content || '{}')
}
