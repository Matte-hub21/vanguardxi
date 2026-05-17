import { extractWithOpenAI } from './providers/openai'
import { extractWithGemini } from './providers/gemini'
import { matchPlayers, pickMVP } from './parser'

const PROVIDERS = { openai: extractWithOpenAI, gemini: extractWithGemini }

export async function extractMatchStats({ imageBase64, mimeType, roster, provider }) {
  const fn = PROVIDERS[provider || process.env.OCR_PROVIDER || 'openai']
  if (!fn) throw new Error(`Unknown OCR provider: ${provider}`)
  const raw = await fn(imageBase64, mimeType)
  const players = matchPlayers(raw.players || [], roster || [])
  const mvp = pickMVP(players)
  return { raw_result: raw.match_result || null, players, mvp_player_id: mvp?.player_id || null, confidence: raw.confidence ?? 0.9 }
}
