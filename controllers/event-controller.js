var EventModel = require('../models/event');

exports.getAll = function (req, res, next) {
    EventModel.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    }).sort({eventId: -1});
}

exports.getOne = function (req, res, next) {
    EventModel.findOne({ 'eventId': req.params.eventId }, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
}

exports.getAllUserEvents = function (req, res, next) {
    EventModel.find({ 'userIds': req.params.userId }, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
}

exports.getUserDateEvents = function (req, res, next) {
    EventModel.find({ 'date': req.params.date, 'userIds': req.params.userId }, function (err, data) {
        if (err) return next(err);
        res.json(data);
    })
    .sort({startTime: 1});
}

exports.getUserMonthEvents = function (req, res, next) {
    EventModel.find({ 'month': req.params.month, 'userIds': req.params.userId}, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
}

exports.createEvent = function (req, res, next) {
    let splitDate = (req.body.date).split("-");
    let year = splitDate[0];
    let month = splitDate[1];
    let day = splitDate[2];

    let tempEvent = new EventModel({
        eventId: req.body.eventId,
        userIds: req.body.userIds,
        date: req.body.date,
        year: year,
        month: month,
        day: day,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        title: req.body.title,
        description: req.body.description
    })

    tempEvent.save(function (err, obj) {
        if (err) return console.error(err);

        res.status(201).json({
            created: tempEvent.toJson()
        });
    });
}

exports.deleteEvent = function (req, res, next) {
    EventModel.remove({ 'eventId': req.params.eventId }, function (err) {
        if (err) return console.error(err);

        res.status(200).json();
    });
}

exports.deleteAll = function (req, res, next) {
    EventModel.remove({}, function (err) {
        if (err) return console.error(err);

        res.status(200).json();
    });
}

exports.updateEvent = function (req, res, next) {
    let splitDate = (req.body.date).split("-");
    let year = splitDate[0];
    let month = splitDate[1];
    let day = splitDate[2];

    let tempEvent = new EventModel({
        eventId: req.body.eventId,
        userIds: req.body.userIds,
        date: req.body.date,
        year: year,
        month: month,
        day: day,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        title: req.body.title,
        description: req.body.description
    })

    EventModel.findOneAndUpdate({ 'eventId': req.params.eventId }, {
        eventId: req.body.eventId,
        userIds: req.body.userIds,
        date: req.body.date,
        year: year,
        month: month,
        day: day,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        title: req.body.title,
        description: req.body.description
    }, function (err) {
        if (err) return console.error(err);

        res.status(201).json({
            updated: tempEvent.toJson()
        });
    });
}