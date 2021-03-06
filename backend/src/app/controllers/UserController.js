const User = require('../models/User');
const File = require('../models/File');
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
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      oldPassword: Yup.string().min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = request.body;
    const user = await User.findByPk(request.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return response.status(400).json({ error: 'User arleady exists' });
      }
    }

    if (oldPassword && password && !(await user.checkPassword(oldPassword))) {
      return response.status(400).json({ error: 'Password does not match' });
    }

    await user.update(request.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'filename','url'],
        }
      ]
    })


    return response.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

module.exports = new UserController;