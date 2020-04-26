const Notification = require('../models/Notification');

class NotificationController {
  async index(req, res) {
    return res.json();
  };  
}

module.exports = new NotificationController();