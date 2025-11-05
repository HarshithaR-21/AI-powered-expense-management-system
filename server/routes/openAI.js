const express = require("express");
const router = express.Router();
const handleRequest = require("../controllers/openAI");

router.post('api/ai-response', handleRequest);

module.exports = router;