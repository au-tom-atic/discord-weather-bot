const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
dotenv.config();

module.exports = {
    name: "forecast",
    aliases: ["f"],
    description: "gives you a 3 day forecast",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        let coords = await geocoding.getCoords(args.join(" "));
        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial&exclude=minutely,hourly,alerts,current`;

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
                .setDescription(`3 forcast for ${args.join(" ")}`)
                .setThumbnail
                //`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
                ()
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");

            for (const [index, day] of response.data.daily.entries()) {
                if (index === 0)
                    weatherEmbeddedResponse.setThumbnail(
                        `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                    );
                if (index === 3) break;
                let timestamp = day.dt;
                let forecastDate = new Date(timestamp * 1000);
                var month = forecastDate.getMonth() + 1;
                var date = forecastDate.getDate();
                var year = forecastDate.getFullYear();

                weatherEmbeddedResponse.addFields(
                    {
                        name: `---${month}/${date}/${year}---`,
                        value: `${day.weather[0].description}`
                    },
                    {
                        name: `Min Temp`,
                        value: `${day.temp.min}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: `Max Temp`,
                        value: `${day.temp.max}\u00B0F`,
                        inline: true,
                    },
                    {
                        name: 'Chance of rain',
                        value: `${day.pop}%`,
                        inline: true
                    },
                    {
                        name: 'Humidity',
                        value: `${day.humidity}%`,
                        inline: true
                    },
                    {
                        name: 'Dew Point',
                        value: `${day.dew_point}\u00B0F`,
                        inline: true
                    },
                    {
                        name: 'Wind',
                        value: `${Compass.cardinalFromDegree(day.wind_deg)}@${day.wind_speed}mph`,
                        inline: true
                    },
                    {
                        name: 'UV Index',
                        value: `${day.uvi}`,
                        inline: true
                    },
                    {
                        name: 'Sunrise',
                        value: `${new Date(day.sunrise* 1000).toLocaleTimeString('en-US', {timeZone: response.data.timezone})}`,
                        inline: true
                    },
                    {
                        name: 'Sunset',
                        value: `${new Date(day.sunset* 1000).toLocaleTimeString('en-US', {timeZone: response.data.timezone})}`,
                        inline: true
                    }

                );
            }

            message.channel.send(weatherEmbeddedResponse);
        } else {
            message.channel.send("Sorry, something went wrong.");
        }
    },
};
