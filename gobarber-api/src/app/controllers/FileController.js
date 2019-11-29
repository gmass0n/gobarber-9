// FILE CONTROLLER

// IMPORTS
import File from '../models/File';

class FileController {
  // MÉTODO PARA UPLOAD DE ARQUIVO
  async store( req, res ) {
    // ARMAZENA APENAS O NOME DO ARQUIVO E NOME ORIGINAL DO ARQUIVO
    const { originalname: name, filename: path } = req.file;

    // SALVA O ARQUIVO NO BANCO DE DADOS APENAS COM AS INFORMAÇÕES ARMAZENADAS ANTERIORMENTE
    const file = await File.create( {
      name,
      path,
    } );

    // RETORNA AS INFORMAÇÕES DO ARQUIVO
    return res.json( file );
  }
}

// EXPORT
export default new FileController();
