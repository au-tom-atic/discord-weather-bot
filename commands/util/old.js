const axios = require("axios");
const Discord = require("discord.js");

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
