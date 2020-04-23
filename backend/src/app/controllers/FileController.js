const File = require('../models/File');

class FileController {
  async store(req, resp) {
    const { originalname: name, filename } = req.file;
    
    const file = await File.create({
      name,
      filename
    });

    return resp.status(200).json(file);
  }
}

module.exports = new FileController();