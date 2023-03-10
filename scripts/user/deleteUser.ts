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

  const deleteUsers = prompt('Do you want to delete all users? (Y/n) ', "n");

  if (deleteUsers === "Y") {
    const truncatedUserCount = await User.truncate();
    console.log("truncatedUserCount");
    console.log(truncatedUserCount);
  } else {
    const facialId = prompt('What is the facialId for a user to delete? ');

    const destroyedUserCount = await User.destroy({
      where: {
        facialId
      }
    });

    console.log("destroyedUserCount");
    console.log(destroyedUserCount);

    // sqlite3 database.db 
    // SELECT * FROM users;

    // const { count, rows } = await User.findAndCountAll();
    // console.log(rows);
    // console.log(count);
  }

})();