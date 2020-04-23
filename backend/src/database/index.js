const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User')
const File = require('../app/models/File')


const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();