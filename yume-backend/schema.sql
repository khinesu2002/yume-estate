-- ============================================================
-- YUME ESTATE — PostgreSQL Schema
-- One-Time Viber Alarm System
-- ============================================================

-- ── Agents (real estate agents subscribed to Yume Estate) ──
CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120)  NOT NULL,
  phone           VARCHAR(30)   NOT NULL UNIQUE,  -- Myanmar format: 09-xxxxxxxxx
  viber_id        VARCHAR(80)   UNIQUE,            -- Viber subscriber ID from bot webhook
  plan            VARCHAR(20)   NOT NULL DEFAULT 'basic'
                  CHECK (plan IN ('basic','pro','agency')),
  active          BOOLEAN       NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Buyers (web visitors who initiate chat — no account needed) ──
CREATE TABLE buyers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120)  NOT NULL,
  phone           VARCHAR(30)   NOT NULL UNIQUE,   -- normalised: digits only, e164
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Properties ──
CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID          NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  code            VARCHAR(30)   NOT NULL UNIQUE,   -- e.g. YME-001
  title           VARCHAR(255)  NOT NULL,
  title_my        VARCHAR(255),
  status          VARCHAR(20)   NOT NULL DEFAULT 'available'
                  CHECK (status IN ('available','pending','sold','rented','unavailable')),
  listing_type    VARCHAR(10)   NOT NULL CHECK (listing_type IN ('sale','rent')),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── chat_relations — THE CORE TABLE ──────────────────────────
-- One row = one unique buyer↔agent pair, ever.
-- The alarm_sent flag is the system's single source of truth.
-- INSERT OR IGNORE pattern: if the row already exists,
-- the Viber alarm is suppressed and we only append to chat_messages.
CREATE TABLE chat_relations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id        UUID          NOT NULL REFERENCES buyers(id)   ON DELETE CASCADE,
  agent_id        UUID          NOT NULL REFERENCES agents(id)   ON DELETE CASCADE,
  property_id     UUID          REFERENCES properties(id)        ON DELETE SET NULL,
  alarm_sent      BOOLEAN       NOT NULL DEFAULT false,
  alarm_sent_at   TIMESTAMPTZ,                         -- NULL until first alarm fires
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Enforce lifetime uniqueness of buyer↔agent pair
  CONSTRAINT uq_buyer_agent UNIQUE (buyer_id, agent_id)
);

-- Index for the hot-path lookup: buyer_phone + agent_id
CREATE INDEX idx_chat_relations_buyer ON chat_relations (buyer_id);
CREATE INDEX idx_chat_relations_agent ON chat_relations (agent_id);

-- ── chat_messages — full conversation history ──
CREATE TABLE chat_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relation_id     UUID          NOT NULL REFERENCES chat_relations(id) ON DELETE CASCADE,
  sender          VARCHAR(10)   NOT NULL CHECK (sender IN ('buyer','bot','agent')),
  body            TEXT          NOT NULL,
  sent_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_relation ON chat_messages (relation_id, sent_at DESC);

-- ── viber_alarm_log — append-only audit trail ──
-- Records every outbound Viber push attempt and its outcome.
CREATE TABLE viber_alarm_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relation_id     UUID          NOT NULL REFERENCES chat_relations(id),
  viber_receiver  VARCHAR(80)   NOT NULL,  -- agent's Viber subscriber ID
  payload         JSONB         NOT NULL,  -- exact payload sent to Viber API
  http_status     SMALLINT,               -- Viber API response status
  viber_status    SMALLINT,               -- Viber status code in response body (0 = ok)
  success         BOOLEAN       NOT NULL DEFAULT false,
  sent_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Trigger: auto-update updated_at on agents & properties ──
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
