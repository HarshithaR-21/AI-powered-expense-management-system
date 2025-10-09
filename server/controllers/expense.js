const express = require('express');
const expense = require('../models/expense');

const handleAddExpense = async (req, res) => {
    try {
        const { planId } = req.params;
        //console.log(req.body);
        let {
            description,
            amount,
            paidBy,
            participants,
            paymentMode,
            shareType,
            individualShares,
        } = req.body;

        if (!participants.includes(paidBy)) {
            participants.push(paidBy);
        }

        const expenseData = {
            planId,
            description,
            amount,
            paidBy,
            participants,
            paymentMode,
            shareType,
            individualShares,
        };

        const addedExpense = await expense.create(expenseData);
        if (addedExpense) {
            res.status(201).json({ message: "Expense added successfully", expense: addedExpense });
        } else {
            res.status(400).json({ message: "Failed to add expense" });
        }
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const handleGetExpenses = async (req, res) => {
    try {
        const { planId } = req.params;
        const foundExpenses = await expense.find({ planId });
        if (foundExpenses && foundExpenses.length > 0) {
            res.status(200).json({ message: "Expenses fetched successfully", expenses: foundExpenses });
        } else {
            res.status(404).json({ message: "No expenses found for this plan", expenses: [] });
        }
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const handleDeleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const deletedExpense = await expense.findByIdAndDelete(expenseId);
        if (deletedExpense) {
            res.status(200).json({ message: "Expense deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Expense not found" });
        }
    }
    catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const handleGetExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const foundExpense = await expense.findById(expenseId); 
        if (foundExpense) {
            res.status(200).json({ message: "Expense fetched successfully", fetchedExpense: foundExpense });
        } else {
            res.status(404).json({ message: "Expense not found" });
        }
    } catch (error) {
        console.error("Error fetching expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { handleAddExpense, handleGetExpenses, handleDeleteExpense, handleGetExpense };