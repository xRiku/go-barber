const { Sequelize, Model } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        filename: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.filename}`
          }
        }
      },
      {
        sequelize,
      }
    );


    return this;
  }
}

module.exports = File;