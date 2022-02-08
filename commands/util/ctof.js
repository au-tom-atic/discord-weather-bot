const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "CtoF",
    aliases: ["c2f", "cf", ,"ctof", "fahrenheit"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 3,
    args: true,
    async execute(message, args) {
        const celsisus = args[0].replace(/[^\d-]/g, '');

        const fahrenheit = (celsisus * (9 / 5)) + 32

        message.channel.send(`${fahrenheit}°F`);
    },
};
