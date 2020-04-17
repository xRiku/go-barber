const { Router } = require('express');
const routes = new Router();
const UserController = require('./app/controllers/UserController');

routes.post('/users', UserController.store);

module.exports = routes;
