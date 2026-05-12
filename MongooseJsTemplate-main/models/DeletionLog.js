const mongoose = require('mongoose');

const deletionLogSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    modelType: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeletionLog', deletionLogSchema);