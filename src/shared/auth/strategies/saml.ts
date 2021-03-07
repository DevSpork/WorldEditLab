import { Strategy } from 'passport-saml';
import passport from 'passport';

export interface SAMLStrategy {
  init(): void;
}

const SAML_ENTRY_POINT = process.env.SAML_ENTRY_POINT as string;
const ISSUER_NAME = process.env.ISSUER_NAME as string;

export const samlStrategy = () => ({
  init() {
    passport.use(new Strategy(
      {
        path: '/login/sso/callback',
        entryPoint: SAML_ENTRY_POINT,
        issuer: ISSUER_NAME,
      },
      (profile:any, done:any) => done(null, profile),
    ));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user:any, done) => {
      done(null, user);
    });
  },
} as SAMLStrategy);
