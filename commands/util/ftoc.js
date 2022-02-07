const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "FtoC",
    aliases: ["f2c", "fc", "ftoc", "celsius", "c"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 15,
    args: true,
    async execute(message, args) {
        const fahrenheit = args[0]

        const celsisus = (fahrenheit - 32) * 0.555

        message.channel.send(`${celsisus}°C`);
    },
};
