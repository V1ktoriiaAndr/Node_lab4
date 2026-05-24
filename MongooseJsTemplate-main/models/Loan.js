const mongoose = require('mongoose');
const DeletionLog = require('./DeletionLog');

const loanSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: [true, 'client_id is required'],
      match: [/^[0-9a-fA-F]{24}$/, 'client_id must be a valid MongoDB ObjectId'],
    },
    loan_type_id: {
      type: String,
      required: [true, 'loan_type_id is required'],
      match: [/^[0-9a-fA-F]{24}$/, 'loan_type_id must be a valid MongoDB ObjectId'],
    },
    loan_amount: {
      type: Number,
      required: [true, 'loan_amount is required'],
      min: [0.01, 'loan_amount must be positive'],
    },
    issue_date: {
      type: Date,
      default: Date.now,
    },
    scheduled_return_date: {
      type: Date,
      required: [true, 'scheduled_return_date is required'],
    },
    actual_return_date: {
      type: Date,
      default: null,
    },
    payments: [
      {
        payment_date: { type: Date },
        amount: { type: Number, min: 0 },
      },
    ],
    fines: [
      {
        accrual_date: { type: Date },
        amount: { type: Number, min: 0 },
        reason: { type: String },
        payment_date: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Middleware для логування видалення
loanSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      await new DeletionLog({
        documentId: doc._id,
        modelType: 'Loan',
      }).save();
      console.log(`Deletion logged: ${doc._id}`);
    } catch (err) {
      console.error('Error saving deletion log:', err);
    }
  }
});

module.exports = mongoose.model('Loan', loanSchema);
