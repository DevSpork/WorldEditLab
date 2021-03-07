export class CallbackUser {
  issuer: string;

  inResponseTo: string;

  sessionIndex: string;

  nameID: string;

  nameIDFormat: string;

  nameQualifier: string;

  spNameQualifier: string;

  role: string;

  // eslint-disable-next-line max-len
  constructor(issuer: string, inResponseTo: string, sessionIndex: string, nameID: string, nameIDFormat: string, nameQualifier: string, spNameQualifier: string, role: string) {
    this.issuer = issuer;
    this.inResponseTo = inResponseTo;
    this.sessionIndex = sessionIndex;
    this.nameID = nameID;
    this.nameIDFormat = nameIDFormat;
    this.nameQualifier = nameQualifier;
    this.spNameQualifier = spNameQualifier;
    this.role = role;
  }
}
