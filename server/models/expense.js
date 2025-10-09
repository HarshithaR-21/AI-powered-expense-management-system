const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'plans',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidBy: {
    type: String,
    required: true
  },
  participants: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one participant required']
  },
  paymentMode: {
    type: String,
  },
  shareType: {
    type: String,
  },
  individualShares: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const expense = mongoose.model('expense', expenseSchema);

module.exports = expense;