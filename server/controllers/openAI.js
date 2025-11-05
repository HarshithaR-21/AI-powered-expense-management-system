const express = require('express');
const OpenAI = require("openai");
const expense = require('../models/expense');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleRequest = async (req, res) => {
  try {
    const { plan } = req.body; // receive transactions array from frontend

    const transactions = await expense.find({ planId: plan._id });

    // Build the detailed instruction + data
const prompt = `
You are the smart assistant for the "EquiShare" app, which explains optimized group settlements in simple and friendly language.

Your goal:
1. Analyze the given transactions and find the minimum number of payments required to settle all balances.
2. If someone owes A and A owes B, simplify it so payments are redirected directly to the right person.
3. Output a short, easy-to-read summary (4–6 lines) that explains how money flows and who should pay whom.
4. Avoid listing calculations or step-by-step breakdowns — just explain the final settlement clearly.
5. Also mention the cause of expenditure like tea, lunch, tickets etc.

Data:
${JSON.stringify(transactions, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a smart financial assistant that simplifies group settlements for the EquiShare app." },
        { role: "user", content: prompt },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = handleRequest;
