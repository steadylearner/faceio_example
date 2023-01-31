import { DataTypes } from "sequelize";

import prompt from "../prompt";
import {
  sequelize,
} from "../../db";

const User = require('../../models/user')(sequelize, DataTypes);

// tsconfig.json
// "target": "ES2022",
(async () => {
  
  await sequelize.sync();

  const facialId = prompt('What is the facialId for a user to read? ');

  const dbUser = await User.findOne({
    where: {
      facialId
    }
  });

  console.log("dbUser");
  if (dbUser !== null) {
    console.log(dbUser.toJSON());
  } else {
    console.log(dbUser);
  }


})();