const Yup = require('yup');
const { startOfHour, parseISO, isBefore, format, subHours } = require('date-fns');
const pt = require('date-fns/locale/pt');
const User = require('../models/User');
const File = require('../models/File');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

const Mail = require('../../lib/Mail');

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limite: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'filename', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }


  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const { provider_id, date } = req.body;

    /**
     * Check if user_id equals to provider_id
     */
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'Provider cannot create an appointment with itself' });
    }
    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'User is not a provider or does not exist' });
    }
    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' })
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    })

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      user: req.userId,
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
    });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You cannot delete another person's appointment"
      });
    }
    
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance'
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();


    return res.json(appointment);
  }
}

module.exports = new AppointmentController();