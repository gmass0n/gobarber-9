/* MIGRATION DE CRIAÇÃO DE USUÁRIOS */

// EXPORTS
module.exports = {
  // PARA QUANDO A MIGRATION FOR EXECUTADA (criar a tabela)
  up: ( queryInterface, Sequelize ) => queryInterface.createTable( 'users', {
    // ID DO USUÁRIO
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // NOME DO USUÁRIO
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // EMAIL DO USUÁRIO
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    // SENHA DO USUÁRIO
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // PROVEDOR DO USUÁRIO (cliente ou prestador de serviços)
    provider: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // DATA DE QUANDO O USUÁRIO FOI CRIADO
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // DATA DE QUANDO O USUÁRIO FOI ALTERADO
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  } ),

  // PARA QUANDO FOR ALTERAR AS INFORMAÇÕES DA MIGRATION (excluir)
  down: ( queryInterface ) => queryInterface.dropTable( 'users' ),
};
