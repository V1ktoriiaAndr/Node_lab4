const express = require('express');
const { getLoans, addLoan, deleteLoan } = require('../controllers/loan.controller');

const router = express.Router();

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *   post:
 *     summary: Create new loan
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete loan by ID
 */

router.get('/', getLoans);

router.post('/new', addLoan);

router.delete('/:id', deleteLoan)
module.exports = router;
