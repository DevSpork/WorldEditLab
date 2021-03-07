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
// import { User } from '../../shared/models';

export default () => {
  const router = Router();
  router.get('/', handleHomeView);
  router.get('/login', handleLoginView);
  router.get('/logout', handleLogoutRequest);
  router.post('/login', handleLoginRequest);
  router.get('/pw-reset', handlePWResetView);
  router.post('/pw-reset', handlePWResetRequest);
  router.get('/login/sso', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
      res.redirect('/');
    });
  router.post('/login/sso/callback', handleSamlCallbackRequest);

  return router;
};
