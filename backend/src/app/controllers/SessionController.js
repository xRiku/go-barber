const jwt = require('jsonwebtoken');
const User = require('../models/User');
const File = require('../models/File');
const authConfig = require('../../config/auth');
const Yup = require('yup');

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = request.body;
    const user = await User.findOne({ where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'filename', 'url'],
        }
      ] });
    if (!user) {
      return response.status(401).json({ error: "User not found" });
    }
    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: "Password does not match" })
    }

    const { id, name, avatar, provider } = user;

    return response.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();