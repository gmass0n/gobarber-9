/* CREATE FILES MIGRATION */

// EXPORTS
module.exports = {
  // PARA QUANDO A MIGRATION FOR EXECUTADA (criar a tabela)
  up: ( queryInterface, Sequelize ) => queryInterface.createTable( 'files', {
    // ID DO ARQUIVO
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // NOME DO AQRUIVO
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // PATH DO ARQUIVO
    path: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    // DATA DE QUANDO O ARQUIVO FOI CRIADO
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // DATA DE QUANDO O AQUIVO FOI ALTERADO
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  } ),

  // PARA QUANDO FOR ALTERAR AS INFORMAÇÕES DA MIGRATION (excluir)
  down: ( queryInterface ) => queryInterface.dropTable( 'files' ),
};
