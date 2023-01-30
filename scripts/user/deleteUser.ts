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

  const id = prompt('What is the id for a user to delete? ');

  await User.destroy({
    where: {
      id
    }
  });

  // sqlite3 database.db 
  // SELECT * FROM users;

  // const { count, rows } = await User.findAndCountAll();
  // console.log(rows);
  // console.log(count);
})();