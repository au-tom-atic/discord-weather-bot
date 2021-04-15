const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
const userQuery = require("../../sequelize/controllers/user.js");
dotenv.config();

module.exports = {
    name: "minimal",
    aliases: ["m", "small", "mobile", "ub3r", "compact"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    async execute(message, args) {
        let { found, userData } = await userQuery.findUser(message.author.id).catch(e => {console.log(e)});

        if (!found && !args.length) {
            message.reply(
                "Please provide a location or save your location using -location"
            );
            return;
        }

        if (!found) {
            userData = {
                lat: null,
                lng: null,
                placeName: null,
                units: "imperial",
            };
        }

        if (args.length) {
            locationData = await geocoding.getCoords(args.join(" ")).catch(e => {console.log(e)});
            userData.lng = locationData.coords.lng;
            userData.lat = locationData.coords.lat;
            userData.placeName = locationData.placeName;
        }

        let degreesUnits, velocityUnits;

        if (userData.units == "imperial") {
            degreesUnits = "F";
            velocityUnits = "mph";
        }

        if (userData.units == "metric") {
            degreesUnits = "C";
            velocityUnits = "km/h";
        }

        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${userData.lat}&lon=${userData.lng}&appid=${apiKey}&units=${userData.units}&exclude=minutely,hourly,alerts`;

        const response = await axios.get(url).catch(e => {console.log(e)});

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
                .setDescription(
                    `${userData.placeName}: ${response.data.current.weather[0].description}`
                )
                .addFields(
                    {
                        name: `current`,
                        value: `${response.data.current.temp}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "High",
                        value: `${response.data.daily[0].temp.max}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "Low",
                        value: `${response.data.daily[0].temp.min}\u00B0${degreesUnits}`,
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
                        )}@${response.data.current.wind_speed}${velocityUnits}`,
                        inline: true,
                    },
                    {
                        name: "Chance of rain",
                        value: `${response.data.daily[0].pop * 100}%`,
                        inline: true,
                    }
                )
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");
            message.channel.send(weatherEmbeddedResponse);
        } else {
            message.channel.send("Sorry, something went wrong.");
        }
    },
};
