const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
    uri=process.env.DB_URI,
    options={
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

const modelDefiners = [require("./models/users.model.js")];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize;
