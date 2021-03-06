const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const userQuery = require("../../sequelize/controllers/user.js");
dotenv.config();

module.exports = {
    name: "units",
    aliases: ["u"],
    description: "Saves your units preference",
    cooldown: 15,
    args: true,
    async execute(message, args) {
        if (args[0] != "imperial" && args[0] != "metric") {
            message.reply(`please enter 'imperial' or 'metric'`);
            return;
        }

        let user;

        if (args[0] === "imperial") {
            user = {
                user_id: message.author.id,
                units: "imperial",
            };
        }

        if (args[0] === "metric") {
            user = {
                user_id: message.author.id,
                units: "metric",
            };
        }

        const { item, created } = await userQuery
            .updateOrCreate(message.author.id, user)
            .then()
            .catch((e) => {
                console.log(e);
            });

        if (created) {
            message.reply(`Saved your units preference as ${args[0]}`);
        } else {
            message.reply(`Updated your units preference as ${args[0]}`);
        }
    },
};
