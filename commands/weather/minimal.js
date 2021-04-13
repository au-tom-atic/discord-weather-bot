const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
dotenv.config();

module.exports = {
    name: "minimal",
    aliases: ["m", "small", "mobile", "ub3r", "compact"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        let coords = await geocoding.getCoords(args.join(" "));
        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial&exclude=minutely,hourly,alerts`;

        const response = await axios.get(url);

        if (response) {
            let weatherEmbeddedResponse = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Weather Forecast`)
                .setAuthor(
                    "Tom L",
                    "https://static.thenounproject.com/png/967229-200.png",
                    "https://github.com/au-tom-atic/discord-weather-bot"
                )
                .setURL("https://openweathermap.org")
                .setThumbnail(
                    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}.png`
                )
                .setDescription(`${args.join(" ")}: ${response.data.current.weather[0].description}`)
                .addFields(
                    {
                        name: `current`,
                        value: `${response.data.current.temp}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: "High",
                        value: `${response.data.daily[0].temp.max}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: "Low",
                        value: `${response.data.daily[0].temp.min}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: "Humidity",
                        value: `${response.data.current.humidity}%`,
                        inline: true,
                    },
                    {
                        name: "Wind",
                        value: `${Compass.cardinalFromDegree(
                            response.data.current.wind_deg
                        )}@${response.data.current.wind_speed}mph`,
                        inline: true,
                    },
                    {
                        name: "Chance of rain",
                        value: `${response.data.daily[0].pop * 100}%`,
                        inline: true,
                    },

                )
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");
            message.channel.send(weatherEmbeddedResponse);
        } else {
            message.channel.send("Sorry, something went wrong.");
        }
    },
};
