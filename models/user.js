let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
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
    role: {
        type: String,
        default: 'user'
    }
});

UserSchema.pre('save', function (next) {
    let user = this
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            console.log(2000, 'Compare password error');
            return callback(err);
        }
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);