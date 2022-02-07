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
    description: "gives you the weather in a precise format",
    cooldown: 5,
    async execute(message, args) {
        const user = message.author;
        message.reply(`Did you mean '-w', <@${user.id}>?`);
        return;
    },
};
