"use strict";
require("dotenv").config();

const express = require("express");
const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow your Next.js frontend origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`[Yume] API running on port ${PORT}`));
