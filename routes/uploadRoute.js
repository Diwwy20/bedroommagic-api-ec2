const express = require('express');
const { generateImages, contentBased } = require('../controllers/uploadController');

// router object
const router = express.Router();

// Generate
router.post('/generate', generateImages);

router.post('/cbir', contentBased)

module.exports = router
