const router = require('express').Router();

const playerStatsUploader = require('./playerStatsUploader');
const teams = require('./teams');
const players = require('./players');
const stats = require('./stats');
const seasons = require('./seasons');

router.use('/uploader', playerStatsUploader);
router.use('/teams', teams);
router.use('/players', players);
router.use('/stats', stats);
router.use('/seasons', seasons);
module.exports = router;
