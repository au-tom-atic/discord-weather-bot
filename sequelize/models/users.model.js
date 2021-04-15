const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('user', {
		user_id: {
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
			type: DataTypes.STRING
		},
        placeName: {
            allowNull: true,
            type: DataTypes.STRING
        },
        lat:
        {
            allowNull: true,
            type: DataTypes.FLOAT
        },
        lng:
        {
            allowNull: true,
            type: DataTypes.FLOAT
        },
        units:
        {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
	});
};

module.exports.findUser = async (model, where) => {
    // First try to find the record
   const foundUser = await model.findOne({where});
   if (foundUser) {
        return  {found: true, foundUser};
    } else {
        return {found: false}
    }
}