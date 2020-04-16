const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (request, response) => {
  return response.send('Teste');
});

module.exports = server;