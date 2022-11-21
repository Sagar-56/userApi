var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const confiq = require('../configs/config').get(process.env.MONGODB_URI);
const salt = 10;


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    password2: {
        type: String,
        required: true,
        minlength: 8

    },
    token: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcryptjs.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcryptjs.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                user.password2 = hash;
                next();
            })

        })
    }
    else {
        next();
    }

})



    userSchema.methods.comparePassword = function (password, cb) {
        bcryptjs.compare(password, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        })
    }
// })

// generate token
userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), confiq.SECRET);
    user.token = token;
    user.save(function (err, save) {
        if (err) return cb(err);
        cb(null, user);
    })
}

// find by token
userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    jwt.verify(token, confiq.SECRET, function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

//delete token
userSchema.methods.deleteToken = function (token, cb) {
    var user = this;
    user.update({ $unset: { token: 1 } }, function (err, user) {
        if (err) return cb(err);
        cb(null, user)
    })
}
module.exports = mongoose.model("users", userSchema)