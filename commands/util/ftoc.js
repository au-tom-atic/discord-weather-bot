const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "FtoC",
    aliases: ["f2c", "fc", "ftoc", "celsius", "c"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 3,
    args: true,
    async execute(message, args) {
        //console.log(`original input: ${args[0]}`)

        const fahrenheit = args[0].replace(/[^-?\d*\.?\d+$]/g, '');

        //console.log(`stripped input: ${fahrenheit}`)

        const celsisus = +((fahrenheit - 32) * (5 / 9)).toFixed(2);

        //console.log(`result: ${celsisus}`);

        message.channel.send(`${fahrenheit}°F = ${celsisus}°C`);
    },
};
