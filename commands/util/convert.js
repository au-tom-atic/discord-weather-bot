const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "convert",
    aliases: ["c", "conversion"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 15,
    args: true,
    async execute(message, args) {
        message.reply(`This feature is coming soon!`);
    },
};
