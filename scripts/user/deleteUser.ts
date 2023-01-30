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

  const facialId = prompt('What is the facialId for a user to delete? ');

  await User.destroy({
    where: {
      facialId
    }
  });

  // sqlite3 database.db 
  // SELECT * FROM users;

  // const { count, rows } = await User.findAndCountAll();
  // console.log(rows);
  // console.log(count);
})();