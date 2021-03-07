import { Role } from './role';
import { UserAttributes } from '../interfaces/userAttributes';

export class SamlUser implements UserAttributes {
  public name!: string;

  public role!: Role;

  constructor(name: string, role: Role) {
    this.name = name;
    this.role = role;
  }
}
