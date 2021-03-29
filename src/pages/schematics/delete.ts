import { Request, Response } from 'express';
import { Role, Schematic, User } from '../../shared/models';
import { HTTPErrorResponse, HTTPStatus } from '../../shared/helpers/errorHandler';
import { USED_STRATEGY } from '../../shared/auth/strategies';

export const handleDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  let count: number = 0;

  if (user.role === Role.ADMIN) {
    count = await Schematic.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });
  } else if (user.role === Role.USER) {
    let userOption;
    if (USED_STRATEGY === 'local') {
      userOption = {
        where: {
          uuid: req.params.uuid,
          uploadedById: user.id,
        },
      };
    } else {
      userOption = {
        where: {
          uuid: req.params.uuid,
          uploadedBySamlId: user.id,
        },
      };
    }

    count = await Schematic.destroy(userOption);
  }

  if (count === 1) {
    return res.send({ success: true });
  }
  throw new HTTPErrorResponse(HTTPStatus.NOT_FOUND, 'Not found');
};
