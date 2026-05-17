# Pro Clubs Integration Documentation

## Overview
EA Sports Pro Clubs integration for Vanguard XI allows captains to:
- Link their EA Sports FC 26 Pro Clubs club
- View club statistics and match history
- Display club data in the team dashboard
- Sync club information with team roster

## API Reference

### Base URL
```
https://proclubs.ea.com/api/fc
```

### Authentication
- **Type**: None (public API)
- **CORS**: Blocked on server, requires proxy
- **Proxy Used**: `https://proxy.corsfix.com/?`

### Endpoints

#### Search Clubs
```
GET /currentSeasonLeaderboard/search
Query Parameters:
  - platform: "common-gen5" (PS5/Xbox Series X|S/PC)
  - clubName: string (search query)
  - maxResultCount: number (max 50)
```

#### Get Club Info
```
GET /clubs/info
Query Parameters:
  - platform: "common-gen5"
  - clubIds: string (comma-separated IDs)
```

#### Get Club Statistics
```
GET /clubs/overallStats
Query Parameters:
  - platform: "common-gen5"
  - clubIds: string (comma-separated IDs)
```

#### Get Club Matches
```
GET /clubs/matches
Query Parameters:
  - platform: "common-gen5"
  - clubIds: string
  - matchType: "leagueMatch" | "friendlyMatch" | "playoffMatch"
  - maxResultCount: number
```

#### Get Player Stats
```
GET /members/stats
Query Parameters:
  - platform: "common-gen5"
  - playerId: string
  - seasonId: "current"
```

## Response Format

### Club Data
```json
{
  "clubId": "10754",
  "clubName": "Vanguard XI",
  "clubTag": "VGD",
  "ownerName": "GHOST_07",
  "platform": "common-gen5",
  "division": 1,
  "seasonDivision": 1,
  "totalMembers": 14,
  "wins": 24,
  "draws": 4,
  "losses": 6,
  "goalsFor": 89,
  "goalsAgainst": 42,
  "crestAssetId": "...",
  "kitColor": "#FFD700",
  "kitPattern": "SOLID"
}
```

## Implementation

### Service Layer
**File**: `lib/services/proClubsService.js`
- `searchClubs(clubName)` - Search for clubs
- `getClubInfo(clubId)` - Fetch club details
- `getClubStats(clubId)` - Get club statistics
- `getClubMatches(clubId, matchType)` - Fetch match history
- `parseClubData(rawData)` - Convert API response to app format
- Built-in caching (6-hour duration)

### API Routes

#### Search Endpoint
**Route**: `POST /api/proclubs/search`
```javascript
Request: { clubName: string }
Response: {
  ok: boolean,
  count: number,
  clubs: Array<{id, name, tag, owner, division, wins, draws, losses}>
}
```

#### Link Endpoint
**Route**: `POST /api/proclubs/link`
```javascript
Request: { clubId: string }
Response: {
  ok: boolean,
  club: ParsedClubData,
  linked_at: timestamp
}
```

#### Info Endpoint
**Route**: `GET /api/proclubs/info?clubId=12345`
```javascript
Response: {
  ok: boolean,
  club: ParsedClubData,
  recentMatches: Array<Match>,
  lastUpdated: timestamp
}
```

### Hooks

#### useProClubs Hook
**File**: `lib/hooks/useProClubs.js`
```javascript
const {
  searchResults,    // Array<Club>
  linkedClub,       // Club | null
  searching,        // boolean
  linking,          // boolean
  error,            // string | null
  searchClubs,      // (clubName: string) => Promise
  linkClub,         // (clubId: string) => Promise<Club>
  getClubInfo,      // (clubId: string) => Promise<ClubInfo>
  clearSearch,      // () => void
} = useProClubs()
```

### Components

#### ProClubsLinker
**File**: `components/proclubs/ProClubsLinker.js`
- Searchable club selection interface
- Displays search results with club preview
- Handles club linking
- Role-restricted to captains

#### ProClubsStats
**File**: `components/proclubs/ProClubsStats.js`
- Displays linked club statistics
- Shows recent match history
- Win rate calculation
- Goal difference tracking
- Refresh functionality

#### ProClubsManager
**File**: `components/proclubs/ProClubsManager.js`
- Tab-based interface combining search and stats
- Role-gated access (captain only)
- Manages linking workflow

## Caching Strategy

- **Duration**: 6 hours (configurable)
- **Storage**: In-memory Map (client-side)
- **Key**: `${endpoint}_${JSON.stringify(params)}`
- **Manual Refresh**: `clearCache()` function

## Limitations & Challenges

1. **CORS Blocking**: Requires proxy for server requests
2. **Rate Limiting**: Unknown limits; handle gracefully
3. **API Stability**: Undocumented API subject to change
4. **Read-Only**: No write operations available
5. **Data Staleness**: May lag behind in-game updates
6. **Platform-Specific**: Must specify platform for each request

## Future Enhancements

- [ ] Player stats syncing with roster
- [ ] Automated stat updates via background jobs
- [ ] Match result tracking integration
- [ ] Club achievements display
- [ ] Multi-platform support (PS4, Switch)
- [ ] OAuth integration with EA (if available)
- [ ] Webhook for real-time updates

## Error Handling

All functions include try-catch blocks with console errors. API errors are gracefully handled with user-friendly messages:
- Network errors → "Failed to search clubs"
- Not found → "Club not found"
- Other → Generic error message

## Testing

### Manual Testing
```bash
# Search clubs
curl -X POST http://localhost:3000/api/proclubs/search \
  -H "Content-Type: application/json" \
  -d '{"clubName": "Vanguard XI"}'

# Link club
curl -X POST http://localhost:3000/api/proclubs/link \
  -H "Content-Type: application/json" \
  -d '{"clubId": "10754"}'

# Get club info
curl http://localhost:3000/api/proclubs/info?clubId=10754
```

## Resources

- **Community API Docs**: https://github.com/thealfredohenrique/clubs-tracker/blob/main/docs/clubs-api.md
- **Example Tracker**: https://clubstracker.com (EA Sports FC 26)
- **Related Projects**:
  - Davide131297/pro-clubs-api (TypeScript wrapper)
  - luisplduarte/Pro-Clubs-api (CloudFlare proxy)
  - thealfredohenrique/clubs-tracker (Complete tracker)

## Disclaimer

This API is **undocumented and unofficial**. EA Sports may change or disable access without notice. Always include fallback mechanisms and error handling. Users should be aware of these limitations when using the feature.
