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

  const name = prompt('What is the name for a new user? ', 'Name');
  const email = prompt('What is the email for a new user? ', "email@example.com");

  const newUser = await User.create({
    name,
    email,
  });

  console.log("newUser");
  console.log(newUser.toJSON());
})();