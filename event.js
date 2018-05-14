//Require mongoose package
const mongoose = require('mongoose');

//Define BucketlistSchema with title, description and category
const EventSchema = mongoose.Schema({
    eventId: {
        type: Number,
        required: true
    },
    userIds: {
        type: [Number],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    day: {
        type: Number
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});


EventSchema.methods.toJson = function () {
    return {
        eventId: this.eventId,
        userIds: this.userIds,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
        description: this.description
    }
}

module.exports = mongoose.model('EventModel', EventSchema);



/*
const TestSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    }
});
*/