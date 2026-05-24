const express = require('express');
const { getLoans, addLoan, deleteLoan, updateLoan } = require('../controllers/loan.controller');

const router = express.Router();

router.get('/', getLoans);
router.post('/', addLoan);
router.delete('/:id', deleteLoan);
router.patch('/:id', updateLoan);

module.exports = router;