const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATBASE, process.env.DB_USER , process.env.DB_PW, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
        "ssl": true
      }
});

const modelDefiners = [
    require('./models/users.model.js')
]

for(const modelDefiner of modelDefiners){
    modelDefiner(sequelize);
}

module.exports = sequelize;