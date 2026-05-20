/**
 * YUME ESTATE — Viber Webhook Handler
 * POST /api/viber/webhook
 *
 * Two jobs:
 *   1. Register agent's Viber subscriber ID when they subscribe to the bot
 *      (this is how we learn each agent's viber_id for outbound alarms)
 *   2. Silently ignore all inbound messages — the bot is SEND-ONLY
 *
 * Viber Bot Setup checklist:
 *   • Register at https://partners.viber.com → Create Bot Account
 *   • Bot name: "Yume Estate"
 *   • Set webhook URL: https://yumeestate.com/api/viber/webhook
 *   • In bot settings → disable "Allow users to reply" (Send-Only mode)
 *   • Save your Auth Token → VIBER_AUTH_TOKEN in .env
 */

"use strict";

const { Pool } = require("pg");
const axios    = require("axios");

const db           = new Pool({ connectionString: process.env.DATABASE_URL });
const VIBER_API    = "https://chatapi.viber.com/pa";
const VIBER_TOKEN  = process.env.VIBER_AUTH_TOKEN;

// ── Register webhook with Viber (run once on deployment) ──────────────────
async function registerWebhook(webhookUrl) {
  const res = await axios.post(`${VIBER_API}/set_webhook`, {
    url: webhookUrl,
    event_types: ["subscribed", "unsubscribed"],  // only care about subscribe events
    send_name: true,
    send_photo: false,
  }, {
    headers: { "X-Viber-Auth-Token": VIBER_TOKEN },
  });
  console.log("[Yume] Webhook registered:", res.data);
  return res.data;
}

// ── Express handler ───────────────────────────────────────────────────────
async function handleViberWebhook(req, res) {
  // Viber requires HTTP 200 immediately
  res.status(200).json({ status: 0 });

  const event = req.body;
  if (!event?.event) return;

  // Agent subscribed to the Yume Estate Viber bot
  // → save their viber_id so we can send them alarms
  if (event.event === "subscribed") {
    const viberId    = event.sender?.id;
    const viberPhone = event.sender?.name; // Viber sends display name, not phone
    if (!viberId) return;

    // Match agent by phone if available, otherwise log for manual linking
    // In production: show a "Link your Viber" flow in the agent dashboard
    // that sends a magic code, then matches viberId to agent.id
    console.log(`[Yume] Agent subscribed to Viber bot. viber_id: ${viberId}`);
    // await db.query(`UPDATE agents SET viber_id = $1 WHERE phone = $2`, [viberId, normPhone]);
  }

  // "message" events are intentionally ignored — send-only bot
  if (event.event === "message") {
    console.log("[Yume] Inbound Viber message ignored (send-only mode).");
  }
}

module.exports = { handleViberWebhook, registerWebhook };
