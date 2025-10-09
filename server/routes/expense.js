const express = require('express');
const router = express.Router();
const {handleAddExpense, handleGetExpenses, handleDeleteExpense, handleGetExpense} = require('../controllers/expense');
const auth = require('../middleware/auth');

router.post('/add-expense/:planId', auth, handleAddExpense);
router.get('/get-expenses/:planId', auth, handleGetExpenses);
router.get('/get-expense/:expenseId', auth, handleGetExpense);
router.delete('/delete-expense/:expenseId', auth, handleDeleteExpense);
module.exports = router;