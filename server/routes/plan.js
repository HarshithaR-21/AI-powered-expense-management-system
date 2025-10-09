const express = require('express');
const { handleAddPlan, handleEditPlan, handleGetPlans, handleDeletePlan, handleGetPlan } = require('../controllers/plan');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add-plan',auth, handleAddPlan);
router.put('/edit-plan/:id', auth, handleEditPlan);
router.get('/get-plans', auth, handleGetPlans);
router.delete('/delete-plan/:id', auth, handleDeletePlan);
router.get('/get-plan-details/:id', auth, handleGetPlan);

module.exports = router;