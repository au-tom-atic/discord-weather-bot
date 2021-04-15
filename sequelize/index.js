const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL);

const modelDefiners = [
    require('./models/users.model.js')
]

for(const modelDefiner of modelDefiners){
    modelDefiner(sequelize);
}

module.exports = sequelize;