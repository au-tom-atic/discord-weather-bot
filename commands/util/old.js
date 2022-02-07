const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
const userQuery = require("../../sequelize/controllers/user.js");
dotenv.config();

module.exports = {
    name: "old",
    aliases: ["m", "minimal"],
    description: "deprecated commands",
    cooldown: 5,
    async execute(message, args) {
        message.reply(`Did you mean '-w'?`);
        return;
    },
};
