const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/get-tip", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are a fitness AI assistant. You answer in short, direct, practical responses with no essays, no tables, no questions unless required. Keep every answer under 6–8 lines. Avoid motivational or bulky tone." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ tip: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);
    res.json({ tip: "AI is not responding right now." });
  }
});

module.exports = router;
