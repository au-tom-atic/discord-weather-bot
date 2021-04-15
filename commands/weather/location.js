const axios = require("axios");
const { models } = require('../../sequelize');
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
dotenv.config();

async function updateOrCreate (model, where, newItem) {
    // First try to find the record
   const foundItem = await model.findOne({where});
   if (!foundItem) {
        // Item not found, create a new one
        const item = await model.create(newItem)
        return  {item, created: true};
    }
    // Found an item, update it
    const item = await model.update(newItem, {where});
    return {item, created: false};
}

module.exports = {
    name: "location",
    aliases: ["l"],
    description: "Saves your location",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        //get location
        let locationData = await geocoding.getCoords(args.join(" "));
        let user = {
            user_id: message.author.id,
            placeName: locationData.placeName,
            lat: locationData.coords.lat,
            lng: locationData.coords.lng
        }
        const {item, created} = await updateOrCreate( models.user, { user_id: message.author.id }, user);

        console.log(item);
        console.log(created);

    }
};
