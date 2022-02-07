const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "CtoF",
    aliases: ["c2f", "cf", ,"ctof", "fahrenheit"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 15,
    args: true,
    async execute(message, args) {
        const celsisus = args[0]

        const fahrenheit = (celsisus * 1.8) + 32

        message.channel.send(`${fahrenheit}°F`);
    },
};
