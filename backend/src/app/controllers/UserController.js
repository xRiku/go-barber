const User = require('../models/User');
const Yup = require('yup');

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({
      where: {
        email: request.body.email
      }
    });

    if (userExists) {
      return response.status(400).json({ error: "User already exists" });
    }


    const { id, name, email, provider } = await User.create(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(request, response) {
    const { email, oldPassword } = request.body;
    const user = await User.findByPk(request.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return response.status(400).json({ error: 'User arleady exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(400).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(request.body);


    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

module.exports = new UserController;