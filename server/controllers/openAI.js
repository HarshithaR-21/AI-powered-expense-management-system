const express = require('express');
const OpenAI = require("openai");
const expense = require('../models/expense');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function calculateSettlements(transactions, friendsList = []) {
  const netBalance = {};
  friendsList.forEach(member => { netBalance[member] = 0; });

  transactions.forEach(exp => {
    const amount = Number(exp.amount || 0);

    if (exp.paymentMode === 'group') {
      if (exp.shareType === 'equal') {
        const participants = Array.isArray(exp.participants) ? exp.participants : [];
        if (participants.length === 0) return;
        const share = amount / participants.length;
        netBalance[exp.paidBy] = (netBalance[exp.paidBy] || 0) + amount;
        participants.forEach(p => {
          netBalance[p] = (netBalance[p] || 0) - share;
        });
      } else if (exp.shareType === 'different') {
        const participants = Array.isArray(exp.participants) ? exp.participants : [];
        netBalance[exp.paidBy] = (netBalance[exp.paidBy] || 0) + amount;
        participants.forEach(p => {
          const s = Number((exp.individualShares && exp.individualShares[p]) || 0);
          netBalance[p] = (netBalance[p] || 0) - s;
        });
      }
    } else if (exp.paymentMode === 'individual') {
      const participants = Array.isArray(exp.participants) ? exp.participants : [];
      participants.forEach(p => {
        if (p === exp.paidBy) return;
        const s = Number((exp.individualShares && exp.individualShares[p]) || 0);
        netBalance[exp.paidBy] = (netBalance[exp.paidBy] || 0) + s;
        netBalance[p] = (netBalance[p] || 0) - s;
      });
    }
  });

  const creditors = [], debtors = [];
  Object.entries(netBalance).forEach(([name, bal]) => {
    if (bal > 0) creditors.push({ name, balance: bal });
    else if (bal < 0) debtors.push({ name, balance: bal });
  });

  creditors.sort((a,b) => b.balance - a.balance);
  debtors.sort((a,b) => a.balance - b.balance);

  const settlements = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amt = Math.min(creditor.balance, -debtor.balance);
    if (amt > 0) {
      settlements.push({ from: debtor.name, to: creditor.name, amount: Number(amt.toFixed(2)) });
      creditor.balance -= amt;
      debtor.balance += amt;
    }
    if (Math.abs(creditor.balance) < 1e-9) i++;
    if (Math.abs(debtor.balance) < 1e-9) j++;
  }

  return settlements;
}

const handleRequest = async (req, res) => {
  try {
    const { plan } = req.body;

    const transactions = await expense.find({ planId: plan._id });

    // Compute settlements server-side using same logic as the frontend
    const settlements = await calculateSettlements(transactions, plan.friendsList || []);

    // Ask the model only to produce a short friendly summary (4-6 lines)
const summaryPrompt = `
You are the smart and friendly assistant for the EquiShare app.
Generate a transparent and concise summary in 2 clear parts.

**1. Expense Overview:**
• For each expense, mention:
  - Expense name and total amount
  - Who paid it
  - How it was shared (equal or different)
  - Which members benefited from it
Keep each line short but clear (1–2 lines per expense).

**2. Settlement Explanation:**
• Use the settlement data below to explain who pays whom and WHY that transaction happens.
• Explain the reasoning in simple transparent language (e.g., "Harshitha R pays Khushi ₹150 because Khushi covered Harshitha’s share for Uta and lunch").
• Mention how debts were merged or redirected to minimize the number of transactions.
• Finally, add one friendly closing line that confirms everything is settled smoothly.

Avoid showing any raw calculations, step-by-step math, or table-like formatting.
Keep the total response within 7–10 lines, natural and easy to read.

Settlements:
${JSON.stringify(settlements, null, 2)}

Transactions (brief):
${JSON.stringify(transactions, null, 2)}

Return only the 4–6 line summary.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a smart and accurate financial assistant for the EquiShare app. Produce only a short friendly summary as instructed."
        },
        { role: "user", content: summaryPrompt },
      ],
    });

    res.json({ reply: response.choices[0].message.content, settlements });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = handleRequest;
