//Require mongoose package
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


//Define BucketlistSchema with title, description and category
const UserSchema = mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }

});


UserSchema.methods.toJson = function () {
    return {
        userId: this.userId,
        username: this.username,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: this.fullName
    }
}

UserSchema.pre('save', function (next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    if (this.password === '*') { cb(null, false); return; }
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
}

module.exports = mongoose.model('UserModel', UserSchema);
