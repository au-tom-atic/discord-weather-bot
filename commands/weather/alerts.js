const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const { models } = require('../../sequelize');
dotenv.config();

module.exports = {
    name: "alerts",
    aliases: ["a", "advisory"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    async execute(message, args) {
        let locationData;
        if(!args.length)
        {
            console.log('user did not enter location argument');
            const {found, foundUser} = await model.findUser( models.user, { user_id: message.author.id });
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
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.coords.lat}&lon=${locationData.coords.lng}&appid=${apiKey}&units=imperial&exclude=minutely,hourly,daily`;

        const response = await axios.get(url);

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
                    .setDescription(`Alert from ${alert.sender_name} for ${locationData.placeName}`)
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
