const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_date: Date,
    amount: Number
});

const fineSchema = new mongoose.Schema({
    accrualDate: Date,
    amount: Number,
    reason: String,
    paymentDate: Date
});

const loanSchema = new mongoose.Schema({
    id: String,
    clientId: String,
    loanTypeId: String,
    loanAmount: Number,
    issuedDate: Date,
    scheduledReturnDate: Date,
    actualReturnDate: Date,


    payments: [paymentSchema],
    fines: [fineSchema]
}, {
    timestamps: true
});

const DeletionLog = require('./DeletionLog');

loanSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            await new DeletionLog({
                documentId: doc._id,
                modelType: 'Loan'
            }).save();
            console.log(`Deletion logged: ${doc._id}`);
        } catch (err) {
            console.error('Error saving deletion log:', err);
        }
    }
});

module.exports = mongoose.model('Loan', loanSchema);