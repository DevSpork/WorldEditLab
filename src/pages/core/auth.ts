import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Op } from 'sequelize';
import { buildDefaultResponse } from '../../shared/response';
import {LOCAL_SQLITE_STRATEGY, USED_STRATEGY} from '../../shared/auth/strategies';
import { Role, User } from '../../shared/models';
import { hashPassword } from '../../shared/auth/password';
import { SamlUser } from '../../shared/models/samlUser';

export const handleLogoutRequest = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
};

export const handleLoginRequest = (req: Request, res: Response, next: NextFunction) => {
  const responseData = buildDefaultResponse(req);
  passport.authenticate(LOCAL_SQLITE_STRATEGY, (err: Error, user: User) => {
    if (err) {
      responseData.data = {
        errorMessage: err.message,
      };
      res.render('login', responseData);
      return;
    }

    if (user.forcePasswordUpdate) {
      res.redirect('/pw-reset');
    } else {
      req.login(user, () => {
        res.redirect('/');
      });
    }
  })(req, res, next);
};

export const handleSamlLoginRequest = (req: Request, res: Response) => {
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};

export const handleSamlCallbackRequest = (req: Request, res: Response, next: NextFunction) => {
  const responseData = buildDefaultResponse(req);
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }, (err: Error, user: any) => {
    const ADMIN_ROLE_NAME = '/admin';
    const ROLE_PROPERTY = 'roles';
    const USERNAME_PROPERTY = 'Username';

    const username = user[USERNAME_PROPERTY];

    let userrole = Role.USER;
    if (Array.isArray(user[ROLE_PROPERTY])) {
      user.roles.forEach(((role: string) => {
        if (role === ADMIN_ROLE_NAME) userrole = Role.ADMIN;
      }));
    } else if (user.roles === ADMIN_ROLE_NAME) userrole = Role.ADMIN;

    SamlUser.findOrCreate({
      where: { name: username },
      defaults: {
        name: username,
        role: 1,
      },
    }).then((result) => {
      const samlUser = result[0];
      const created = result[1];

      // Update the user role if necessary
      if (!created) {
        samlUser.role = userrole;
        SamlUser.update({
          role: userrole,
        }, {
          where: {
            id: samlUser.id,
          },
        });
      }

      req.login(samlUser, () => {
        res.redirect('/');
      });
    }).catch((sqlErr) => {
      console.log(sqlErr);
      responseData.data = {
        errorMessage: 'Database error',
      };
      res.render('login', responseData);
    });
  })(req, res, next);
};

export const handleLoginView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  // @ts-ignore
  responseData.data.strategy = USED_STRATEGY;
  res.render('login', responseData);
};

export const handlePWResetView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('pwreset', responseData);
};

export const handlePWResetRequest = (req: Request, res: Response, next: NextFunction) => {
  const responseData = buildDefaultResponse(req);
  passport.authenticate(LOCAL_SQLITE_STRATEGY, (err: Error, user: User) => {
    if (err) {
      responseData.data = {
        errorMessage: err.message,
      };
      res.render('pwreset', responseData);
      return;
    }

    const newPassword = req.body.new_password as string;

    if (newPassword !== req.body.new_password_2) {
      responseData.data = {
        errorMessage: 'The new passwords must match',
      };
      res.render('pwreset', responseData);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
      responseData.data = {
        errorMessage: 'The password must be between 8 and 32 characters long',
      };
      res.render('pwreset', responseData);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    user.password = hashPassword(newPassword);
    // eslint-disable-next-line no-param-reassign
    user.forcePasswordUpdate = false;

    user.save({}).then(() => {
      req.login(user, () => {
        res.redirect('/');
      });
    });
  })(req, res, next);
};
