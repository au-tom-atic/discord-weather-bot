const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const userQuery = require('../../sequelize/controllers/user.js')
dotenv.config();

module.exports = {
    name: "alerts",
    aliases: ["a", "advisory"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    async execute(message, args) {
        let { found, userData } = await userQuery.findUser(message.author.id).then().catch(e => {console.log(e)});

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
            locationData = await geocoding.getCoords(args.join(" ")).then().catch(e => {console.log(e)});
            userData.lng = locationData.coords.lng;
            userData.lat = locationData.coords.lat;
            userData.placeName = locationData.placeName;
        }

        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${userData.lat}&lon=${userData.lng}&appid=${apiKey}&units=${userData.units}&exclude=minutely,hourly,daily`;

        const response = await axios.get(url).then().catch(e => {console.log(e)});

        if (response && response.data.alerts) {
            for (const [index, alert] of response.data.alerts.entries()) {
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
                        `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
                    )
                    .setDescription(`Alert from ${alert.sender_name} for ${userData.placeName}`)
                    .addFields(
                        {
                            name: `❗Event`,
                            value: `${alert.event}`,
                            inline: true
                        },
                        {
                            name: '⏲️Start',
                            value: `${new Date(alert.start * 1000).toLocaleString("en-US",{ timeZone: response.data.timezone })}`,
                            inline: true
                        },
                        {
                            name: '⏲️End',
                            value: `${new Date(alert.end * 1000).toLocaleString("en-US",{ timeZone: response.data.timezone })}`,
                            inline: true
                        }
                    )
                    .setTimestamp()
                    .setFooter("weather data provided by openweathermap");
                message.channel.send(weatherEmbeddedResponse);
            }
        } else {
            if(!response.data.alerts) {
                message.channel.send('No weather advisories for that area')
            }
            else {
                message.channel.send("Sorry, something went wrong.");
            }
            
        }
    },
};
