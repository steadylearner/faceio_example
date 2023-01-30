import fs from "fs/promises";
// import { Sequelize } from '@sequelize/core';

import {
  sqlite,
  sequelize,
} from "../db";

(async () => {
  try {
    try {
      const sqliteExsits = await fs.stat(sqlite);
      // console.log("sqliteExsits");
      // console.log(sqliteExsits);

      if (sqliteExsits) {
        await fs.rm(sqlite);
      }
    } catch (error) {
      // console.error(error);
    }
    
    // console.log(sequelize);

    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    sequelize.close()
  } catch (error) {
    console.error('Unable to reset the database:', error);
  } finally {
  }
})();

export {}