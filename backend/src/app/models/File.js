const { Sequelize, Model } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        filename: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );


    return this;
  }
}

module.exports = File;