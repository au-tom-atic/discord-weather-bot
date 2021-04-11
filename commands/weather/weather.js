const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoder = require("../../helpers/geocoding.js");
dotenv.config();

module.exports = {
    name: "weather",
    aliases: ["w"],
    description: "gives you the weather, duh",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        let coords;
        try {
            coords = await geocoder.getCoords(args.join(" "));
        } catch (error) {
            console.log(error);
        }

        let apiKey = process.env.WEATHER_KEY;
        let url = `http://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;

        const response = await axios.get(url);
        if (response) {
            const weatherEmbeddedResponse = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Current Weather`)
                .setAuthor('Tom L', 'https://static.thenounproject.com/png/967229-200.png', 'https://github.com/au-tom-atic/discord-weather-bot')
                .setURL('https://openweathermap.org')
                .setDescription(`Description for ${response.data.name}`)
                .setThumbnail(
                    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
                )
                .addFields(
                    {
                        name: "Description",
                        value: `${response.data.weather[0].main}, ${response.data.weather[0].description}`,
                    },
                    {
                        name: "Current temp",
                        value: `${response.data.main.temp}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: "Feels Like",
                        value: `${response.data.main.feels_like}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: "Min/Max",
                        value: `${response.data.main.temp_min}\u00B0F/${response.data.main.temp_max}\u00B0F`,
                        inline: true,
                    }
                )
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");
            message.channel.send(weatherEmbeddedResponse);
        }
        else
        {
            message.channel.send('Sorry, something went wrong.');
        }
    },
};
