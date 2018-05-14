const eventController = require('./controllers/event-controller');
const authController = require('./controllers/auth-controller');
const express = require('express');

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    apiRoutes.get('/events', eventController.getAll);
    apiRoutes.get('/events/:eventId', eventController.getOne);

    apiRoutes.get('/:userId/events', eventController.getAllUserEvents);
    apiRoutes.get('/:userId/events/date/:date', eventController.getUserDateEvents);
    apiRoutes.get('/:userId/events/month/:month', eventController.getUserMonthEvents);

    apiRoutes.post('/events', eventController.createEvent);

    apiRoutes.put('/events/:eventId', eventController.updateEvent);

    apiRoutes.delete('/events/:eventId', eventController.deleteEvent);
    apiRoutes.delete('/events', eventController.deleteAll);


    authRoutes.post('/users/register', authController.register);
    authRoutes.post('/users/login', authController.login);

    authRoutes.get('/users', authController.getUsers);
    authRoutes.get('/users/:userId', authController.getUser);
    authRoutes.get('/users/search/:searchTerm', authController.getUsersByName);

    authRoutes.delete('/users', authController.deleteUsers);
    authRoutes.delete('/users/:userId', authController.deleteUser);


    app.use('/auth', authRoutes);
    app.use('/api', apiRoutes);
};