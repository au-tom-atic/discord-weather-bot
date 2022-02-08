const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "FtoC",
    aliases: ["f2c", "fc", "ftoc", "celsius", "c"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 3,
    args: true,
    async execute(message, args) {
        const fahrenheit = args[0].replace(/[^\d-]/g, '');

        const celsisus = (fahrenheit - 32) * (5 / 9)

        message.channel.send(`${celsisus}°C`);
    },
};
