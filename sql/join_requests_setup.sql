-- ============================================
-- JOIN REQUESTS TABLE
-- ============================================

-- Tabella per le richieste di accesso
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Info
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  
  -- Platform & Gaming Info
  platform TEXT NOT NULL CHECK (platform IN ('xbox', 'playstation')),
  site_username TEXT NOT NULL UNIQUE,
  ea_gamertag TEXT NOT NULL,
  console_gamertag TEXT NOT NULL,
  
  -- Role/Position
  role_name TEXT NOT NULL DEFAULT 'player',
  preferred_position TEXT NOT NULL,
  
  -- Request Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  
  -- Metadata
  notes TEXT,
  captain_response_notes TEXT,
  
  -- Tracks
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX idx_join_requests_status ON join_requests(status);
CREATE INDEX idx_join_requests_email ON join_requests(email);
CREATE INDEX idx_join_requests_requested_at ON join_requests(requested_at DESC);

-- Enable RLS
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Chiunque può leggere le proprie richieste
CREATE POLICY "Players can view own requests"
  ON join_requests FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Policy: Capitani possono leggere tutte le richieste
CREATE POLICY "Captains can view all requests"
  ON join_requests FOR SELECT
  USING (
    auth.jwt() ->> 'user_metadata' ->> 'role_name' = 'captain'
  );

-- Policy: Chiunque può creare richiesta
CREATE POLICY "Anyone can create request"
  ON join_requests FOR INSERT
  WITH CHECK (true);

-- Policy: Capitani possono aggiornare richieste
CREATE POLICY "Captains can update requests"
  ON join_requests FOR UPDATE
  USING (
    auth.jwt() ->> 'user_metadata' ->> 'role_name' = 'captain'
  );

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_join_requests_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  IF NEW.status != OLD.status AND NEW.status != 'pending' THEN
    NEW.responded_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER join_requests_timestamp
  BEFORE UPDATE ON join_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_join_requests_timestamp();
