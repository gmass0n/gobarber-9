// PROVIDER CONTROLLER

// IMPORTS
import User from '../models/User';
import File from '../models/File';

class ProviderController {
  // MÉTODO PARA LISTAGEM DE PRESTADORES DE SERVIÇOS
  async index( req, res ) {
    // BUSCA TODOS OS PROVIDERS QUE SÃO PRESTADORES DE SERVIÇOS
    const providers = await User.findAll( {
      where: {
        provider: true,
      },
      // ATRIBUTOS QUE VAO RETORNAR
      attributes: [
        'id',
        'name',
        'email',
        'avatar_id',
      ],
      // INCLUI OUTRA INFORMAÇOES DE OUTRA TABELA
      include: [
        {
          // NOME DO MODEL
          model: File,
          // NOME COMO IRÁ APARECER
          as: 'avatar',
          // ATRIBUTOS QUE VAO RETORNAR
          attributes: [
            'name',
            'path',
            'url',
          ],
        },
      ],
    } );

    // RETORNA TODOS OS PROVIDERS
    return res.json( providers );
  }
}

// EXPORT
export default new ProviderController();
