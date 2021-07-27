const mongoose = require('mongoose');
const { statuses } = require('../helpers/statuses');

const drawImageSchema = mongoose.Schema({
    image: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    status: {
        type: Number,
        default: statuses.active
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
   
    
})

drawImageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

drawImageSchema.set('toJSON', {
    virtuals: true,
});

exports.DrawImage = mongoose.model('DrawImage',  drawImageSchema);