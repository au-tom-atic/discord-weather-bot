const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
    name: "CtoF",
    aliases: ["c2f", "cf", ,"ctof", "fahrenheit"],
    description: "Converts a temperature from C to F, or F to C",
    cooldown: 3,
    args: true,
    async execute(message, args) {
        console.log(`original input: ${args[0]}`)
        const celsisus = args[0].replace(/[^-?\d*\.?\d+$]/g, '');
        console.log(`stripped input: ${celsisus}`)

        const fahrenheit = ((celsisus * (9 / 5)) + 32).toFixed(3);

        console.log(`result: ${fahrenheit}`);

        message.channel.send(`${fahrenheit}°F`);
    },
};
