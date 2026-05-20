/**
 * YUME ESTATE — Chat Message Controller
 * POST /api/chat/message
 *
 * Implements the One-Time Viber Alarm state machine:
 *
 *   Buyer sends message
 *        │
 *   Upsert buyer → Lookup/create chat_relation
 *        │
 *   ┌────┴────────────────────────────────┐
 *   │  alarm_sent = false  (first contact)│  alarm_sent = true (returning)
 *   │  → fire Viber alarm                 │  → suppress Viber, log message only
 *   │  → mark alarm_sent = true           │
 *   └─────────────────────────────────────┘
 *        │
 *   Insert chat_message (buyer turn)
 *   Insert auto-reply   (bot turn)
 *   Return { autoReply, isFirstContact }
 *
 * Dependencies:
 *   npm install pg axios dotenv
 *
 * Environment variables (.env):
 *   DATABASE_URL=postgresql://user:pass@host:5432/yumedb
 *   VIBER_AUTH_TOKEN=<your_viber_bot_auth_token>
 *   VIBER_BOT_NAME=Yume Estate
 *   APP_BASE_URL=https://yumeestate.com
 */

"use strict";

const { Pool } = require("pg");
const axios   = require("axios");

// ── DB pool (single shared instance across requests) ──────────────────────
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Viber config ──────────────────────────────────────────────────────────
const VIBER_API    = "https://chatapi.viber.com/pa/send_message";
const VIBER_TOKEN  = process.env.VIBER_AUTH_TOKEN;
const BOT_NAME     = process.env.VIBER_BOT_NAME || "Yume Estate";
const APP_URL      = process.env.APP_BASE_URL   || "https://yumeestate.com";

// ── Phone normaliser ──────────────────────────────────────────────────────
// Converts any Myanmar number format to E.164 (+959xxxxxxxx)
function normalisePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("09"))  return `+95${digits.slice(1)}`;
  if (digits.startsWith("959")) return `+${digits}`;
  if (digits.startsWith("95"))  return `+${digits}`;
  return `+${digits}`;
}

// ── Viber alarm payload ───────────────────────────────────────────────────
// Send-only: no keyboard, no reply prompt.
// Agent sees the alert + a deep-link button into the Yume Estate dashboard.
function buildViberPayload(viberReceiverId, buyerName, buyerPhone, propertyTitle, propertyId) {
  return {
    receiver: viberReceiverId,
    type: "rich_media",
    min_api_version: 7,
    rich_media: {
      Type: "rich_media",
      ButtonsGroupColumns: 6,
      ButtonsGroupRows: 4,
      BgColor: "#111d2b",
      Buttons: [
        // ── Header row ──────────────────────────────────────────
        {
          Columns: 6, Rows: 1,
          ActionType: "none",
          Text: `<font color="#bd9468"><b>📩 YUME ESTATE — New Customer Alert</b></font>`,
          TextSize: "medium",
          TextVAlign: "middle",
          TextHAlign: "center",
          BgColor: "#111d2b",
        },
        // ── Buyer info ───────────────────────────────────────────
        {
          Columns: 6, Rows: 1,
          ActionType: "none",
          Text: `<font color="#ffffff"><b>${buyerName}</b>  ·  ${buyerPhone}</font>`,
          TextSize: "medium",
          TextVAlign: "middle",
          TextHAlign: "center",
          BgColor: "#1a2e45",
        },
        // ── Property title ───────────────────────────────────────
        {
          Columns: 6, Rows: 1,
          ActionType: "none",
          Text: `<font color="#c8d8e8">Enquiry: ${propertyTitle}</font>`,
          TextSize: "small",
          TextVAlign: "middle",
          TextHAlign: "center",
          BgColor: "#1a2e45",
        },
        // ── CTA button: open Yume Estate dashboard ───────────────
        {
          Columns: 6, Rows: 1,
          ActionType: "open-url",
          ActionBody: `${APP_URL}/agent/dashboard?lead=${propertyId}`,
          Text: `<font color="#111d2b"><b>Open Dashboard →</b></font>`,
          TextSize: "medium",
          TextVAlign: "middle",
          TextHAlign: "center",
          BgColor: "#bd9468",
        },
      ],
    },
  };
}

// ── Fire the Viber API call ───────────────────────────────────────────────
async function fireViberAlarm(viberReceiverId, buyerName, buyerPhone, propertyTitle, propertyId) {
  const payload = buildViberPayload(viberReceiverId, buyerName, buyerPhone, propertyTitle, propertyId);
  const response = await axios.post(VIBER_API, payload, {
    headers: {
      "X-Viber-Auth-Token": VIBER_TOKEN,
      "Content-Type": "application/json",
    },
    timeout: 8000,
  });
  return {
    httpStatus: response.status,
    viberStatus: response.data?.status ?? -1,
    success: response.data?.status === 0,
  };
}

// ── Main controller ───────────────────────────────────────────────────────
/**
 * Express handler — attach to: POST /api/chat/message
 *
 * Expected request body:
 * {
 *   buyerName:   string,   // "Ko Aung"
 *   buyerPhone:  string,   // "09-123456789"
 *   agentId:     string,   // UUID of the agent who owns the listing
 *   propertyId:  string,   // UUID of the property being enquired about
 *   messageBody: string,   // the customer's first message text
 *   language:    "en"|"my"
 * }
 *
 * Returns:
 * {
 *   success:        boolean,
 *   isFirstContact: boolean,
 *   viberFired:     boolean,
 *   autoReply:      string,   // instant bot reply to display in web chat
 *   relationId:     string
 * }
 */
async function handleChatMessage(req, res) {
  const { buyerName, buyerPhone, agentId, propertyId, messageBody, language } = req.body;

  // ── Input validation ───────────────────────────────────────
  if (!buyerName?.trim() || !buyerPhone?.trim() || !agentId || !propertyId || !messageBody?.trim()) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const normPhone = normalisePhone(buyerPhone);
  const isMy      = language === "my";

  // ── Wrap everything in a DB transaction ────────────────────
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // 1. Upsert buyer (no duplicates by phone)
    const buyerResult = await client.query(`
      INSERT INTO buyers (name, phone)
      VALUES ($1, $2)
      ON CONFLICT (phone) DO UPDATE
        SET name = EXCLUDED.name
      RETURNING id, name, phone
    `, [buyerName.trim(), normPhone]);
    const buyer = buyerResult.rows[0];

    // 2. Fetch agent (need viber_id + name + phone for alarm)
    const agentResult = await client.query(`
      SELECT id, name, phone, viber_id FROM agents
      WHERE id = $1 AND active = true
    `, [agentId]);
    if (!agentResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Agent not found." });
    }
    const agent = agentResult.rows[0];

    // 3. Fetch property title
    const propResult = await client.query(`
      SELECT id, title, title_my FROM properties WHERE id = $1
    `, [propertyId]);
    const property   = propResult.rows[0];
    const propTitle  = isMy ? (property?.title_my || property?.title) : property?.title || "your enquiry";

    // 4. ── CORE LOGIC: INSERT OR IGNORE on chat_relations ────
    //    ON CONFLICT DO NOTHING means:
    //      • If pair is new  → row is inserted, alarm_sent = false
    //      • If pair exists  → nothing changes, we read existing row
    await client.query(`
      INSERT INTO chat_relations (buyer_id, agent_id, property_id, alarm_sent)
      VALUES ($1, $2, $3, false)
      ON CONFLICT (buyer_id, agent_id) DO NOTHING
    `, [buyer.id, agent.id, propertyId]);

    // Read back the (possibly just-created) relation row
    const relResult = await client.query(`
      SELECT id, alarm_sent, alarm_sent_at
      FROM chat_relations
      WHERE buyer_id = $1 AND agent_id = $2
    `, [buyer.id, agent.id]);
    const relation   = relResult.rows[0];
    const isFirst    = !relation.alarm_sent;  // alarm_sent = false → first contact

    // 5. Save the buyer's message
    await client.query(`
      INSERT INTO chat_messages (relation_id, sender, body)
      VALUES ($1, 'buyer', $2)
    `, [relation.id, messageBody.trim()]);

    // 6. Build and save the auto-reply
    const autoReply = isMy
      ? `မင်္ဂလာပါ ${buyerName}! ကျွန်တော်/ကျွန်မ ${agent.name} ဖြစ်ပါသည်။ "${propTitle}" အကြောင်း မေးမြန်းမှုကို ကျေးဇူးတင်ပါသည်။ ကျွန်တော်/ကျွန်မ၏ ဖုန်းနံပါတ်မှာ ${agent.phone} ဖြစ်ပါသည်။ ဤနေရာတွင် ဆက်ကာ ဆက်သွယ်နိုင်ပြီး မကြာမီ ဆက်သွယ်ပေးပါမည်!`
      : `Hello ${buyerName}! This is ${agent.name}. Thank you for enquiring about "${propTitle}". My direct number is ${agent.phone} — feel free to call me to schedule a viewing, or continue chatting here and I will reply shortly!`;

    await client.query(`
      INSERT INTO chat_messages (relation_id, sender, body)
      VALUES ($1, 'bot', $2)
    `, [relation.id, autoReply]);

    // 7. ── PHASE 2: One-Time Viber Alarm ─────────────────────
    let viberFired  = false;
    let viberResult = null;

    if (isFirst && agent.viber_id) {
      try {
        viberResult = await fireViberAlarm(
          agent.viber_id,
          buyerName,
          buyerPhone,
          propTitle,
          propertyId
        );

        // Mark alarm as sent — regardless of Viber's response
        // (prevents double-firing even if Viber returns a soft error)
        await client.query(`
          UPDATE chat_relations
          SET alarm_sent = true, alarm_sent_at = NOW()
          WHERE id = $1
        `, [relation.id]);

        // Append to audit log
        await client.query(`
          INSERT INTO viber_alarm_log
            (relation_id, viber_receiver, payload, http_status, viber_status, success)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          relation.id,
          agent.viber_id,
          JSON.stringify(buildViberPayload(agent.viber_id, buyerName, buyerPhone, propTitle, propertyId)),
          viberResult.httpStatus,
          viberResult.viberStatus,
          viberResult.success,
        ]);

        viberFired = true;
      } catch (viberErr) {
        // Viber call failed — still mark alarm_sent to prevent retry spam
        console.error("[Yume] Viber alarm failed:", viberErr.message);
        await client.query(`
          UPDATE chat_relations SET alarm_sent = true, alarm_sent_at = NOW() WHERE id = $1
        `, [relation.id]);
        await client.query(`
          INSERT INTO viber_alarm_log (relation_id, viber_receiver, payload, success)
          VALUES ($1, $2, $3, false)
        `, [relation.id, agent.viber_id, JSON.stringify({ error: viberErr.message })]);
      }
    } else if (isFirst && !agent.viber_id) {
      // Agent hasn't linked their Viber yet — mark alarm_sent anyway to stay consistent
      await client.query(`
        UPDATE chat_relations SET alarm_sent = true, alarm_sent_at = NOW() WHERE id = $1
      `, [relation.id]);
      console.warn(`[Yume] Agent ${agent.id} has no viber_id — alarm skipped.`);
    }
    // isFirst = false → Viber block skipped entirely. Silent delivery.

    await client.query("COMMIT");

    return res.status(200).json({
      success:        true,
      isFirstContact: isFirst,
      viberFired,
      autoReply,
      relationId:     relation.id,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[Yume] handleChatMessage error:", err);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
}

module.exports = { handleChatMessage };
