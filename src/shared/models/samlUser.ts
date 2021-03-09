import { DataTypes, Model, Sequelize } from 'sequelize';
import { Role } from './role';
import { UserAttributes } from '../interfaces/userAttributes';

export class SamlUser extends Model implements UserAttributes {
  public name!: string;

  public role!: Role;

  public id!: number;
}

export const initSamlUser = async (sequelize: Sequelize) => {
  SamlUser.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Role.GUEST,
    },
  }, {
    sequelize,
    modelName: 'SamlUser',
    tableName: 'saml_user',
  });
};
