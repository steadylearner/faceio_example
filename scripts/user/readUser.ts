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

  const id = prompt('What is the id for a user to read? ');

  const dbUser = await User.findOne({
    where: {
      id
    }
  });

  console.log("dbUser");
  console.log(dbUser);


})();