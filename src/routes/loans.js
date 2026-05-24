const express = require('express');
const { getLoans, addLoan, deleteLoan } = require('../controllers/loan.controller');

const router = express.Router();

router.get('/', getLoans);
router.post('/new', addLoan);
router.delete('/:id', deleteLoan);

module.exports = router;
