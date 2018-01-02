let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model('Contact', ContactSchema);