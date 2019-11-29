// CONFIGURAÇÃO DO DATABASE

// IMPORT
require( 'dotenv/config' );

// EXPORT
module.exports = {
  // DIALETO QUE O DATABASE ESTÁ USANDO
  dialect: 'postgres',
  // HOST QUE O DATABASE ESTÁ HOSPEDADO
  host: process.env.DB_HOST,
  // USUÁRIO
  username: process.env.DB_USER,
  // SENHA
  password: process.env.DB_PASS,
  // NOME DO DATA BASE
  database: process.env.DB_NAME,
  // FUNCIONALIDADES A MAIS
  define: {
    // ADICIONA UMA TABELA COM 'created_at' e 'updated_at'
    timestamps: true,
    // DEFINE O PADRAO DE NOMECLATURA DAS TABELAS NO PADRÃO UNDERSCORED (sem CamelCase)
    underscored: true,
    // DEFINE O PADRÃO PARA COLUNAS E RELACIONAMENTOS TAMBÉM
    underscoredAll: true,
  },
};
