export const FC26_EXTRACTION_PROMPT = `You are an expert at reading EA Sports FC 26 Pro Clubs post-match statistics screens.

Analyse the screenshot and extract every player row plus the final result. Return STRICT JSON matching this schema (no prose, no markdown):

{
  "match_result": { "score_us": number, "score_them": number, "result": "W"|"D"|"L", "opponent": string|null },
  "players": [
    {
      "name": string,              // gamertag exactly as shown
      "position": string|null,     // GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST
      "rating": number,            // match rating, one decimal e.g. 8.4
      "goals": number,
      "assists": number,
      "passes": number,
      "tackles": number,
      "saves": number|null,        // null if not a GK
      "clean_sheet": boolean
    }
  ],
  "confidence": number             // 0-1 self assessed accuracy
}

Rules:
- The home team is always called Vanguard XI. Score_us = Vanguard XI goals.
- If a number is unreadable, use 0 (do not guess wildly).
- Use only player gamertags actually shown.
- Output JSON only.`
