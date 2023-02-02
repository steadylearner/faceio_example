import { DataTypes } from "sequelize";

import { withNextCorsSessionRoute } from "../../../../withSession";
import {
  sequelize,
} from "../../../../../db";

import { UpdateUserRequest } from "../../../../../schemas/user";

const User = require('../../../../../models/user')(sequelize, DataTypes);

// https://www.npmjs.com/package/next-connect
export default withNextCorsSessionRoute(async (req, res) => {
  if (req.method !== "PATCH") {
    res.status(405).send("");
    return;
  }

  if (req.session.user) {
    const { id } = req.session.user;

    const { name, email } = req.body as UpdateUserRequest;
    const usersUpdated = (await User.update(
      {
        name,
        email,
      },
      {
        where: {
          id,
        }
      }
    ))[0];

    if (usersUpdated === 0) {
      res.status(400).send({
        error: "Unable to update the proifle"
      });
    } else {
      const updatedUser = {
        ...req.session.user,
        name,
        email,
      }

      req.session.user = updatedUser;
      await req.session.save();

      res.json({
        updatedUser,
      })
    }

  } else {
    res.status(400).send({
      error: "Login first"
    });
  }
});
