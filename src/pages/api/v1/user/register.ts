import { DataTypes } from "sequelize";
// import NextCors from 'nextjs-cors';

import {
  sequelize,
} from "../../../../../db";

import { withNextCorsSessionRoute } from "../../../../withSession";
import validateUser, { UserValidationResult } from "../../../../validateUser";
import { UserCreate } from "../../../../../schemas/user";

// import { CORS_ALLOWED_ORGIN } from "../../../../environment";

const User = require('../../../../../models/user')(sequelize, DataTypes);

// $curl -X POST -H 'Content-Type: application/json' -d '{"facialId":"test", "name":"name", "email":"email@example.com"}'  http://localhost:3000/api/v1/user/register
export default withNextCorsSessionRoute(async (req, res) => {
  // await NextCors(req, res, {
  //   // Options
  //   methods: ['POST'],
  //   origin: CORS_ALLOWED_ORGIN,
  //   optionsSuccessStatus: 200,
  // });

  if (req.method !== "POST") {
    res.status(405).send(""); // Incorrect request method
    return;
  }

  const { 
    facialId, 
    name, 
    email,
  } = req.body as UserCreate;

  const dbUserByFacialId = await User.findOne({
    where: {
      facialId
    }
  });

  if (dbUserByFacialId === null) {
    let userValidationResult = validateUser(name, email);

    if (userValidationResult === UserValidationResult.None) {
      const dbUserByEmail = await User.findOne({
        where: {
          email
        }
      });

      if(dbUserByEmail !== null) {
        userValidationResult = UserValidationResult.TakenEmail;
      }
    }

    if (userValidationResult !== UserValidationResult.None) {
      res.status(400).send(userValidationResult);
      return;
    }

    const newUser = await User.create({
      facialId,
      name,
      email,
    });

    // console.log("newUser");
    // console.log(newUser.toJSON());

    res.status(200).send(userValidationResult);
  } else {
    res.status(400).send(UserValidationResult.TakenFacialId);
  }
});
