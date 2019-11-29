/* eslint-disable require-atomic-updates */
// MODEL DE USUÁRIO

// IMPORTS
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init( sequelize ) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );

    // FAZ A CRIPTOGRAFIA DA SENHA
    this.addHook( 'beforeSave', async ( user ) => {
      if ( user.password ) {
        user.password_hash = await bcrypt.hash( user.password, 8 );
      }
    } );

    return this;
  }

  static associate( models ) {
    this.belongsTo( models.File, { foreignKey: 'avatar_id', as: 'avatar' } );
  }

  // VERIFICA SE A SENHA É IGUAL A SENHA CRIPTOGRAFADA
  checkPassword( password ) {
    return bcrypt.compare( password, this.password_hash );
  }
}

// EXPORT
export default User;
