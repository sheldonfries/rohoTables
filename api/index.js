const router = require('express').Router();

const playerStatsUploader = require('./playerStatsUploader');
const teams = require('./teams');
router.use('/uploader', playerStatsUploader);
router.use('/teams', teams);
module.exports = router;
