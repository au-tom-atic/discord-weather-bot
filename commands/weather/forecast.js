const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require('../../helpers/geocoding');
dotenv.config();

module.exports = {
    name: "forecast",
    aliases: ["f"],
    description: "gives you a 7 day forecast",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        let coords = await geocoding.getCoords(args.join(' '));
        console.log(coords)
        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    
        const response = await axios.get(url);

        if(repsone)
        {

        }
    
    }
}