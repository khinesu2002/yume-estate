/**
 * YUME ESTATE — API Routes
 * Mount in your Express app: app.use("/api", require("./routes"))
 */

"use strict";

const express = require("express");
const router  = express.Router();

const { handleChatMessage } = require("./chatController");
const { handleViberWebhook } = require("./viberWebhook");

// Customer sends a message from the web chat widget
router.post("/chat/message", handleChatMessage);

// Viber platform posts events here (subscribe, message, etc.)
router.post("/viber/webhook", handleViberWebhook);

// Health check
router.get("/health", (_, res) => res.json({ ok: true, service: "Yume Estate API" }));

module.exports = router;
