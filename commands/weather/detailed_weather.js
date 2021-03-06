const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding.js");
const Compass = require("cardinal-direction");
const userQuery = require("../../sequelize/controllers/user.js");
dotenv.config();

module.exports = {
    name: "detailed",
    aliases: ["d", "dw", "detail"],
    description: "gives you detailed weather, duh",
    cooldown: 5,
    async execute(message, args) {
        let { found, userData } = await userQuery
            .findUser(message.author.id)
            .then()
            .catch((e) => {
                console.log(e);
            });

        if (!found && !args.length) {
            message.reply(
                "Please provide a location or save your location using -location"
            );
            return;
        }

        if(found){
            if(!userData.lng && !userData.lat && !userData.placeName)
            {
                message.reply('Please provide a location or save your location using -location');
            }
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
            locationData = await geocoding
                .getCoords(args.join(" "))
                .then()
                .catch((e) => {
                    console.log(e);
                });
            userData.lng = locationData.coords.lng;
            userData.lat = locationData.coords.lat;
            userData.placeName = locationData.placeName;
        }

        let degreesUnits, velocityUnits;

        if (userData.units == "imperial") {
            degreesUnits = "F";
            velocityUnits = "mph";
            distanceUnits = "ft";
        }

        if (userData.units == "metric") {
            degreesUnits = "C";
            velocityUnits = "m/s";
            distanceUnits = "km";
        }

        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${userData.lat}&lon=${userData.lng}&appid=${apiKey}&units=${userData.units}&exclude=minutely,hourly,alerts`;

        const response = await axios
            .get(url)
            .then()
            .catch((e) => {
                console.log(e);
            });
        if (response) {
            let timestamp = response.data.current.dt;
            let forecastDate = new Date(timestamp * 1000);
            const weatherEmbeddedResponse = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Current Weather`)
                .setAuthor(
                    `${userData.placeName}`,
                    "https://static.thenounproject.com/png/967229-200.png",
                    "https://github.com/au-tom-atic/discord-weather-bot"
                )
                .setURL("https://openweathermap.org")
                .setDescription(`${response.data.daily[0].weather[0].description}`)
                .setThumbnail(
                    `http://openweathermap.org/img/wn/${response.data.daily[0].weather[0].icon}.png`
                )
                .addFields(
                    {
                        name: "???????Chance of Rain",
                        value: `${response.data.daily[0].pop * 100}%`,
                        inline: true,
                    },
                    {
                        name: "????Humidity",
                        value: `${response.data.daily[0].humidity}%`,
                        inline: true,
                    },
                    {
                        name: "????Wind",
                        value: `${Compass.cardinalFromDegree(
                            response.data.daily[0].wind_deg
                        )}@${
                            response.data.daily[0].wind_speed
                        }${velocityUnits}`,
                        inline: true,
                    },
                    {
                        name: "???????Morning Temp",
                        value: `${response.data.daily[0].temp.morn}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "???????Day Temp",
                        value: `${response.data.daily[0].temp.day}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "???????Night Temp",
                        value: `${response.data.daily[0].temp.night}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "????Morning Feels Like",
                        value: `${response.data.daily[0].feels_like.morn}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "??????Day Feels Like",
                        value: `${response.data.daily[0].feels_like.day}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "????Night Feels Like",
                        value: `${response.data.daily[0].feels_like.night}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "---Current---",
                        value: `????Local time: ${forecastDate.toLocaleString(
                            "en-US",
                            { timeZone: response.data.timezone }
                        )}`,
                    },
                    {
                        name: "???????Temp",
                        value: `${response.data.current.temp}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "???????Feels Like",
                        value: `${response.data.current.feels_like}\u00B0${degreesUnits}`,
                        inline: true,
                    },
                    {
                        name: "????Description",
                        value: `${response.data.current.weather[0].main}, ${response.data.current.weather[0].description}`,
                        inline: true,
                    },
                    {
                        name: "????Visibility",
                        value: `${response.data.current.visibility} ${distanceUnits}`,
                        inline: true,
                    },
                    {
                        name: "????Wind",
                        value: `${Compass.cardinalFromDegree(
                            response.data.current.wind_deg
                        )}@${response.data.current.wind_speed}${velocityUnits}`,
                        inline: true,
                    },
                    {
                        name: "??????Cloud Coverage",
                        value: `${response.data.current.clouds}%`,
                        inline: true,
                    },
                    {
                        name: "????UV Index",
                        value: `${response.data.current.uvi}`,
                        inline: true,
                    },
                    {
                        name: "????Humidity",
                        value: `${response.data.current.humidity}%`,
                        inline: true,
                    },
                    {
                        name: "????Dew Point",
                        value: `${response.data.current.dew_point}\u00B0${degreesUnits}`,
                        inline: true,
                    }
                )
                .setImage(
                    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
                )
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");
            message.channel.send(weatherEmbeddedResponse);
        } else {
            message.channel.send("Sorry, something went wrong.");
        }
    },
};
