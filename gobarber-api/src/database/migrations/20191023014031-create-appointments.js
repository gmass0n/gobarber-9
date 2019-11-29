/* CREATE APPOINTMENTS MIGRATION */

// EXPORTS
module.exports = {
  // PARA QUANDO A MIGRATION FOR EXECUTADA (criar a tabela)
  up: ( queryInterface, Sequelize ) => queryInterface.createTable( 'appointments', {
    // ID DO AGENDAMENTO
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // NOME DO AGENDAMENTO
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // ID DO USUÁRIO QUE MARCOU O AGENDAMENTO
    user_id: {
      // TIPO DA COLUNA
      type: Sequelize.INTEGER,
      // CHAVE ESTRANGEIRA
      references: { model: 'users', key: 'id' },
      // O QUE ACONTECE CASO O AGENDAMENTO FOR ATUALIZADO
      onUpdate: 'CASCADE',
      // O QUE ACONTECE CASO O AGENDAMENTO FOR DELETADO
      onDelete: 'SET NULL',
      // PERMITE QUE O AGENDAMENTO SEJA NULO
      allowNull: true,
    },
    // PRESTADOR DE SERVIÇOS QUE VAI ATENDER O AGENDAMENTO
    provider_id: {
      // TIPO DA COLUNA
      type: Sequelize.INTEGER,
      // CHAVE ESTRANGEIRA
      references: { model: 'users', key: 'id' },
      // O QUE ACONTECE CASO O AGENDAMENTO FOR ATUALIZADO
      onUpdate: 'CASCADE',
      // O QUE ACONTECE CASO O AGENDAMENTO FOR DELETADO
      onDelete: 'SET NULL',
      // PERMITE QUE O AGENDAMENTO SEJA NULO
      allowNull: true,
    },
    // DATA DE QUANDO AGENDAMENTO FOI CANCELADO
    canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    // DATA DE QUANDO O AGENDAMENTO FOI CRIADO
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // DATA DE QUANDO O AGENDAMENTO FOI ALTERADO
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  } ),

  // PARA QUANDO FOR ALTERAR AS INFORMAÇÕES DA MIGRATION (excluir)
  down: ( queryInterface ) => queryInterface.dropTable( 'appointments' ),
};
