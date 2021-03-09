import { Router } from 'express';
import passport from 'passport';
import {
  handleLoginRequest,
  handleLoginView,
  handleLogoutRequest,
  handlePWResetRequest,
  handlePWResetView, handleSamlCallbackRequest,
} from './auth';
import { handleHomeView } from './home';
import { USED_STRATEGY } from '../../shared/auth/strategies';
// import { User } from '../../shared/models';

export default () => {
  const router = Router();
  router.get('/', handleHomeView);
  router.get('/login', handleLoginView);
  router.get('/logout', handleLogoutRequest);
  // @ts-ignore
  if (USED_STRATEGY === 'local') {
    router.post('/login', handleLoginRequest);
    router.get('/pw-reset', handlePWResetView);
    router.post('/pw-reset', handlePWResetRequest);
  } else if (USED_STRATEGY === 'saml') {
    router.get('/login/sso', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
      (req, res) => {
        res.redirect('/');
      });
    router.post('/login/sso/callback', handleSamlCallbackRequest);
  }

  return router;
};
