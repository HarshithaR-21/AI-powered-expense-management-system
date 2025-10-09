const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    creatorId : {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    membersCount: {
        type: Number,
    },
    friendsList: {
        type: Array,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

const plan = mongoose.model('plan', planSchema);

module.exports = plan;