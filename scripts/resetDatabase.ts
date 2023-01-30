import fs from "fs/promises";
import { Sequelize } from '@sequelize/core';

(async () => {
  try {
    const sqlite = "./database.db";

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
    
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: sqlite,
    })
    
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