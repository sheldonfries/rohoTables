const router = require('express').Router();

const playerStatsUploader = require('./playerStatsUploader');

router.use('/uploader', playerStatsUploader);

module.exports = router;
