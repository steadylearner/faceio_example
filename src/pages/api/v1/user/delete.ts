import { DataTypes } from "sequelize";

import {
  sequelize,
} from "../../../../../db";

import { withNextCorsSessionRoute } from "../../../../withSession";
import { UpdateUserRequest } from "../../../../../schemas/user";
import { FACEIO_API, FACEIO_API_KEY } from "../../../../environment";

const User = require('../../../../../models/user')(sequelize, DataTypes);

export default withNextCorsSessionRoute(async (req, res) => {
  if (req.method !== "DELETE") {
    res.status(405).send("");
    return;
  }

  if (req.session.user) {
    const { id } = req.session.user;

    const dbUser = await User.findOne({
      where: {
        id
      }
    });

    if (dbUser === null) {
      res.status(400).send({
        error: "Unable to find a user with the id at the database"
      });
    } else {
      const { facialId } = dbUser.toJSON();
      const destroyedUserCount = await User.destroy({
        where: {
          facialId
        }
      });

      if (destroyedUserCount === 1) {
        const { status, error } = await (await fetch(`${FACEIO_API}/deletefacialid?${new URLSearchParams({
          fid: facialId,
          key: FACEIO_API_KEY,
        }).toString()}`)).json();

        if (status !== 200) {
          res.status(400).send({
            // error
            error: "Your account was deleted but facialId wasn't, contact admins",
          });
        }
        
        res.json({
          message: "Your account and facialId were deleted",
        });

        // You can see it was removed at and the database with $yarn list-users
        // https://console.faceio.net/
      } else {
        res.status(400).send({
          error: "Unable to delete the account and facialId"
        });
      }
    }

  } else {
    res.status(400).send({
      error: "Login first"
    });
  }

});
