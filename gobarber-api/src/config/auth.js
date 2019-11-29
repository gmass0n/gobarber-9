// CONFIGURAÇÕES DA AUTENTICAÇÃO

export default {
  // TEXTO SECRETO DO TOKEN (gobarberapigostack9)
  secret: process.env.APP_SECRET,
  // DATA DE EXPIRAÇÃO DO TOKEN
  expiresIn: '7d',
};
