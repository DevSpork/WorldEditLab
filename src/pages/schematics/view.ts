import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { FindOptions } from 'sequelize/types/lib/model';
import { buildDefaultResponse } from '../../shared/response';
import {
  Access, Schematic, SchematicCategory, User,
} from '../../shared/models';
import { createResponseFromRow } from './shared';
import { USED_STRATEGY } from '../../shared/auth/strategies';
import { SamlUser } from '../../shared/models/samlUser';

export const handleIndexView = async (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);

  const isLoggedIn = req.user !== undefined;
  const user = req.user as User;

  const searchOptions: FindOptions = {
    attributes: ['uuid', 'name', 'createdAt', 'access', 'uploadedById', 'categoryId'],
  };

  if (isLoggedIn) {
    searchOptions.where = {
      [Op.or]: {
        access: {
          [Op.lte]: Access.INTERNAL,
        },
        uploadedById: user.id,
        uploadedBySamlId: user.id,
      },
    };

    if (USED_STRATEGY === 'local') {
      searchOptions.include = [
        {
          model: User,
          attributes: ['name'],
          as: 'uploadedBy',
        },
      ];
    } else if (USED_STRATEGY === 'saml') {
      searchOptions.include = [
        {
          model: SamlUser,
          attributes: ['name'],
          as: 'uploadedBySaml',
        },
      ];
    }
  } else {
    searchOptions.where = {
      access: Access.PUBLIC,
    };
  }

  const responseCategories = await SchematicCategory.findAll({ attributes: ['id', 'name'] });
  const rawResponse = await Schematic.findAll(searchOptions);
  const response = rawResponse.map((row) => (createResponseFromRow(row, user)));

  responseData.data = {
    baseURL: process.env.BASE_URL,
    runtimeData: JSON.stringify({
      table: response,
      categories: responseCategories,
    }),
  };

  res.render('schematics', responseData);
};
