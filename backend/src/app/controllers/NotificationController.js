const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.findAll({ where: { user: req.userId } });


    return res.json(notifications);
  };
}

module.exports = new NotificationController();