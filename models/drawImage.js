const mongoose = require('mongoose');

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
        default:1
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    
})

drawImageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

drawImageSchema.set('toJSON', {
    virtuals: true,
});

exports.DrawImage = mongoose.model('DrawImage',  drawImageSchema);