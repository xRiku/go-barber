const { Sequelize, Model } = require('sequelize');
const User = require('./User');

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        content: Sequelize.STRING,
        read: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user' });
  }

}

module.exports = Notification;