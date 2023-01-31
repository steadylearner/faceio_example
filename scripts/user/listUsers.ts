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

    // const users = await User.findAll();
    const { count, rows } = await User.findAndCountAll();

    console.log("count");
    console.log(count);

    for (let row of rows) {
        console.log(row.toJSON());
    } 

})();