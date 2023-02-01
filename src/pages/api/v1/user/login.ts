import { DataTypes } from "sequelize";

import { withNextCorsSessionRoute } from "../../../../withSession";
import {
  sequelize,
} from "../../../../../db";
import { FACEIO_API, FACEIO_API_KEY } from "../../../../environment";

const User = require('../../../../../models/user')(sequelize, DataTypes);

// $curl -X POST -H 'Content-Type: application/json' -d '{"facialId":"test"}'  http://localhost:3000/api/v1/user/login
export default withNextCorsSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  const { facialId } = req.body;

  // Paid API
  // const { status, error, valid } = await (await fetch(`${FACEIO_API}/checkfacialid?${new URLSearchParams({
  //   fid: facialId,
  //   key: FACEIO_API_KEY,
  // }).toString()}`)).json();

  // if (status !== 200) {
  //   res.status(400).send({
  //     error
  //   });
  // }

  // if (valid === true) {
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
  // } else {
  //   res.status(400).send({
  //     error: "Invalid facialId"
  //   });
  // }
   
  

});
