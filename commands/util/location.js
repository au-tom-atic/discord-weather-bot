const axios = require("axios");
const { models } = require('../../sequelize');
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const userQuery = require('../../sequelize/controllers/user.js')
dotenv.config();

module.exports = {
    name: "location",
    aliases: ["l"],
    description: "Saves your location",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        //get location
        let locationData = await geocoding.getCoords(args.join(" ")).catch(e => {console.log(e)});
        let user = {
            user_id: message.author.id,
            placeName: locationData.placeName,
            lat: locationData.coords.lat,
            lng: locationData.coords.lng
        }
        const {item, created} = await userQuery.updateOrCreate(message.author.id, user).catch(e => {console.log(e)});

        if(created)
        {
            message.reply(`Saved location ${item.placeName} for you`);
        }
        else
        {
            message.reply(`Updated saved location`);
        }

    }
};
