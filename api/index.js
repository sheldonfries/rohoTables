const router = require('express').Router();

const playerStatsUploader = require('./playerStatsUploader');
const teams = require('./teams');
const players = require('./players');
const stats = require('./stats');
const seasons = require('./seasons');
const transactions = require('./transactions');
const trades = require('./trades');

router.use('/uploader', playerStatsUploader);
router.use('/teams', teams);
router.use('/players', players);
router.use('/stats', stats);
router.use('/seasons', seasons);
router.use('/transactions', transactions);
router.use('/trades', trades);

module.exports = router;
