const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
dotenv.config();

module.exports = {
    name: "units",
    aliases: ["u"],
    description: "Saves your preferred units",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        
    }
};