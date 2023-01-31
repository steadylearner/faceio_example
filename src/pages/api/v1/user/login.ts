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

  const { facialId } = req.body as UserBase;
  const dbUser = await User.findOne({
    where: {
      facialId
    }
  });

  if (dbUser === null) {
    res.status(400).send({
      error: "Sign Up first"
    });
  } else {
    const {
      facialId,
      ...user
    } = dbUser.toJSON();

    req.session.user = user;
    await req.session.save();
    
    res.json({
      user,
    })
  }

});
