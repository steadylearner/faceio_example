import { DataTypes } from "sequelize";

import { withNextCorsSessionRoute } from "../../../../withSession";
import {
  sequelize,
} from "../../../../../db";

import { UserBase } from "../../../../../schemas/user";

const User = require('../../../../../models/user')(sequelize, DataTypes);

// $curl -X POST -H 'Content-Type: application/json' -d '{"facialId":"test"}'  http://localhost:3000/api/v1/user/login
export default withNextCorsSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  // const user = await getUsers().where("username", req.body.username).first();

  const { facialId } = req.body as UserBase;
  const dbUser = await User.findOne({
    where: {
      facialId
    }
  });

  if (dbUser === null) {
    res.status(400).send("");
  } else {
    req.session.user = dbUser.toJSON();
    await req.session.save();
    res.status(200).send("");
  }

});
