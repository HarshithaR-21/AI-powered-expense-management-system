const express = require('express');
const user = require('../models/user');
const plan = require('../models/plan');
const expense = require('../models/expense');

const handleAddPlan = async (req, res) => {
    try {
        const { title, description, membersCount, friendsList } = req.body;
        const userEmail = req.user.email;
        const userDetails = await user.findOne({ email: userEmail });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        const membersList = [...friendsList, userDetails.firstName + ' ' + userDetails.lastName];
        const newPlan = await plan.create({creatorId: userDetails._id, title, description, membersCount, friendsList: membersList});
        await newPlan.save();
        res.status(201).json({ message: "Plan added successfully", planDetails: newPlan });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error, Try Again Later"});
    }
}

const handleEditPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, membersCount, friendsList } = req.body;
        const userEmail = req.user.email;
        const userDetails = await user.findOne({ email: userEmail });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        const membersList = [...friendsList, userDetails.firstName + ' ' + userDetails.lastName];
        const foundPlan = await plan.findById(id);
        if (!foundPlan) {
            return res.status(404).json({ message: "Invalid Plan ID" });
        }
      
        const updatedPlan = await plan.updateOne(
            { _id: id },
            { $set: { title, description, membersCount, friendsList: membersList } }
        );
        if (updatedPlan.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes made to the plan" });
        }
        res.status(200).json({ message: "Plan updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error, Try Again Later" });
    }
}

const handleDeletePlan = async (req, res) => {
    const {id} = req.params;
    try{
        const deletedPlan = await plan.findByIdAndDelete(id);
        const deleteExpenses = await expense.deleteMany({planId: id});
        if(!deletedPlan){
            return res.status(404).json({ message: "Plan not found" });
        }
        res.status(200).json({ message: "Plan deleted successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server Error, Try Again Later" });
    }
}

const handleGetPlans = async (req, res) => {
    try{
        const userEmail = req.user.email;
        const userDetails = await user.findOne({ email: userEmail });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        const plans = await plan.find({ creatorId: userDetails._id });
        res.status(200).json({ plans });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server Error, Try Again Later" });
    }
}

const handleGetPlan = async (req, res) => {
    try{
        const { id } = req.params;
        const foundPlan = await plan.findById(id);
        if(!foundPlan){
            return res.status(404).json({ message: "Invalid Plan ID" });
        }
        res.status(200).json({ planDetails: foundPlan });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server Error, Try Again Later" });
    }
}

module.exports = { handleAddPlan, handleEditPlan, handleDeletePlan, handleGetPlans, handleGetPlan };