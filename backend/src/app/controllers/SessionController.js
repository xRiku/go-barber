const User = require('../models/User');

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;
    const user = User.findOne({ where: { email } });
    if (!user) {
      return response.status(401).json({ error: "User not found" });
    }
    if (!await user.checkPassword(password)) {
      return response.status(401).json({ error: "Password does not match" })
    }
  }
}

module.exports = new SessionController();