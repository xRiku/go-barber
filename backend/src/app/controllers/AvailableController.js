class AvailableController {
  async index(req, res) {
    return res.json({status: 'ok'});
  }
}

module.exports = new AvailableController();