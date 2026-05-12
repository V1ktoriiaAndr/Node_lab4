const Loan = require('../models/Loan'); // ️ Заміни на '../models/Book', якщо сутність називається Book

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Операції з кредитами (Loans)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати всі кредити
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: Список кредитів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 2 }
 *                 data: { type: array, items: { type: object } }
 *       500:
 *         description: Помилка сервера
 */
const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: loans.length, data: loans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Створити новий кредит
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - loan_type_id
 *               - loan_amount
 *             properties:
 *               client_id: { type: string, example: "652a1b2c1234567890abcdef" }
 *               loan_type_id: { type: string, example: "652a1b3d1234567890fedcba" }
 *               loan_amount: { type: number, example: 150000.00 }
 *               issue_date: { type: string, format: date-time, example: "2024-01-15T10:00:00.000Z" }
 *     responses:
 *       201:
 *         description: Кредит успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400:
 *         description: Помилка валідації
 */
const addLoan = async (req, res) => {
    try {
        const newLoan = await Loan.create(req.body);
        res.status(201).json({ success: true, data: newLoan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Видалити кредит (з логуванням)
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId кредиту
 *     responses:
 *       200:
 *         description: Кредит видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Loan deleted" }
 *                 data: { type: object }
 *       404:
 *         description: Кредит не знайдено
 *       500:
 *         description: Помилка сервера
 */
const deleteLoan = async (req, res) => {
    try {
        const deletedLoan = await Loan.findByIdAndDelete(req.params.id);

        if (!deletedLoan) {
            return res.status(404).json({ success: false, message: 'Loan not found' });
        }

        res.status(200).json({ success: true, message: 'Loan deleted', data: deletedLoan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getLoans, addLoan, deleteLoan };