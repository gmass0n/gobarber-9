/* ADD AVATAR FIELD MIGRATION */

module.exports = {
  // UTILIZADO QUANDO A MIGRATION FOR EXECUTADA (criar a coluna)
  up: ( queryInterface, Sequelize ) => queryInterface.addColumn(
    // TABELA ONDE VAI ADICIONAR A COLUNA
    'users',
    // NOME DA COLUNA QUE IRÁ SER ADICIONADA
    'avatar_id',
    // INFORMAÇÕES DA COLUNA
    {
      // TIPO DA COLUNA
      type: Sequelize.INTEGER,
      // CHAVE ESTRANGEIRA
      references: { model: 'files', key: 'id' },
      // O QUE ACONTECE CASO O ARQUIVO FOR ATUALIZADO
      onUpdate: 'CASCADE',
      // O QUE ACONTECE CASO O ARQUIVO FOR DELETADO
      onDelete: 'SET NULL',
      // PERMITE QUE O ARQUIVO SEJA NULO
      allowNull: true,
    },
  ),

  // UTILIZADO QUANDO FOR ALTERAR AS INFORMAÇÕES DA MIGRATION (excluir)
  down: ( queryInterface ) => queryInterface.removeColumn(
    // TABELA QUE ESTÁ A COLUNA
    'users',
    // NOME DA COLUNA QUE IRÁ SER EXCLUIDA
    'avatar_id',
  ),
};
