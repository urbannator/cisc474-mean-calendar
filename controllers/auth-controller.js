const jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    User = require('../models/user'),
    config = require('../config/config');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

//========================================
// Login Route
//========================================
exports.login = function (req, res, next) {
    User.findOne({ username: new RegExp('\\b' + req.body.username + '\\b', 'i') }, function (err, user) {
        console.log(user);
        if (err) { return res.status(400).json({ error: "bad data" }); }
        if (!user) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }

        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) { return res.status(400).json({ error: "bad data" }); }
            if (!isMatch) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }

            let userInfo = user.toJson();

            res.status(200).json({
                token: 'Bearer ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
}

exports.authorize = function (req, res, next) {
    return res.status(200).json({
        validated: true
    })
}
//========================================
// Registration Route
//========================================
exports.register = function (req, res, next) {
    // Check for registration errors
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userId = req.body.userId;

    if (!userId)
        return res.status(422).send({ error: 'No userId passed to register with.' })
    if (!username) {
        return res.status(422).send({ error: 'You must enter a username.' });
    }
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    User.findOne({ username: username }, function (err, existingUser) {
        if (err) { return next(err); }
        if (existingUser) {
            res.status(422).send({ error: 'Username already taken!' });
        } else {
            let user = new User({
                userId: userId,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                fullName: firstName + ' ' + lastName
            });

            user.save(function (err, user) {
                if (err) { return next(err); }
                let userInfo = user.toJson();
                res.status(201).json({
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                });
            });
        }
    });
}

exports.getUsersByName = function (req, res, next) {
    User.find({'fullName': { "$regex": req.params.searchTerm, "$options": "i" }}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getUsers = function (req, res, next) {
    User.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getUser = function (req, res, next) {
    User.findOne({ 'userId': req.params.userId }, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
}

exports.deleteUsers = function (req, res, next) {
    User.remove({}, function (err) {
        if (err) return console.error(err);

        res.status(200).json();
    });
}

exports.deleteUser = function (req, res, next) {
    User.remove({ 'userId': req.params.userId }, function (err) {
        if (err) return console.error(err);

        res.status(200).json();
    });
}