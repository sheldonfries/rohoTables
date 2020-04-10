const router = require('express').Router();

const playerStatsUploader = require('./playerStatsUploader');
const teams = require('./teams');
const players = require('./players');
router.use('/uploader', playerStatsUploader);
router.use('/teams', teams);
router.use('/players', players);
module.exports = router;
