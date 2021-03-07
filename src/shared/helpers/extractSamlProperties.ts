import { SamlUser } from '../models/samlUser';
import { Role } from '../models';

export const parseXML = (xmlObj: any): SamlUser => {
  const ADMIN_ROLE_STRING = '/admin';
  const USERNAME_ATTRIBUTE = 'Username';
  const ROLE_ATTRIBUTE = 'roles';

  let admin = Role.USER;
  let username = '';

  const attributes = xmlObj['samlp:Response']['saml:Assertion'][0]['saml:AttributeStatement'][0]['saml:Attribute'];
  attributes.forEach((attr:any) => {
    if (attr.$.Name === ROLE_ATTRIBUTE) {
      attr['saml:AttributeValue'].forEach((role:any) => {
        if (role._ === ADMIN_ROLE_STRING) admin = Role.ADMIN;
      });
    } else if (attr.$.FriendlyName === USERNAME_ATTRIBUTE) {
      username = attr['saml:AttributeValue'][0]._;
    }
  });

  return new SamlUser(username, admin);
};
