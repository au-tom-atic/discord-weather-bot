const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
const { models } = require('../../sequelize');
dotenv.config();

module.exports = {
    name: "minimal",
    aliases: ["m", "small", "mobile", "ub3r", "compact"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    async execute(message, args) {
        let locationData;
        if(!args.length)
        {
            console.log('user did not enter location argument');
            const {found, foundUser} = await findUser( models.user, { user_id: message.author.id });
            if(found)
            {
                locationData = {
                    placeName: foundUser.dataValues.placeName,
                    coords: {
                        lng: foundUser.dataValues.lng,
                        lat: foundUser.dataValues.lat
                    }
                }
                console.log(foundUser)
            }
            else
            {
                message.reply(`please enter a location or save one with the -location command`);
                return;
            }

        }else{
            console.log('user entered location argument');
            try {
                locationData = await geocoder.getCoords(args.join(" "));
            } catch (error) {
                console.log(error);
            }
        }

        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.coords.lat}&lon=${locationData.coords.lng}&appid=${apiKey}&units=imperial&exclude=minutely,hourly,alerts`;

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
                .setDescription(`${locationData.placeName}: ${response.data.current.weather[0].description}`)
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
