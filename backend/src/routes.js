const { Router } = require('express');
const routes = new Router();
const User = require('./app/models/User');

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Philipe',
    email: 'lipe.aguiar@gmail.com',
    password_hash: '12308140',
  });
  return res.json(user);
});

module.exports = routes;
