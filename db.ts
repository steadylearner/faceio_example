// import { Sequelize } from '@sequelize/core';
import { Sequelize } from 'sequelize'; // Use this instead to use CLI for migrations

const sqlite = "./database.db";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: sqlite,
})

export {
  sqlite,
  sequelize,
}
